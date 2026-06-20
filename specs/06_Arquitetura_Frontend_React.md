# 06 - Arquitetura do Frontend (React)

Este documento especifica a arquitetura da interface de usuário (UI) e a experiência de usuário (UX) do painel web. O objetivo do frontend é ser a porta de entrada segura, elegante e funcional para a gestão dos contratos auditados pela Inteligência Artificial.

## 1. Stack Tecnológico Base
- **Framework:** React.js (via Vite)
- **Roteamento:** React Router DOM (para gestão das URLs `/login`, `/empresas`, etc.)
- **Estilização:** CSS Vanilla com uso de Design Tokens (Variáveis CSS), garantindo independência de grandes bibliotecas externas, focado em alta performance.
- **Gerenciamento de Estado Global:** React Context API (para o usuário logado e token JWT).
- **Consumo de API:** `fetch` nativo ou `axios` interceptando requests para adicionar o cabeçalho `Authorization: Bearer <token>`.
- **Visualizador de PDF:** Biblioteca leve (ex: `react-pdf` ou uso nativo via `iframe` se for suficiente para rolar até a página específica).

## 2. Mapa de Rotas e Telas

### 2.1 `/login` (Tela de Autenticação)
- **Objetivo:** Garantir a segurança do sistema.
- **UX/UI:** Design "Clean" e *Glassmorphism* (efeitos de vidro translúcido), utilizando tipografia moderna. Deve possuir tratamento de erro claro para credenciais inválidas.

### 2.2 `/` (Dashboard Principal)
- **Objetivo:** Visão macro (Nível Diretoria/Gerência).
- **Estrutura:** 
  - Cards resumindo indicadores (Total de Contratos, Total Pendente de Auditoria).
  - Grid ou Tabela listando todas as **Empresas (CNPJs)** que possuem contratos cadastrados.
  - Ao clicar numa Empresa, navega para a rota `/empresas/{cnpj}`.

### 2.3 `/empresas/{cnpj}` (Painel da Empresa)
- **Objetivo:** Agrupar todos os documentos atrelados a um fornecedor.
- **Estrutura:**
  - Header contendo o Nome e o CNPJ da Empresa.
  - Botão Primário em destaque: **"Novo Contrato / Upload"**. Este botão deve abrir um Modal capaz de receber *Múltiplos Arquivos PDF* (Contrato + Anexos).
  - Lista de Contratos daquela empresa, exibindo status (Ex: "Validado" em verde, "Pendente" em amarelo).

### 2.4 `/contratos/{id}` (Workspace de Auditoria)
- **Objetivo:** A "tela principal" do trabalho diário do fiscal. Permitir auditar a IA mitigando a alucinação de forma rápida.
- **Estrutura de Tela Dividida (Split Screen):**
  - **Lado Esquerdo (60%):** O PDF Renderizado.
  - **Lado Direito (40%):** Os Cards com os dados estruturados devolvidos pela IA (Resumo, Cláusulas, Checklist SMS).
- **Interatividade Crucial:** Ao clicar na aba/card de uma "Cláusula de Multa" no lado direito, a interface deve ler os atributos `documento_anexo_id` e `pagina_origem` e forçar o visualizador de PDF (Lado Esquerdo) a carregar o documento correto e pular exatamento para a página identificada.
- **Edição:** Todo dado extraído deve ter um ícone de "lápis". Ao editar e salvar, o frontend dispara a requisição `PUT /api/v1/contracts/{id}`, registrando no log do banco de dados qual fiscal alterou o dado.

### 2.5 `/usuarios` (Painel Administrativo)
- **Objetivo:** Gerenciar a equipe.
- **Acesso:** Protegido apenas para perfis `admin`.
- **Estrutura:** Tabela listando usuários, botão para adicionar novo usuário, definir Nível de Acesso e *toggle* para inativar acessos antigos.

## 3. Diretrizes de UX/UI (O Efeito "Wow")
- **Paleta de Cores:** Fuga do padrão "básico". Uso inteligente do modo escuro (Dark Mode) ou claro com cores vibrantes para ações de estado (Sucesso, Alerta).
- **Micro-interações:** Toda ação (hover num botão, transição de páginas) deve ser acompanhada de uma transição suave (CSS `transition`), dando a percepção de uma interface viva e responsiva.
- **Tipografia Premium:** Implementação do Google Fonts (Inter, Outfit, ou Roboto) abandonando os padrões serifados dos navegadores.
- **Feedback Constante:** Exibição de *Spinners* ou mensagens de "A IA está lendo seu contrato" durante a Ingestão e Processamento para que o usuário não ache que o sistema travou.
