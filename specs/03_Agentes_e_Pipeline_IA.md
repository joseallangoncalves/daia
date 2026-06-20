# 03 - Agentes e Pipeline de IA

Este documento descreve a arquitetura da inteligência artificial e a pipeline de processamento nativo em Python, voltada à eficiência computacional e mitigação de alucinações.

## 1. Módulo de Ingestão e Processamento Nativo
O sistema evitará o uso de ferramentas de OCR complexas no MVP, baseando-se na premissa de que os PDFs possuirão camada de texto pesquisável.

1. **Upload via FastAPI**: O backend pode receber múltiplos arquivos simultâneos (ex: Contrato Principal, Termo Aditivo, Especificações Técnicas) que compõem o mesmo contrato.
2. **Parsing com `pypdf`/`pdfplumber`**: O texto puro é extraído de todos os documentos anexados. Durante a extração, o script injetará marcações indicando a origem física (ex: `[ID_DOCUMENTO: 1 | ARQUIVO: anexo.pdf | PAGINA: 4]`). Os textos são então concatenados lógicamente no backend.
3. **Segmentação Estratégica**: Para economizar custos de tokens nas APIs das LLMs, funções regex em Python farão uma pré-filtragem do texto agrupado em busca de palavras-chave como `CNPJ`, `Cláusula`, `Multa`, `Meio Ambiente`. Apenas blocos relevantes (junto com suas marcações de arquivo/página) serão enviados para a Inteligência Artificial.

## 2. Sistema Multiagentes

O pipeline é comporto por quatro "agentes", que são scripts especializados estruturados via prompt (System Instructions). 

### Agente 1: Agente de Cadastro
- **Objetivo**: Extrair informações básicas do contrato.
- **Entrada**: Primeiras páginas do contrato ou documento de extrato.
- **Instrução Central (System Prompt)**: Você é um analista extrator de metadados. Retorne um JSON exato contendo o `numero_do_contrato`, `nome_do_contrato`, `cnpj_contratante`, `nome_contratante`, `cnpj_contratada` e `nome_contratada`.
- **Validação Nível Código**: Regex do Python confirmará se a string extraída no campo CNPJ é válida.

### Agente 2: Agente Analista de Cláusulas
- **Objetivo**: Extrair obrigações, multas e prazos.
- **Entrada**: Páginas segmentadas que contenham palavras-chave de obrigações (com marcações de arquivo e página inseridas).
- **Instrução Central (System Prompt)**: Extraia as cláusulas de rescisão, multas previstas e vigência. Formate a saída estruturada listando o valor da multa, o prazo de vigência (data de início e fim) e os motivos que geram quebra contratual. OBRIGATÓRIO: Para cada cláusula extraída, informe o `documento_anexo_id` e a `pagina_origem` exata de onde o texto foi retirado.

### Agente 3: Agente Analista de Critérios de Medição
- **Objetivo**: Extrair os critérios exigidos para a medição (pagamento) dos serviços.
- **Entrada**: Seções do anexo técnico ou minutas referentes a Pagamentos (com marcações de arquivo e página inseridas).
- **Instrução Central (System Prompt)**: Identifique e liste passo a passo os documentos e critérios exigidos para autorizar a medição e o faturamento do serviço. OBRIGATÓRIO: Informe o `documento_anexo_id` e a `pagina_origem` de onde extraiu esta informação.

### Agente 4: Agente Analista de SMS (Saúde, Meio Ambiente e Segurança)
- **Objetivo**: Checklist automatizado de regras SMS.
- **Entrada**: Seção de obrigações ambientais (com marcações de arquivo e página inseridas).
- **Instrução Central (System Prompt)**: Analise o texto fornecido e responda exclusivamente "Sim" ou "Não" para as seguintes validações críticas de SMS: 1. A contratada é obrigada a apresentar o PPRA? 2. Existe menção explícita a descarte de resíduos? Caso a resposta seja Sim, retorne obrigatoriamente as chaves `documento_anexo_id` e `pagina_origem` da evidência encontrada.

### Agente 5: Agente Resumidor
- **Objetivo**: Fornecer um resumo executivo inteligente e de fácil compreensão sobre a finalidade e escopo geral do contrato.
- **Entrada**: O texto completo do contrato processado na ingestão ou a junção das principais cláusulas extraídas.
- **Instrução Central (System Prompt)**: Você é um assistente executivo. Escreva um resumo de no máximo 2 parágrafos explicando do que se trata este contrato, qual é o objeto principal e o seu objetivo de negócio, para que um gerente compreenda rapidamente sem jargões excessivos.

## 3. Retorno Estruturado e Contingência
Para facilitar a interface com o banco de dados e o frontend:
- O uso da função de **Structured Output** (disponível via OpenAI `response_format` com Pydantic) será forçado, garantindo que o agente retorne sempre chaves padronizadas.
- Todos os campos extraídos receberão uma flag no MySQL: `status_auditoria="pendente"`, sinalizando no Frontend (React) que um Fiscal de Contrato humano precisa clicar em "Confirmar/Editar" para oficializar o dado no sistema.
