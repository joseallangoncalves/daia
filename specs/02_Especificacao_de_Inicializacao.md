# 02 - Especificação de Inicialização e Configuração do Ambiente

Este documento contém o passo a passo para o time de desenvolvimento (Backend, Frontend e DevOps) preparar e inicializar o ecossistema do MVP no "Dia 1".

## 1. Estrutura de Diretórios Recomendada
A fim de separar responsabilidades, o repositório (`daia`) deve adotar a seguinte estrutura:

```text
daia/
├── backend/                  # Código FastAPI
│   ├── app/
│   │   ├── main.py           # Entrypoint da API
│   │   ├── agents/           # Lógica dos Agentes de IA
│   │   ├── routers/          # Endpoints
│   │   ├── models/           # SQLAlchemy (MySQL)
│   │   └── services/         # Ingestão de PDF (pypdf/pdfplumber)
│   ├── requirements.txt      # Dependências Python
│   └── .env.sample           # Exemplo de variáveis
├── frontend/                 # Código React
│   ├── src/
│   │   ├── components/       # Interface
│   │   ├── pages/            # Painel principal
│   │   └── App.jsx
│   └── package.json          # Dependências Node
├── infra/
│   └── init.sql              # Script SQL inicial (MySQL)
├── docker-compose.yml        # Orquestração do MVP
└── specs/                    # Documentação do MVP
```

## 2. Variáveis de Ambiente (`.env`)
No diretório `backend`, crie um arquivo `.env` com a seguinte estrutura:

```env
# Configurações do Banco de Dados
MYSQL_USER=root
MYSQL_PASSWORD=root_password
MYSQL_DATABASE=contratos_db
MYSQL_HOST=db
MYSQL_PORT=3306

# Configurações de IA
# Escolher e preencher o provedor de preferência da equipe
OPENAI_API_KEY=sk-xxxx...
GEMINI_API_KEY=AIzaSy...

# Ambiente
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:3000
```

## 3. Orquestração com Docker Compose
No raiz do projeto, o `docker-compose.yml` deverá expor 3 serviços:
1. `db`: Banco de Dados MySQL na porta 3306.
2. `api`: Servidor FastAPI na porta 8000.
3. `web`: Servidor React na porta 3000.

### 3.1 Exemplo simplificado de inicialização
```yaml
version: '3.8'

services:
  db:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: contratos_db
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

  api:
    build: ./backend
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    depends_on:
      - db

  web:
    build: ./frontend
    command: npm start
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "3000:3000"

volumes:
  db_data:
```

## 4. Passo a Passo de Inicialização para o Desenvolvedor

### Subindo os contêineres:
1. Certifique-se de que o Docker e Docker Compose estão instalados.
2. Crie seu `.env` com as chaves corretas da IA na pasta `backend`.
3. Na raiz do projeto, execute:
   ```bash
   docker-compose up --build -d
   ```
4. Verifique os logs para garantir a subida correta:
   ```bash
   docker-compose logs -f
   ```

### Acessando as Interfaces:
- **Painel Front-end (React):** `http://localhost:3000`
- **Documentação da API (FastAPI Swagger):** `http://localhost:8000/docs`
- **Banco de Dados (MySQL):** `localhost:3306` via DBeaver ou Workbench com credenciais do `.env`.

Com estes passos, o desenvolvedor está liberado para iniciar as atividades de "Ingestão de Contratos" e criar o primeiro Agente Python.
