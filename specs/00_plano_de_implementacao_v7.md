# Plano de Implementação (Versão 7) - Isolamento de Dados por Usuário

Este plano propõe as modificações necessárias para isolar a visualização dos contratos, garantindo que fiscais só tenham acesso aos contratos que eles mesmos inseriram, enquanto administradores mantêm a visão global.

## Mudanças Propostas nas Especificações

### 1. Atualizar Modelagem de Dados
#### [MODIFY] [05_Modelagem_de_Dados_MySQL.md](file:///c:/Users/User/Documents/GitHub/daia/specs/05_Modelagem_de_Dados_MySQL.md)
Para garantir o isolamento:
- Na tabela `contratos`, adicionaremos uma nova chave estrangeira obrigatória: `criado_por` (INT, FK referenciando `usuarios.id`).
- Dessa forma, no momento do upload, o sistema gravará quem é o "dono" daquele contrato.

### 2. Atualizar Endpoints da API
#### [MODIFY] [04_Especificacao_de_Endpoints_FastAPI.md](file:///c:/Users/User/Documents/GitHub/daia/specs/04_Especificacao_de_Endpoints_FastAPI.md)
- O comportamento da listagem (`GET /api/v1/empresas` e `GET /api/v1/empresas/{cnpj}/contratos`) passará a ter uma **Regra de Negócio Automática Baseada no JWT**:
  - Se `nivel_acesso == 'admin'`, o SQLAlchemy não aplica filtro extra (Retorna todos).
  - Se `nivel_acesso == 'fiscal'`, o SQLAlchemy injeta o filtro `WHERE criado_por = {id_do_usuario_logado}`.

### 3. Atualizar Visão Geral
#### [MODIFY] [01_Visao_Geral_e_Arquitetura_MVP.md](file:///c:/Users/User/Documents/GitHub/daia/specs/01_Visao_Geral_e_Arquitetura_MVP.md)
- Atualizar a história de usuário da Interface: 
  - "Como administrador, quero visualizar o painel de todas as empresas e contratos cadastrados."
  - "Como fiscal, quero acessar um painel agrupado por Empresa contendo APENAS os contratos que eu cadastrei, para não visualizar informações de outros."
