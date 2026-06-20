# Especificação do Projeto e Plano de Documentação do MVP

Este plano descreve a estrutura dos arquivos de documentação em Markdown (`.md`) solicitados para especificar o MVP do "Sistema Multiagentes para Otimização da Fiscalização de Contratos".

## Revisão do Usuário Necessária

> [!IMPORTANT]
> O PGP original e o Backlog mencionavam "Django/Streamlit" para o frontend/backend, mas sua mensagem de áudio solicitou especificamente **FastAPI**, **React** e **Python**. A base de dados principal será o **MySQL**, conforme sua última solicitação. Eu alinhei esta especificação estritamente com esta stack tecnológica.

## Mudanças Propostas

Criaremos um conjunto de arquivos Markdown (`.md`) estruturados no diretório `specs/` para documentar a arquitetura do sistema, os requisitos do MVP e as etapas de inicialização/configuração.

### specs/

#### [NEW] [01_Visao_Geral_e_Arquitetura_MVP.md](file:///c:/Users/User/Documents/GitHub/daia/specs/01_Visao_Geral_e_Arquitetura_MVP.md)
Este documento consolidará a Declaração do Problema, o Escopo Geral (MVP), a Stack Tecnológica escolhida (Python, FastAPI, React, MySQL, Docker) e as principais Épicos/Histórias de Usuário derivadas do Backlog.

#### [NEW] [02_Especificacao_de_Inicializacao.md](file:///c:/Users/User/Documents/GitHub/daia/specs/02_Especificacao_de_Inicializacao.md)
Esta é a "Primeira Especificação de Inicialização" solicitada no áudio. Ela detalhará:
- Estrutura de Diretórios do Projeto (Backend vs Frontend).
- Configuração do Ambiente (Estrutura do Docker compose com container MySQL, `requirements.txt`/`pyproject.toml` do Python, `package.json` do React).
- Variáveis de ambiente (template `.env` com as chaves de API do LLM, conexão com o MySQL).
- Comandos passo a passo para iniciar o banco de dados, o servidor FastAPI e o frontend React.

#### [NEW] [03_Agentes_e_Pipeline_IA.md](file:///c:/Users/User/Documents/GitHub/daia/specs/03_Agentes_e_Pipeline_IA.md)
Este documento especificará a inteligência central do sistema:
- **Módulo de Ingestão**: Upload de arquivos, processamento de PDF usando `pypdf`/`pdfplumber`.
- **Agente de Cadastro**: Extração de CNPJ, Nomes de Entidades, Número do Contrato.
- **Agente Analista de Cláusulas**: Extração das principais regras, obrigações e prazos.
- **Agente Analista de Critérios de Medição**: Extração de critérios de medição.
- **Agente Analista de SMS (Saúde, Meio Ambiente e Segurança)**: Validação das regras de SMS.

#### [NEW] [04_Especificacao_de_Endpoints_FastAPI.md](file:///c:/Users/User/Documents/GitHub/daia/specs/04_Especificacao_de_Endpoints_FastAPI.md)
Especificação detalhada do contrato da API, abrangendo:
- Endpoint de Upload de Contratos (`POST /api/v1/contracts/upload`).
- Endpoint de Consulta de Contrato (`GET /api/v1/contracts/{id}`).
- Endpoint de Correção Manual (`PUT /api/v1/contracts/{id}`).

## Plano de Verificação

### Verificação Manual
- Revisar os arquivos Markdown gerados para garantir que eles capturam todas as restrições do PGP, Backlog e das instruções de áudio, refletindo o uso do MySQL.
- Garantir que os comandos de inicialização (ex: Docker compose, pip install, npm start) estejam logicamente corretos e prontos para serem executados pela equipe de desenvolvimento na próxima fase.
