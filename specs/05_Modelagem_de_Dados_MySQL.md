# Spec: PRD — 05 Modelagem de Dados MySQL

**Versão:** 1.0
**Status:** Draft
**Autor:** Equipe de Desenvolvimento
**Data:** 2026-06-23
**Reviewers:** Arquiteto de Banco de Dados

---

## 1. Resumo

Estrutura relacional de banco de dados (`MySQL`) para suportar o armazenamento persistente dos contratos, cláusulas, resumos, relacionamento com usuários (para auditoria) e os relacionamentos 1:N com Empresa e anexos físicos do contrato.

---

## 2. Contexto e Motivação

**Problema:**
Armazenar de forma rastreável todos os dados que a Inteligência Artificial gerou para possibilitar que os fiscais editem as cláusulas, garantindo auditoria e controle de múltiplos PDFs vinculados ao mesmo processo de contratação.

---

## 3. Goals (Objetivos)

- [ ] G-01: Estruturar Tabelas de Usuários com Perfis (RBAC).
- [ ] G-02: Estruturar Entidade Empresa (CNPJ único).
- [ ] G-03: Estruturar a centralização via Entidade Contrato.
- [ ] G-04: Estruturar Múltiplos Documentos, Cláusulas atreladas a páginas de PDF e Logs de Auditoria.

**Métricas de sucesso:**
| Métrica | Baseline atual | Target | Prazo |
|---------|---------------|--------|-------|
| Integridade Referencial | N/A | 100% de Foreign Keys Ativas | MVP |

---

## 4. Non-Goals (Fora do Escopo)

- NG-01: Bancos de dados não relacionais (NoSQL). O sistema utilizará MySQL restrito e relacional para estruturação do MVP.

---

## 5. Usuários e Personas

**Usuário primário:** Sistema Backend operando via SQLAlchemy (ORM).

---

## 6. Requisitos Funcionais

### 6.1 Requisitos Principais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | Tabela de Usuários | Must | Controle de login, níveis ('admin', 'fiscal', etc) e hash de senha. |
| RF-02 | Tabela de Empresas | Must | CNPJ é chave primária lógica (unique). Evita duplicação. |
| RF-03 | Tabela de Contratos | Must | Centro do esquema, possuindo FK para Empresa e para Usuário (criador). |
| RF-04 | Tabela Documentos Anexos | Must | Referência para os múltiplos arquivos do contrato (`caminho_storage`). |
| RF-05 | Tabela Cláusulas e Logs | Must | Relacionar extrações às páginas do PDF, e mudanças via Log de Auditoria. |

### 6.2 Relacionamento Principal

O **Contrato é a entidade centralizadora** do sistema.
- 1 Empresa -> N Contratos
- 1 Contrato -> N Documentos Anexos
- 1 Contrato -> N Clausulas
- 1 Contrato -> N Auditoria Logs

### 6.3 Fluxos Alternativos

- Se uma Empresa for deletada, a política de remoção deve decidir se bloqueia a ação (Restricted) por já ter Contratos anexados, evitando corrupção.

---

## 7. Requisitos Não-Funcionais

| ID | Requisito | Valor alvo | Observação |
|----|-----------|-----------|------------|
| RNF-01 | Sistema | MySQL | Banco relacional robusto. |
| RNF-02 | Camada Backend | SQLAlchemy | ORM oficial usado na FastAPI do MVP. |

---

## 8. Design e Interface

**Componentes afetados:**
Diagrama de Entidade e Relacionamento invisível para o usuário comum. Apenas acessível por admins via DBeaver.

---

## 9. Modelo de Dados (Tabelas)

1. `usuarios`: id, nome, username, senha_hash, nivel_acesso, is_ativo, criado_em.
2. `empresas`: id, cnpj, nome.
3. `contratos`: id, empresa_id, criado_por, nome_contrato, numero_contrato, resumo, sms_checklist (JSON), status_auditoria.
4. `documentos_anexos`: id, contrato_id, nome_arquivo, tipo_documento, caminho_storage.
5. `clausulas`: id, contrato_id, documento_anexo_id, tipo, texto_extraido, pagina_origem.
6. `auditoria_logs`: id, contrato_id, usuario_id, campo_alterado, valor_antigo, valor_novo, data_alteracao.

---

## 10. Integrações e Dependências

| Dependência | Tipo | Impacto se indisponível |
|-------------|------|------------------------|
| Serviço do Banco de Dados | Docker Service | Se o container db não subir, FastAPI falha ao ligar. |

---

## 11. Edge Cases e Tratamento de Erros

| Cenário | Trigger | Comportamento esperado |
|---------|---------|----------------------|
| EC-01: Cadastro duplicado | Inserir Empresa com mesmo CNPJ | MySQL impede via restrição de campo UNIQUE, Backend devolve Erro e contorna reaproveitando o ID. |

---

## 12. Segurança e Privacidade

- **Senhas:** Usar bibliotecas de hashing (ex: `passlib` via `bcrypt`) para salvar as senhas na tabela Usuário.
- **Auditoria Rastreável:** A tabela `auditoria_logs` guarda precisamente qual ID de usuário modificou os dados da Inteligência Artificial.

---

## 13. Plano de Rollout

- **Estratégia:** Deploy do Schema SQL no contêiner durante inicialização (`init.sql`).

---

## 14. Open Questions
- Devo implementar soft-delete (`is_deleted`) futuramente?
