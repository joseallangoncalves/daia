# Spec: PRD — 01 Visão Geral e Arquitetura MVP

**Versão:** 1.0
**Status:** Draft
**Autor:** Equipe de Desenvolvimento
**Data:** 2026-06-23
**Reviewers:** Fiscal, Gestor

---

## 1. Resumo

O escopo do projeto é o desenvolvimento de um **Sistema Multiagentes para Otimização da Fiscalização de Contratos** voltado para a extração, processamento e estruturação de dados complexos a partir de documentos contratuais em formato PDF. Este MVP contempla autenticação, ingestão, agentes de extração via IA, painel web, módulo de ajuste manual e auditoria.

---

## 2. Contexto e Motivação

**Problema:**
O processo atual de fiscalização de contratos sofre de **sobrecarga cognitiva e desalinhamento operacional**, decorrente da **descentralização de informações relevantes das obrigações**. Os fiscais e gestores de contrato perdem muito tempo lendo e procurando cláusulas extensas e anexos técnicos complexos, o que abre margem para erros humanos, perda de prazos e alucinação analítica na gestão.

---

## 3. Goals (Objetivos)

- [ ] G-01: Autenticação e Autorização (RBAC) com controle de acesso.
- [ ] G-02: Módulo de Ingestão de múltiplos PDFs.
- [ ] G-03: Agentes de Extração via IA para cadastro, cláusulas, critérios de medição, SMS e resumo inteligente.
- [ ] G-04: Modelagem centralizada de contratos por CNPJ.
- [ ] G-05: Painel Web protegido e centralizado.
- [ ] G-06: Módulo de Ajuste Manual e Auditoria.

**Métricas de sucesso:**
| Métrica | Baseline atual | Target | Prazo |
|---------|---------------|--------|-------|
| Arquitetura definida | Inexistente | Implementada | MVP |

---

## 4. Non-Goals (Fora do Escopo)

- NG-01: O sistema não fará processamento OCR pesado localmente, mas sim a extração de texto pesquisável e uso de API externa.

---

## 5. Usuários e Personas

**Usuários primários:** Administrador, Fiscal, Auditor, Leitor.

**Jornada atual (sem a feature):**
Fiscais leem todos os documentos manualmente sem um sistema unificado.

**Jornada futura (com a feature):**
Fiscal faz login no painel web, cadastra contratos e a IA extrai e estrutura todos os dados. O fiscal pode visualizar ou alterar os dados no dashboard organizado por empresa.

---

## 6. Requisitos Funcionais

### 6.1 Requisitos Principais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | Segurança e Acesso | Alta | Admin pode cadastrar usuários, usuários logados visualizam dashboard. |
| RF-02 | Ingestão e IA | Alta | Extração de metadados, cláusulas, e resumo inteligente via pypdf/LLM. |
| RF-03 | Painel Isolado | Alta | Fiscal só acessa os seus contratos; Admin vê todos os contratos. |
| RF-04 | Gestão e Auditoria | Alta | Fiscal pode editar as informações, com registros para auditores. |

### 6.2 Fluxo Principal (Happy Path)

1. Usuário realiza o Login e acessa o Dashboard.
2. Faz envio de um contrato e seus anexos.
3. IA processa e apresenta os dados.
4. Usuário valida os dados.

### 6.3 Fluxos Alternativos

**Alucinação da IA:**
- O fiscal audita os dados e os altera manualmente. O banco (MySQL) registra as mudanças de log.

---

## 7. Requisitos Não-Funcionais

| ID | Requisito | Valor alvo | Observação |
|----|-----------|-----------|------------|
| RNF-01 | Backend | FastAPI | Python |
| RNF-02 | Banco de Dados | MySQL | Persistência com SQLAlchemy |
| RNF-03 | Frontend | React | Axios ou Fetch |
| RNF-04 | Infraestrutura | Docker | Docker-compose para orquestração |

---

## 8. Design e Interface

**Componentes afetados:** Painel Web (React).

**Estados da UI:**
- Interface de login segura.
- Painel para fiscais verem apenas os próprios contratos.
- Painel para administrador ver dados agrupados por Empresa.
- Interface para os ajustes manuais.

---

## 9. Modelo de Dados

**Entidades modificadas/persistidas em banco (MySQL)**
- Usuários e Acessos
- Empresas (CNPJs)
- Contratos
- Documentos Anexos
- Dados Extraídos (Cláusulas, Checklists SMS)
- Auditoria / Logs

---

## 10. Integrações e Dependências

| Dependência | Tipo | Impacto se indisponível |
|-------------|------|------------------------|
| FastAPI / Python | Obrigatória | Backend |
| React | Obrigatória | Interface do Usuário |
| MySQL | Obrigatória | Banco de Dados relacional |
| Docker | Obrigatória | Deploy do MVP |

---

## 11. Edge Cases e Tratamento de Erros

| Cenário | Trigger | Comportamento esperado |
|---------|---------|----------------------|
| EC-01: Alucinação da IA | Extração de dado falso | Mitigado pela Interface de Ajuste Manual pelo Fiscal. |
| EC-02: Alto Custo de Tokens | Enviar texto inútil para a IA | Mitigado pela segmentação via regex no backend antes do envio para a LLM. |

---

## 12. Segurança e Privacidade

- **Autenticação:** Login e senha para o portal, com diferentes perfis.
- **Autorização:** Fiscais só enxergam contratos cadastrados por eles mesmos.

---

## 13. Plano de Rollout

- **Estratégia:** Deploy em Docker (MySQL, FastAPI e React) para testes do MVP.

---

## 14. Open Questions

- Como refinar a segmentação dos textos para os agentes da melhor forma?
