# 04 - Especificação de Endpoints FastAPI

Esta especificação define o contrato inicial da API REST a ser construída com o framework **FastAPI**, visando cobrir os requisitos do MVP: recebimento dos PDFs, retorno dos dados extraídos pelos agentes e persistência/auditoria de ajustes no MySQL.

## 1. Premissas da API
- **Padrão:** RESTful
- **Autenticação:** Obrigatória via token JWT (`Authorization: Bearer <token>`) em todas as rotas (exceto o próprio login).
- **Formato de Resposta Padrão:** JSON
- **Tratamento de Erros:** Retornos claros com códigos HTTP corretos (ex: 400 Bad Request, 401 Unauthorized, 404 Not Found, 422 Unprocessable Entity, 500 Internal Server Error).

## 2. Endpoints de Autenticação e Usuários

### 2.1 Login (Autenticação)
Autentica um usuário e devolve o token JWT de acesso.
- **Endpoint:** `POST /api/v1/auth/login`
- **Requisição:** `application/json` ou `form-data`
  ```json
  {
    "username": "joao.silva",
    "password": "senha_segura_123"
  }
  ```
- **Resposta (200 OK):**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "nome": "João Silva",
      "nivel_acesso": "admin"
    }
  }
  ```

### 2.2 Gestão de Usuários
Permite o cadastro e controle dos usuários (Apenas para `admin`).

- **Listar Usuários (`GET /api/v1/users`)**: Retorna a lista de usuários cadastrados, seus perfis e se estão ativos.
- **Criar Usuário (`POST /api/v1/users`)**: Recebe `nome`, `username`, `password` e `nivel_acesso`.
- **Alterar Status (`PUT /api/v1/users/{id}/status`)**: Ativa ou inativa um usuário do sistema (Ex: demissão ou bloqueio).

## 3. Endpoints de Contratos

### 3.1 Ingestão e Processamento (Upload de Contrato)
O usuário faz o upload do arquivo PDF, o backend chama a pipeline de ingestão nativa, segmenta o texto e envia para as funções dos Agentes de IA. Ao final, o FastAPI persiste os dados no banco (status pendente) e retorna o JSON preenchido para a tela.

- **Endpoint:** `POST /api/v1/contracts/upload`
- **Requisição:** `multipart/form-data`
  - `files[]`: Lista de arquivos `.pdf` pertencentes ao mesmo contrato.
- **Resposta (201 Created):**
  ```json
  {
    "id_contrato": 102,
    "nome_contrato": "Prestação de Serviços de Limpeza 2026",
    "numero_contrato": "1234/2026",
    "contratante": {
      "nome": "Empresa X",
      "cnpj": "00.000.000/0001-00"
    },
    "contratada": {
      "nome": "Empresa Y",
      "cnpj": "11.111.111/0001-11"
    },
    "clausulas": [
      {
        "id": 1,
        "tipo": "Vigencia",
        "texto_extraido": "01/01/2026 a 31/12/2026",
        "documento_anexo_id": 1,
        "pagina_origem": 2
      },
      {
        "id": 2,
        "tipo": "Multa",
        "texto_extraido": "2% sobre o saldo",
        "documento_anexo_id": 1,
        "pagina_origem": 5
      }
    ],
    "sms_checklist": [
      {
        "regra": "exige_ppra",
        "resultado": true,
        "documento_anexo_id": 2,
        "pagina_origem": 12
      }
    ],
    "resumo": "O contrato tem como objetivo a terceirização de serviços de limpeza predial nas instalações da Empresa X pela Empresa Y, garantindo manutenção diária sob regime de SLA de 8 horas úteis.",
    "documentos_anexos": [
      {
        "id": 1,
        "nome_arquivo": "1234_2026_limpeza.pdf",
        "tipo_documento": "Contrato Principal",
        "caminho_storage": "/uploads/contratos/1234_2026_limpeza.pdf"
      },
      {
        "id": 2,
        "nome_arquivo": "anexo_tecnico_A.pdf",
        "tipo_documento": "Anexo Técnico",
        "caminho_storage": "/uploads/contratos/anexo_tecnico_A.pdf"
      }
    ],
    "status_auditoria": "pendente"
  }
  ```

### 3.2 Listagem de Empresas (CNPJ)
Retorna a lista de empresas (CNPJs) cadastradas no sistema.
- **Regra de Isolamento**:
  - `admin` e `master`: Visualizam todas as empresas.
  - `fiscal`: Visualiza apenas empresas as quais ele fez upload de pelo menos um contrato.

- **Endpoint:** `GET /api/v1/empresas`
- **Resposta (200 OK):**
  ```json
  [
    {
      "cnpj": "11.111.111/0001-11",
      "nome": "Empresa Y",
      "total_contratos": 3
    }
  ]
  ```

### 3.3 Listagem de Contratos por Empresa
Retorna a lista de contratos vinculados a um CNPJ específico, suportando a visualização agrupada (1:N) no Dashboard.
- **Regra de Isolamento**:
  - `admin` e `master`: Visualizam todos os contratos da empresa.
  - `fiscal`: Visualiza apenas os contratos dessa empresa cujo `criado_por` seja igual ao seu próprio ID de usuário.

- **Endpoint:** `GET /api/v1/empresas/{cnpj}/contratos`
- **Parâmetros de Consulta (Query):**
  - `status`: (opcional) `pendente` ou `validado`
- **Resposta (200 OK):**
  ```json
  [
    {
      "id_contrato": 102,
      "nome_contrato": "Prestação de Serviços de Limpeza 2026",
      "numero_contrato": "1234/2026",
      "status_auditoria": "pendente",
      "data_upload": "2026-06-20T10:00:00Z"
    }
  ]
  ```

### 3.4 Detalhes de um Contrato
Retorna todas as cláusulas, resumo e informações completas estruturadas de um contrato específico para a visualização na tela de Detalhes.

- **Endpoint:** `GET /api/v1/contracts/{id_contrato}`
- **Resposta (200 OK):** Idêntica ao retorno do upload, mas consultada no MySQL.

### 3.5 Auditoria e Correção Manual
Quando um usuário (com permissão) identifica um erro na extração feita pela Inteligência Artificial, ele altera o dado no React e clica em salvar. O payload substitui os valores e registra no MySQL quem alterou (via o JWT fornecido).

- **Endpoint:** `PUT /api/v1/contracts/{id_contrato}`
- **Requisição:** `application/json`
  ```json
  {
    "campo_alterado": "clausulas.multa",
    "novo_valor": "3% sobre o saldo devedor",
    "status_auditoria": "validado"
  }
  ```
- **Resposta (200 OK):**
  ```json
  {
    "mensagem": "Contrato atualizado com sucesso. Auditoria registrada.",
    "id_log": 45
  }
  ```

## 4. Persistência de Dados
Conforme documentado no arquivo de Modelagem de Dados, os endpoints interagirão primariamente com as tabelas `Usuario`, `Empresa`, `Contrato`, `DocumentoAnexo`, `Clausula` e `AuditoriaLog`.
