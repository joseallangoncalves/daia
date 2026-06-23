# Spec: PRD — 02 Inicialização e Configuração de Ambiente

**Versão:** 1.0
**Status:** Draft
**Autor:** Equipe de Desenvolvimento
**Data:** 2026-06-23
**Reviewers:** Time Técnico

---

## 1. Resumo

Este documento contém o passo a passo para o time de desenvolvimento (Backend, Frontend e DevOps) preparar e inicializar o ecossistema do MVP no "Dia 1", utilizando Docker Compose para orquestrar os serviços.

---

## 2. Contexto e Motivação

**Problema:**
A necessidade de padronizar o ambiente de desenvolvimento local para evitar conflitos de dependências ("funciona na minha máquina") entre FastAPI, React e MySQL.

**Solução:**
Uma orquestração sólida via `docker-compose`, permitindo que o ambiente suba rapidamente para qualquer dev, isolando o banco, api e frontend.

---

## 3. Goals (Objetivos)

- [ ] G-01: Prover a estrutura de diretórios recomendada.
- [ ] G-02: Definir as Variáveis de Ambiente (.env).
- [ ] G-03: Definir o Docker Compose com 3 serviços (api, db, web).
- [ ] G-04: Documentar o passo a passo de inicialização.

**Métricas de sucesso:**
| Métrica | Baseline atual | Target | Prazo |
|---------|---------------|--------|-------|
| Tempo de setup do ambiente dev | Horas/Dias | < 10 minutos | Imediato |

---

## 4. Non-Goals (Fora do Escopo)

- NG-01: Deploy em nuvem pública neste documento (apenas inicialização local de dev).

---

## 5. Usuários e Personas

**Usuário primário:** Desenvolvedores de Backend, Frontend e DevOps.

**Jornada atual (sem a feature):**
Configurações manuais na máquina do desenvolvedor de banco de dados, node e python.

**Jornada futura (com a feature):**
Desenvolvedor roda um comando `docker-compose up` e os três serviços sobem prontos.

---

## 6. Requisitos Funcionais

### 6.1 Requisitos Principais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | Configuração do .env | Must | Preencher com senhas locais e API Keys da IA. |
| RF-02 | Docker Compose | Must | Serviço `api` (FastAPI porta 8000), `db` (MySQL porta 3306), `web` (React porta 3000). |
| RF-03 | Acesso as UIs | Must | O Swagger deve estar em /docs e o Front em localhost:3000. |

### 6.2 Fluxo Principal (Happy Path)

1. Dev clona repositório.
2. Cria o arquivo `.env` baseado no modelo.
3. Roda `docker-compose up --build -d`.
4. Dev acessa portas locais e inicia o trabalho.

### 6.3 Fluxos Alternativos

**Falha na Injeção de ENV:**
Se a chave da OpenAI/Gemini não for providenciada, os contêineres podem subir, mas as chamadas falharão na hora do processamento.

---

## 7. Requisitos Não-Funcionais

| ID | Requisito | Valor alvo | Observação |
|----|-----------|-----------|------------|
| RNF-01 | Orquestração | docker-compose | Padrão 3.8 do yaml. |
| RNF-02 | Persistência | Volumes | O MySQL deve possuir um `volume` montado para não perder o banco entre reinicializações. |

---

## 8. Design e Interface

**Componentes afetados:** 
- Interface Swagger: `http://localhost:8000/docs`
- Interface Web Local: `http://localhost:3000`
- Banco Local: Acessível via clientes DBeaver na porta 3306.

---

## 9. Modelo de Dados

**Entidades persistidas:**
- Apenas as montagens de volume docker para preservar as tabelas do sistema de arquivos e `node_modules` em container local.

---

## 10. Integrações e Dependências

| Dependência | Tipo | Impacto se indisponível |
|-------------|------|------------------------|
| Docker Desktop / Daemon | Obrigatória | O ambiente inteiro falha. |
| OpenAI/Gemini API | Dependência Externa | Falha os módulos de Agentes se não houver internet / credencial. |

---

## 11. Edge Cases e Tratamento de Erros

| Cenário | Trigger | Comportamento esperado |
|---------|---------|----------------------|
| EC-01: Portas ocupadas | Dev tem outro processo na 3306 ou 8000 | Container deve exibir falha no bind de porta, necessitando encerramento manual de outro app. |

---

## 12. Segurança e Privacidade

- Variáveis sensíveis como chaves de API NUNCA devem ir para o controle de versão (`.env` no `.gitignore`).

---

## 13. Plano de Rollout

- **Estratégia:** Inicialização em máquina local de dev rodando comandos de `docker`.

---

## 14. Open Questions
- Nenhum.
