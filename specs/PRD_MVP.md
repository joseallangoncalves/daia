# Spec: PRD — Fiscalização de Contratos MVP

**Versão:** 1.0
**Status:** Draft
**Autor:** Equipe de Desenvolvimento
**Data:** 2026-06-23
**Reviewers:** Fiscal, Gestor

---

## 1. Resumo

Um sistema multiagentes automatizado, desenvolvido em Python, focado na extração, processamento e estruturação de dados contratuais (PDFs). A solução utiliza inteligência artificial para identificar cláusulas essenciais e automatizar checklists, apresentando as informações de forma centralizada em um dashboard inteligente, reduzindo a carga cognitiva e otimizando a fiscalização.

---

## 2. Contexto e Motivação

**Problema:**
Sobrecarga cognitiva e desalinhamento operacional na fiscalização de contratos devido à descentralização de informações relevantes das obrigações contratuais. A informação está dispersa em múltiplos documentos não estruturados, causando perda de tempo (redução de 25% na análise), lentidão nas decisões e risco no controle de prazos e multas.

**Por que agora / A Solução:**
A automação com IA permite centralizar e estruturar essas informações, facilitando o trabalho do fiscal. O uso de agentes nativos e LLMs processará os dados rapidamente, mitigando o risco de controle de prazos e multas.

---

## 3. Goals (Objetivos)

- [ ] G-01: Extrair número do documento, CNPJ e nomes das empresas automaticamente via Python (pypdf/pdfplumber + LLM).
- [ ] G-02: Extrair cláusulas essenciais via SDK oficial (OpenAI/Google GenAI) em formato estruturado.
- [ ] G-03: Automatizar checklist de SMS (Segurança, Meio Ambiente e Saúde) baseado em evidências no documento.
- [ ] G-04: Disponibilizar dashboard web interativo para visualização centralizada dos dados estruturados.
- [ ] G-05: Permitir o ajuste manual dos dados extraídos pela IA, mantendo a soberania humana e exatidão dos dados.

**Métricas de sucesso:**
| Métrica | Baseline atual | Target | Prazo |
|---------|---------------|--------|-------|
| Tempo de análise do contrato | 100% | Redução de 25% | MVP |
| Entrega do MVP | Não iniciado | 03/07/2026 | 03/07/2026 |

---

## 4. Non-Goals (Fora do Escopo)

- NG-01: Não terá processamento pesado na máquina local (sem uso de GPU local); o processamento pesado será nas APIs.
- NG-02: Não usará outras linguagens de programação para a lógica de agentes além de Python.

---

## 5. Usuários e Personas

**Usuário primário:** Fiscal, Gestor, Auditor.

**Jornada atual (sem a feature):**
Os fiscais analisam manualmente múltiplos documentos não estruturados, gastando muito tempo para achar as cláusulas de multas, vigência e regras de SMS.

**Jornada futura (com a feature):**
O fiscal acessa o painel web, onde o contrato processado pelo pipeline de IA já tem cláusulas, multas e checklist de SMS extraídos, e pode apenas validar, corrigir se necessário e auditar o histórico.

---

## 6. Requisitos Funcionais

### 6.1 Requisitos Principais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | Módulo de Ingestão de PDFs | Must | Extração de número do documento, CNPJ e partes envolvidas (HU-01). |
| RF-02 | Agente Analista de Cláusulas | Must | Extrair obrigações, prazos e condições de forma estruturada (HU-02). |
| RF-03 | Agente Analista de Medição e SMS | Must | Extrair critérios de medição e checklist de SMS com indicação da página (HU-03). |
| RF-04 | Interface Web (Dashboard) | Must | Visualização dos dados, tabelas, cards e estatísticas (HU-04, HU-05). |
| RF-05 | Formulários de Ajuste Manual | Must | Fiscal pode editar os dados da IA (HU-06). |
| RF-06 | Logs e Auditoria | Must | Histórico de alterações salvo em SQLite/PostgreSQL (HU-07). |

