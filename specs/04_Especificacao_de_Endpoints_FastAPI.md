# Spec: PRD — 04 Endpoints FastAPI

**Versão:** 1.0
**Status:** Draft
**Autor:** Equipe de Desenvolvimento
**Data:** 2026-06-23
**Reviewers:** Time de Frontend e Backend

---

## 1. Resumo

Especificação do contrato inicial da API REST a ser construída com o framework **FastAPI**, visando cobrir os requisitos do MVP: recebimento dos PDFs, retorno dos dados extraídos pelos agentes e persistência/auditoria de ajustes no MySQL.

---

## 2. Contexto e Motivação

**Problema:**
Necessidade de uma ponte eficiente de dados entre a Interface de Usuário (React) e a Lógica de Negócios e IA (Python).

**Solução:**
Uma API REST em FastAPI, com autenticação JWT e documentação autogerada por Swagger, retornando sempre as respostas estruturadas para o painel.

---

## 3. Goals (Objetivos)

- [ ] G-01: Prover Autenticação via JWT.
- [ ] G-02: Gestão de Usuários (CRUD para admins).
- [ ] G-03: Rota de Ingestão e Processamento (Upload Multipart).
- [ ] G-04: Rotas de Listagem (Empresas e Contratos) com RBAC de isolamento.
- [ ] G-05: Rota de Detalhes e Auditoria/Correção manual (PUT).

**Métricas de sucesso:**
| Métrica | Baseline atual | Target | Prazo |
|---------|---------------|--------|-------|
| Documentação de API | Ausente | 100% no Swagger | MVP |

---

## 4. Non-Goals (Fora do Escopo)

- NG-01: GraphQL ou gRPC. Apenas REST com JSON no MVP.

---

## 5. Usuários e Personas

**Usuário primário:** Aplicação React (Frontend).

**Jornada da API:**
Autentica com `/login`, envia PDFs no `/upload`, e os usuários navegam puxando listas com `GET /empresas` e editam com `PUT /contracts/{id}`.

---

## 6. Requisitos Funcionais

### 6.1 Requisitos Principais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | JWT Auth | Must | Todas as rotas trancadas por Header Bearer (exceto login). |
| RF-02 | Upload de Múltiplos Arquivos | Must | Endpoint `/upload` aceita lista `files[]`. |
| RF-03 | Isolamento de Dados | Must | Fiscais só veem suas Empresas e Contratos no GET. |
| RF-04 | Atualização/Auditoria | Must | Endpoint PUT altera valores e salva quem atualizou. |

### 6.2 Fluxos e Endpoints

1. `POST /api/v1/auth/login` (Credenciais para JWT)
2. `GET/POST/PUT /api/v1/users` (Gestão administrativa)
3. `POST /api/v1/contracts/upload` (Ingestão do PDF e Início da IA)
4. `GET /api/v1/empresas` e `GET /api/v1/empresas/{cnpj}/contratos` (Listagens do Dashboard)
5. `GET /api/v1/contracts/{id_contrato}` (Detalhes preenchidos)
6. `PUT /api/v1/contracts/{id_contrato}` (Correção de Auditoria)

### 6.3 Fluxos Alternativos

**Token Expirado:** Retorna 401 Unauthorized e a UI (React) desloga o usuário.

---

## 7. Requisitos Não-Funcionais

| ID | Requisito | Valor alvo | Observação |
|----|-----------|-----------|------------|
| RNF-01 | Formato | JSON | Para saídas de dados via REST. |
| RNF-02 | Tratamento de Erro | Status Codes | 400, 401, 404, 422, 500 devem ser usados semânticamente corretos. |

---

## 8. Design e Interface

**Componentes afetados:**
- FastAPI Swagger: exposto na rota `/docs` automaticamente via framework.

---

## 9. Modelo de Dados

**Payloads Típicos:**
- Contrato detalhado, contendo listas internas para "Cláusulas", "Anexos", e "Checklists".

---

## 10. Integrações e Dependências

| Dependência | Tipo | Impacto se indisponível |
|-------------|------|------------------------|
| FastAPI | Core | API não existe. |
| MySQL Driver | Interno | Endpoint dará 500 Internal Error. |

---

## 11. Edge Cases e Tratamento de Erros

| Cenário | Trigger | Comportamento esperado |
|---------|---------|----------------------|
| EC-01: Injeção de Upload Inválido | Arquivo que não seja PDF enviado ao upload | Retornar 422 Unprocessable Entity avisando suporte exclusivo ao PDF. |

---

## 12. Segurança e Privacidade

- Autenticação por token Bearer exigida em 99% das chamadas.
- Endpoints de listagem aplicam restrição WHERE no banco baseado no ID embutido no JWT do requisitante.

---

## 13. Plano de Rollout

- **Estratégia:** Subir a API no Docker na porta 8000 para acesso local.

---

## 14. Open Questions
- Nenhum.
