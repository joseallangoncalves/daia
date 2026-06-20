# Product Requirements Document (PRD) - MVP

## 1. Visão do Produto e Problema
**Problema:** Sobrecarga cognitiva e desalinhamento operacional na fiscalização de contratos devido à descentralização de informações relevantes das obrigações contratuais. A informação está dispersa em múltiplos documentos não estruturados, causando perda de tempo (redução de 25% na análise), lentidão nas decisões e risco no controle de prazos e multas.

**Solução (Visão do Produto):** Um sistema multiagentes automatizado, desenvolvido em Python, focado na extração, processamento e estruturação de dados contratuais (PDFs). A solução utiliza inteligência artificial para identificar cláusulas essenciais e automatizar checklists, apresentando as informações de forma centralizada em um dashboard inteligente, reduzindo a carga cognitiva e otimizando a fiscalização.

## 2. Escopo do MVP (Produto Mínimo Viável)
O MVP focará nos seguintes componentes e módulos essenciais:

*   **Módulo de Ingestão (Agente de Cadastro):** Script em Python puro (pypdf/pdfplumber) com LLM para leitura de PDFs e extração de dados básicos (Número do contrato, CNPJ, partes, datas, valores).
*   **Agente Analista de Cláusulas:** IA focada em localizar e extrair regras de negócio, obrigações, prazos e condições (ex: multas, vigência) de forma estruturada.
*   **Agente Analista de Critérios de Medição:** IA para extrair e padronizar os critérios de medição do contrato.
*   **Agente Analista de SMS (Segurança, Meio Ambiente e Saúde):** IA para validação de regras de SMS através de perguntas (Sim/Não) baseadas em evidências no documento com indicação da página de origem.
*   **Interface de Usuário (Painel Web):** Dashboard em React, Django ou Streamlit para visualização centralizada dos dados extraídos e estatísticas básicas.
*   **Módulo de Ajuste Manual (Contingência de IA):** Formulários na interface que permitem aos fiscais editar ou corrigir as extrações realizadas pela IA, garantindo a soberania humana e exatidão dos dados.
*   **Logs e Auditoria:** Persistência em banco de dados local (SQLite/PostgreSQL) para rastrear o histórico completo das alterações manuais (Usuário, campo modificado, valores antigos/novos e timestamp).

## 3. Requisitos (Histórias de Usuário - Épicos)

### Ingestão e Processamento
*   **[HU-01]** Como fiscal, quero extrair o número do documento, o CNPJ e os nomes das empresas automaticamente (usando pypdf/pdfplumber + LLM), para identificar o contrato rapidamente.

### Extração por IA (Agentes Nativos)
*   **[HU-02]** Como fiscal, quero extrair cláusulas essenciais automaticamente via SDK oficial (OpenAI/Google GenAI) e saída estruturada (JSON/Pydantic), para iniciar a análise técnica com rapidez.
*   **[HU-03]** Como fiscal, quero executar um checklist de SMS automatizado (respostas exatas de 'Sim' ou 'Não' com indicação da página no PDF) para validar regras de conformidade rapidamente.

### Interface de Usuário
*   **[HU-04]** Como fiscal, quero acessar um painel web com os dados estruturados e estatísticos em forma de tabela e cards interativos, para centralizar o controle.
*   **[HU-05]** Como gestor, quero visualizar projeções de consumo financeiro, para antecipar a necessidade de aditivos.

### Gestão e Auditoria
*   **[HU-06]** Como usuário, quero editar os dados extraídos pela IA através de um formulário funcional, garantindo a exatidão.
*   **[HU-07]** Como auditor, quero consultar os registros de alterações em uma tabela de log, mantendo a transparência nas correções.

### Arquitetura e Infraestrutura
*   **[HU-08]** Como desenvolvedor, quero configurar o ambiente com Docker e chaves de API para começar a codificar.
*   **[HU-09]** Como arquiteto, quero dimensionar o sizing com banco de dados leve (SQLite) e uso de API externa de LLM para poupar recursos computacionais.
*   **[HU-10]** Como devops, quero provisionar o ambiente local isolado e o repositório Git.

## 4. Premissas e Restrições
**Premissas:**
*   Os contratos (PDF) possuem camada de texto digitalizada legível por bibliotecas padrão.
*   Os usuários acessam o dashboard via web.
*   As chaves de API de LLMs estão funcionais e disponíveis.
*   A infraestrutura de hospedagem suporta scripts Python.

**Restrições:**
*   **Linguagem:** O sistema deve ser programado nativamente em Python para a lógica de agentes.
*   **Eficiência:** A arquitetura deve evitar alto consumo de recursos computacionais (sem uso de GPU local; processamento pesado nas APIs).
*   **Prazo:** A entrega do MVP está fixada para **03/07/2026**.

## 5. Riscos e Mitigações
1.  **Alucinação de IA (Risco Crítico):** Mitigado através da obrigatoriedade do módulo de edição manual, garantindo que o fiscal sempre valide e corrija a saída.
2.  **Estouro de Prazo no Front-end (Risco Alto):** Mitigado pelo uso de frameworks Python rápidos (Django, React ou Streamlit), evitando o desenvolvimento demorado de HTML/JS nativo do zero.
3.  **Alto Custo de Tokens / Sobrecarga de API (Risco Médio):** Mitigado pelo uso de lógica de segmentação em Python nativo, enviando à LLM apenas as páginas contendo palavras-chave estratégicas.

---
*Documento gerado a partir do Canvas de Declaração do Problema, Backlog do Produto (Excel) e Template PGP (PDF).*
