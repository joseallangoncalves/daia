# Spec: PRD — 03 Agentes e Pipeline de IA

**Versão:** 1.0
**Status:** Draft
**Autor:** Equipe de Desenvolvimento
**Data:** 2026-06-23
**Reviewers:** Time de Dados e Backend

---

## 1. Resumo

Este documento descreve a arquitetura da inteligência artificial e a pipeline de processamento nativo em Python, voltada à eficiência computacional e mitigação de alucinações através de segmentação e estruturação (Structured Output).

---

## 2. Contexto e Motivação

**Problema:**
Contratos complexos geram custos altos de tokens e confusão no provedor de IA caso enviados inteiros (sem pré-processamento). O retorno sem estruturação exigiria trabalho pesado de parse no sistema.

**Solução:**
Uma pipeline com scripts `pypdf`/`pdfplumber` segmentando os textos, usando múltiplos Agentes Específicos para extrair fatias do conhecimento.

---

## 3. Goals (Objetivos)

- [ ] G-01: Extrair e concatenar textos com marcações lógicas de PDF.
- [ ] G-02: Implementar Agente 1 (Cadastro).
- [ ] G-03: Implementar Agente 2 (Cláusulas).
- [ ] G-04: Implementar Agente 3 (Medição).
- [ ] G-05: Implementar Agente 4 (SMS Checklist).
- [ ] G-06: Implementar Agente 5 (Resumo Executivo).

**Métricas de sucesso:**
| Métrica | Baseline atual | Target | Prazo |
|---------|---------------|--------|-------|
| Retorno estruturado (JSON) | 0% | 100% de precisão de schema | MVP |

---

## 4. Non-Goals (Fora do Escopo)

- NG-01: Não usaremos ferramentas de OCR complexas no MVP (assume-se que PDFs possuem camada de texto pesquisável).

---

## 5. Usuários e Personas

**Usuário primário:** Backend FastAPI comunicando com a API LLM.

**Jornada do Pipeline:**
1. Upload de PDFs no backend.
2. Pypdf extrai e adiciona tags de página.
3. Regex seleciona blocos de texto.
4. Agentes analisam o contexto filtrado e geram os outputs.

---

## 6. Requisitos Funcionais

### 6.1 Requisitos Principais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | Parsing com pypdf | Must | Injetar marcações (ex: `[ID_DOCUMENTO: 1 | ARQUIVO: anexo.pdf | PAGINA: 4]`) |
| RF-02 | Segmentação | Must | Regex fará busca de palavras chaves como "Cláusula" antes de acionar a IA. |
| RF-03 | Structured Output | Must | Uso do `response_format` via Pydantic para respostas exatas. |

### 6.2 Fluxo Principal (Happy Path)

- Agente 1: Analisa primeiras páginas para Número, Nomes, CNPJs.
- Agente 2: Analisa segmentações com "Multa/Obrigação" -> Extrai regras e a `pagina_origem`.
- Agente 3: Analisa "Pagamento/Medição" -> Extrai passos faturamento.
- Agente 4: Analisa SMS -> Retorna checklist exato Sim/Não e páginas.
- Agente 5: Resume o texto geral para gestores.

### 6.3 Fluxos Alternativos

**Regex não encontra palavra-chave:**
O backend pula a requisição ao Agente associado àquela palavra para poupar tokens, e salva o campo como "Não encontrado".

---

## 7. Requisitos Não-Funcionais

| ID | Requisito | Valor alvo | Observação |
|----|-----------|-----------|------------|
| RNF-01 | Performance | Baixo custo token | Somente enviar segmentos de texto validados pelo Python. |
| RNF-02 | Validação | Regex em CNPJ | Validação do código antes mesmo do banco. |

---

## 8. Design e Interface

**Componentes afetados:**
Nenhuma tela de frontend diretamente, mas afeta a injeção do texto estruturado na API REST para posterior consumo.
O comportamento dos agentes é inteiramente guiado pelo modelo presente no diretório `.agents` na raiz do projeto. Cada agente acionado possui sua própria subpasta com um `SKILL.md` contendo o prompt do sistema.

---

## 9. Modelo de Dados

**Estruturas temporárias:**
- Structured Output Pydantic (Retorno exato garantido de chaves no JSON para a API).

---

## 10. Integrações e Dependências

| Dependência | Tipo | Impacto se indisponível |
|-------------|------|------------------------|
| API OpenAI/Google | Externa | Core dos Agentes param. |
| `pypdf` | Interna | Quebra do fluxo de ingestão. |

---

## 11. Edge Cases e Tratamento de Erros

| Cenário | Trigger | Comportamento esperado |
|---------|---------|----------------------|
| EC-01: PDF sem camada de texto | pypdf retorna string vazia | O sistema acusa erro de documento ilegível e falha rapidamente o processamento. |

---

## 12. Segurança e Privacidade

- **Proteção dos Dados:** Nomes de arquivos e IDs do backend jamais expostos na IA como prompts de injeção inseguros.
- O campo "Status Auditoria" forçado como `pendente` no banco garante que nenhum dado inserido vá diretamente para visão final sem validação do fiscal.

---

## 13. Plano de Rollout

- **Estratégia:** Implantado na rota `POST /upload` do backend FastAPI.

---

## 14. Open Questions

- Como aprimorar a regex inicial para contratos fora do padrão?
