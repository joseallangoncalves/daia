# Plano de Implementação (Versão 5) - Autenticação e Gestão de Usuários

Este plano propõe as atualizações nas especificações (`.md`) para suportar o novo requisito de segurança: **Controle de Acesso Baseado em Perfis (RBAC - Role-Based Access Control)**, permitindo diferenciar a visão e a permissão de edição entre Administradores, Fiscais, etc.

## Mudanças Propostas nas Especificações

### 1. Atualizar Modelagem de Dados
#### [MODIFY] [05_Modelagem_de_Dados_MySQL.md](file:///c:/Users/User/Documents/GitHub/daia/specs/05_Modelagem_de_Dados_MySQL.md)
Adição da nova tabela de usuários e definição dos níveis:
- **[NOVA TABELA]** `usuarios`:
  - `id` (INT, PK)
  - `nome` (VARCHAR)
  - `username` (VARCHAR, UNIQUE) - *o usuário propriamente dito para login*
  - `senha_hash` (VARCHAR) - *as senhas serão salvas criptografadas*
  - `nivel_acesso` (ENUM('admin', 'fiscal', 'auditor', 'leitor'))
  - `is_ativo` (BOOLEAN, DEFAULT TRUE)
  - `criado_em` (TIMESTAMP)
- Atualizar a tabela `auditoria_logs` para que a coluna `usuario` (que antes era uma string solta) passe a ser uma Foreign Key (`usuario_id`) apontando para a nova tabela de usuários, garantindo consistência na auditoria.

### 2. Atualizar Visão Geral
#### [MODIFY] [01_Visao_Geral_e_Arquitetura_MVP.md](file:///c:/Users/User/Documents/GitHub/daia/specs/01_Visao_Geral_e_Arquitetura_MVP.md)
- Inserir **Autenticação e Autorização (Login)** na lista de funcionalidades essenciais do MVP.
- Adicionar novas Histórias de Usuário:
  - "Como Administrador, quero cadastrar, desativar e definir o perfil de acesso dos usuários..."
  - "Como usuário do sistema, quero fazer login com meu usuário e senha..."

### 3. Atualizar Endpoints da API
#### [MODIFY] [04_Especificacao_de_Endpoints_FastAPI.md](file:///c:/Users/User/Documents/GitHub/daia/specs/04_Especificacao_de_Endpoints_FastAPI.md)
- Adicionar o bloco de endpoints de **Autenticação (Auth)**:
  - `POST /api/v1/auth/login`: Recebe `username` e `password` e devolve um token JWT e os dados/perfil do usuário.
- Adicionar os endpoints de **Gestão de Usuários**:
  - `POST /api/v1/users`: Criar usuário (restrito a `admin`).
  - `GET /api/v1/users`: Listar usuários.
  - `PUT /api/v1/users/{id}/status`: Ativar/Desativar usuário.
- Estabelecer a regra de que todas as rotas de contratos agora exigirão o envio do token de autenticação via Header (`Authorization: Bearer <token>`).
