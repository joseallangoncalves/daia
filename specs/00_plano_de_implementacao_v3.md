# Plano de Implementação (Versão 3) - O Contrato como Entidade Central e Múltiplos Anexos

Este plano propõe as atualizações necessárias nas especificações (`.md`) para atender ao novo requisito: **O Contrato deve ser a entidade centralizadora (armazenador) e suportar múltiplos documentos/arquivos anexados a ele**.

## Mudanças Propostas nas Especificações

### 1. Atualizar Modelagem de Dados
#### [MODIFY] [05_Modelagem_de_Dados_MySQL.md](file:///c:/Users/User/Documents/GitHub/daia/specs/05_Modelagem_de_Dados_MySQL.md)
Reforçar o Contrato como raiz da estrutura de dados:
- Remover a coluna `caminho_pdf` da tabela `contratos`.
- **[NOVA TABELA]** `documentos_anexos`:
  - `id` (PK)
  - `contrato_id` (FK para `contratos.id`)
  - `nome_arquivo` (VARCHAR)
  - `tipo_documento` (VARCHAR - ex: 'Contrato Principal', 'Anexo Técnico', 'Aditivo')
  - `caminho_storage` (VARCHAR - caminho físico do PDF)
  - `data_upload` (TIMESTAMP)

Dessa forma teremos as relações:
- 1 CNPJ -> N Contratos
- 1 Contrato -> N Cláusulas
- 1 Contrato -> N Documentos Anexos

### 2. Atualizar Visão Geral
#### [MODIFY] [01_Visao_Geral_e_Arquitetura_MVP.md](file:///c:/Users/User/Documents/GitHub/daia/specs/01_Visao_Geral_e_Arquitetura_MVP.md)
- Ajustar a História de Usuário de Upload para contemplar o envio/recebimento de **múltiplos** arquivos PDF que compõem o escopo de um único Contrato.

### 3. Atualizar Pipeline de IA
#### [MODIFY] [03_Agentes_e_Pipeline_IA.md](file:///c:/Users/User/Documents/GitHub/daia/specs/03_Agentes_e_Pipeline_IA.md)
- O Módulo de Ingestão precisará agrupar a leitura de múltiplos PDFs (ex: juntar o texto do Contrato Principal com o do Anexo) antes de enviar para os Agentes de Extração e para o Agente Resumidor.

### 4. Atualizar Endpoints da API
#### [MODIFY] [04_Especificacao_de_Endpoints_FastAPI.md](file:///c:/Users/User/Documents/GitHub/daia/specs/04_Especificacao_de_Endpoints_FastAPI.md)
- Alterar o payload de retorno dos Contratos para exibir um *array* (lista) de `documentos_anexos` em vez de apenas um `caminho_pdf`.
- O endpoint de `POST /api/v1/contracts/upload` deverá aceitar uma lista de arquivos no `multipart/form-data` (`files[]`).
