# Plano de Implementação (Versão 2) - Expansão do Domínio de Contratos

Este plano descreve as atualizações necessárias nas especificações (`.md`) para suportar os novos requisitos solicitados:
1. **Relacionamento 1:N**: Um CNPJ pode ter múltiplos contratos.
2. **Armazenamento Detalhado**: Salvar o nome do contrato, suas cláusulas específicas e o arquivo PDF.
3. **Resumo Inteligente**: Geração de um resumo simplificado do contrato para facilitar o entendimento.

## Mudanças Propostas nas Especificações

### 1. Criar novo documento de Modelagem de Dados
#### [NEW] [05_Modelagem_de_Dados_MySQL.md](file:///c:/Users/User/Documents/GitHub/daia/specs/05_Modelagem_de_Dados_MySQL.md)
Detalhará a estrutura relacional do banco de dados:
- Tabela `Empresa`: `id`, `cnpj` (único), `nome`.
- Tabela `Contrato`: `id`, `empresa_id` (FK), `nome_contrato`, `numero_contrato`, `resumo`, `caminho_arquivo_pdf`.
- Tabela `Clausula`: `id`, `contrato_id` (FK), `tipo` (multa, rescisão, etc.), `texto_extraido`.
- Tabela `AuditoriaLog`: Rastreio de modificações.

### 2. Atualizar a Visão Geral
#### [MODIFY] [01_Visao_Geral_e_Arquitetura_MVP.md](file:///c:/Users/User/Documents/GitHub/daia/specs/01_Visao_Geral_e_Arquitetura_MVP.md)
- Adicionar o requisito de **Geração de Resumo** do contrato.
- Adicionar a regra de negócio explícita: "Uma Empresa (CNPJ) pode estar associada a N Contratos".

### 3. Atualizar a Pipeline de IA
#### [MODIFY] [03_Agentes_e_Pipeline_IA.md](file:///c:/Users/User/Documents/GitHub/daia/specs/03_Agentes_e_Pipeline_IA.md)
- Inserir um novo Agente (ou etapa de consolidação): **Agente Resumidor**, responsável por ler as cláusulas extraídas e o escopo do contrato e gerar um resumo executivo de fácil entendimento.
- Detalhar a extração do *Nome do Contrato* no Agente de Cadastro.

### 4. Atualizar os Endpoints da API
#### [MODIFY] [04_Especificacao_de_Endpoints_FastAPI.md](file:///c:/Users/User/Documents/GitHub/daia/specs/04_Especificacao_de_Endpoints_FastAPI.md)
- Atualizar o payload de resposta do upload para refletir o armazenamento do arquivo (ex: `caminho_pdf`) e o `resumo`.
- Adicionar lógica de endpoint para buscar todos os contratos de um determinado CNPJ (`GET /api/v1/empresas/{cnpj}/contracts`).

## Plano de Verificação
- Garantir que o modelo de dados suporta explicitamente a cardinalidade 1:N entre CNPJ e Contratos.
- Confirmar que o fluxo de salvamento do arquivo PDF físico está previsto na documentação da API.
- Salvar este plano na pasta `specs/` após aprovação.
