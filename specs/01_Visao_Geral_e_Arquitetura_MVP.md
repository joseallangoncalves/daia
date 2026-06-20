# 01 - Visão Geral e Arquitetura do MVP

## 1. Declaração do Problema
O processo atual de fiscalização de contratos sofre de **sobrecarga cognitiva e desalinhamento operacional**, decorrente da **descentralização de informações relevantes das obrigações**. Os fiscais e gestores de contrato perdem muito tempo lendo e procurando cláusulas extensas e anexos técnicos complexos, o que abre margem para erros humanos, perda de prazos e alucinação analítica na gestão.

## 2. Escopo Geral (Produto Mínimo Viável - MVP)
O escopo do projeto é o desenvolvimento de um **Sistema Multiagentes para Otimização da Fiscalização de Contratos** voltado para a extração, processamento e estruturação de dados complexos a partir de documentos contratuais em formato PDF.

O MVP deve contemplar as seguintes funcionalidades essenciais:
* **Autenticação e Autorização (RBAC)**: Login seguro com controle de acesso baseado em perfis (Administrador, Fiscal, Auditor, Leitor).
* **Módulo de Ingestão**: Processamento de múltiplos PDFs anexados a um mesmo contrato e salvamento físico dos arquivos.
* **Agentes de Extração via Inteligência Artificial**: Agentes focados na extração estruturada de (1) Cadastro do Contrato (incluindo Nome), (2) Cláusulas e Prazos, (3) Critérios de Medição, (4) Conformidade SMS e (5) Resumo Inteligente do Contrato.
* **Modelagem Centralizada**: O Contrato é a entidade central. Um CNPJ pode ter múltiplos Contratos, e um Contrato pode ter múltiplos Documentos Anexos.
* **Painel Web (Interface)**: Dashboard centralizado, protegido por login, para visualização das empresas, seus contratos, anexos e os dados extraídos.
* **Módulo de Ajuste Manual**: Possibilidade do fiscal auditar e corrigir os dados gerados pela IA (mitigação do risco de alucinação).
* **Logs e Auditoria**: Registro completo de qualquer modificação feita nos dados pelo usuário autenticado.

## 3. Arquitetura Tecnológica Base
Para atender ao prazo reduzido da Sprint e garantir a escalabilidade nativa em Python, a arquitetura será estruturada da seguinte forma:

- **Backend / API:**
  - **Linguagem:** Python
  - **Framework API:** FastAPI (escolhido por sua performance, documentação automática via Swagger, e facilidade para criação de endpoints REST).
  - **Módulo de Agentes (IA):** Integração com SDKs Oficiais de LLMs (OpenAI ou Google GenAI) utilizando chamadas estruturadas e prompts blindados (System Instructions). A extração do texto será nativa com `pypdf` ou `pdfplumber`.
  
- **Frontend / UI:**
  - **Framework:** React (garantindo um carregamento rápido, design dinâmico e consumo fácil da API FastAPI).
  - **Comunicação:** Chamadas assíncronas via `axios` ou `fetch` consumindo a API REST.

- **Persistência de Dados (Banco de Dados):**
  - **Banco Relacional:** MySQL. Escolhido para armazenar os logs de auditoria, históricos de contrato, e metadados com confiabilidade e velocidade. O modelo será implementado via SQLAlchemy (ORM do Python) na FastAPI.
  
- **Infraestrutura e DevOps:**
  - **Containerização:** Docker e `docker-compose` para agrupar o Backend (FastAPI), o Frontend (React) e o Banco de Dados (MySQL).

## 4. Épicos e Histórias de Usuário do MVP

| ID | Épico | História de Usuário | Prioridade |
|---|---|---|---|
| 1 | Segurança e Acesso | Como administrador, quero cadastrar, desativar e definir o perfil de acesso dos usuários, para manter a segurança do sistema. | Alta |
| 2 | Segurança e Acesso | Como usuário do sistema, quero fazer login com meu usuário e senha em uma tela segura, para acessar meu dashboard. | Alta |
| 3 | Ingestão de Contratos | Como fiscal de contrato, quero enviar múltiplos documentos (contrato e anexos), extrair os metadados de forma automática e guardar os PDFs originais atrelados ao contrato. | Alta |
| 4 | Extração por IA | Como fiscal de contrato, quero extrair cláusulas essenciais automaticamente e persistir na base de dados, para que eu inicie a análise técnica com rapidez. | Alta |
| 5 | Extração por IA | Como fiscal de contrato, quero executar um checklist automatizado de SMS, para que eu valide regras de conformidade sem ler anexos extensos. | Média |
| 6 | Extração por IA | Como fiscal de contrato, quero obter um resumo inteligente e textual do escopo geral, para compreender a finalidade do contrato rapidamente. | Alta |
| 7 | Arquitetura | Como desenvolvedor, quero configurar o ambiente básico de desenvolvimento com Docker e as chaves de API, para começar a codificar imediatamente. | Alta |
| 8 | Arquitetura | Como devops, quero implantar a arquitetura inicial e provisionar o ambiente local isolado (MySQL e Python) para que o time inicie. | Alta |
| 9 | Interface de Usuário | Como fiscal de contrato, quero acessar um painel contendo APENAS os contratos que eu cadastrei, para manter a organização e não visualizar dados de outros fiscais. | Alta |
| 10 | Interface de Usuário | Como administrador, quero acessar um painel agrupado por Empresa contendo TODOS os contratos cadastrados por todos os fiscais. | Alta |
| 11 | Gestão e Auditoria | Como usuário com permissão, quero editar as informações extraídas pela inteligência artificial, para garantir a exatidão absoluta. | Alta |
| 12 | Gestão e Auditoria | Como auditor, quero consultar os registros de alterações atrelados ao usuário que as fez, para rastrear correções manuais. | Baixa |

## 5. Riscos e Mitigações
1. **Alucinação da IA:** Será mitigada obrigando o preenchimento/validação humana através da interface de Ajuste Manual (onde o banco MySQL atualizará o registro após o aceite).
2. **Estouro de Prazo no Frontend:** Mitigado pelo uso de React para interfaces ágeis de componentização (sem construção de zero de JS vanilla).
3. **Alto Custo de Tokens API:** Segmentação do texto no Python nativo; enviaremos para a LLM apenas as páginas onde os termos técnicos das cláusulas forem encontrados na varredura.