### 6.2 Fluxo Principal (Happy Path)

1. O PDF do contrato é inserido no sistema.
2. O script Python lê o PDF e segmenta páginas com palavras-chave.
3. Os Agentes (Ingestão, Cláusulas, Medição, SMS) extraem dados estruturados via API de LLM.
4. Os dados são processados e salvos.
5. O fiscal acessa o Dashboard Web, visualiza o checklist e os dados.
6. O fiscal valida e aprova os dados do contrato.

### 6.3 Fluxos Alternativos

**Fluxo Alternativo A — Alucinação da IA:**
1. O Agente de IA extrai um valor de multa incorreto.
2. O fiscal identifica o erro no dashboard web.
3. O fiscal utiliza o formulário de contingência para corrigir o valor.
4. O sistema salva a correção e gera um log da alteração para auditoria.

---

## 7. Requisitos Não-Funcionais

| ID | Requisito | Valor alvo | Observação |
|----|-----------|-----------|------------|
| RNF-01 | Linguagem de Programação | Python puro | Para os agentes, logic server. |
| RNF-02 | Armazenamento / DB | SQLite | Leveza no dimensionamento. |
| RNF-03 | Infraestrutura | Docker | Ambiente configurado isolado e com chaves de API. |
| RNF-04 | Prazo de Entrega MVP | 03/07/2026 | Restrição temporal forte. |

---

## 8. Design e Interface

**Componentes afetados:** Painel Web construído em React, Django ou Streamlit.

**Estados da UI:**
- Dashboard com dados estruturados e estatísticos (tabelas, cards interativos).
- Formulários de edição para os fiscais corrigirem dados extraídos pela IA.
- Tabela de logs de auditoria mostrando Usuário, campo modificado, valores antigos/novos e timestamp.

---

## 9. Modelo de Dados

**Entidades modificadas/persistidas (SQLite/PostgreSQL):**

```sql
logs_auditoria {
  id: string
  usuario_id: string
  campo_modificado: string
  valor_antigo: string
  valor_novo: string
  timestamp: datetime
}

contratos {
  id: string
  numero: string
  cnpj: string
  partes: string
  datas: string
  valores: string
}
```

---

## 10. Integrações e Dependências

| Dependência | Tipo | Impacto se indisponível |
|-------------|------|------------------------|
| API de LLM (OpenAI/Google GenAI) | Obrigatória | IA não funcionará, impossibilitando a extração dos dados dos PDFs. |
| Bibliotecas PDF (pypdf/pdfplumber) | Obrigatória | Necessário para o módulo de ingestão conseguir ler os PDFs. |
| Docker | Obrigatória | Essencial para provisionar o ambiente local. |

---

## 11. Edge Cases e Tratamento de Erros

| Cenário | Trigger | Comportamento esperado |
|---------|---------|----------------------|
| EC-01: Alucinação de IA (Risco Crítico) | LLM retorna dado incorreto | Permitir ajuste manual via UI e logar a alteração. |
| EC-02: Alto Custo de Tokens | PDFs muito longos enviados à API | Enviar apenas páginas com palavras-chave estratégicas. |
| EC-03: PDF ilegível | O contrato está escaneado como imagem | Premissa não atendida (falha na extração por bibliotecas padrão). |

---

## 12. Segurança e Privacidade

- **Auditoria:** Todo ajuste manual aos dados extraídos pela IA será registrado com usuário, valores modificados e timestamp.
- **Ambiente:** As chaves de API serão injetadas via variáveis de ambiente seguras.

---

## 13. Plano de Rollout

- **Estratégia:** Provisionamento local isolado em Docker.
- **Prazo:** A ser finalizado e entregue até o dia 03/07/2026.

---

## 14. Open Questions

- Framework definitivo de UI (React, Django ou Streamlit)?
- Abordagem de Autenticação para acesso ao dashboard (gestão de usuários fiscais/auditores)?
