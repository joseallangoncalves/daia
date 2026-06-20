# Plano de Implementação (Versão 6) - Arquitetura e Telas do Frontend (React)

Com o backend bem definido, precisamos formalizar como será a "cara" e o fluxo de telas do sistema para o fiscal de contratos. O objetivo deste plano é criar o documento `specs/06_Arquitetura_Frontend_React.md`.

## Mapa de Telas Proposto

A aplicação terá a seguinte estrutura de roteamento e navegação:

### 1. Tela de Login (`/login`)
- Tela focada em segurança, com design minimalista (estilo *Glassmorphism*).
- Recebe `username` e `password`. Em caso de sucesso, armazena o token de sessão.

### 2. Dashboard Principal (`/`)
- A visão macro do sistema. Exibe as **Empresas (CNPJs)** cadastradas em formato de *cards*.
- Um resumo totalizador (Ex: "Você tem 14 Contratos Pendentes de Auditoria").
- Ao clicar em uma empresa, o usuário é direcionado para a listagem específica dela.

### 3. Painel da Empresa (`/empresas/{cnpj}`)
- Uma tabela com todos os Contratos atrelados àquele CNPJ (A relação 1:N que desenhamos).
- Botão primário visível para **Fazer Upload de Novo Contrato** (Abre um modal que aceita múltiplos PDFs).

### 4. Visualizador de Contrato & Auditoria (`/contratos/{id}`)
- **A tela mais importante do sistema.** Dividida em duas colunas (*Split Screen*):
  - **Lado Esquerdo:** O visualizador do documento PDF.
  - **Lado Direito:** Os dados estruturados extraídos pela IA (Resumo, Cláusulas, SMS Checklist).
- **Interatividade:** Ao clicar na "Cláusula de Multa" no lado direito, o PDF no lado esquerdo rolará automaticamente para a página exata da extração.
- Possibilidade de editar os valores extraídos no lado direito (disparando o log de auditoria).

### 5. Gestão de Usuários (`/usuarios`) - *Apenas Admins*
- Painel para o administrador criar contas, resetar senhas e desativar membros da equipe.

## Diretrizes de Design (UX/UI)
- **Visual Premium**: Uso de fontes modernas (ex: Google Fonts 'Inter' ou 'Outfit'), paleta de cores coesa (modo claro/escuro) e sombras suaves.
- **Dinamismo**: Micro-animações ao passar o mouse por cima de cards e botões para garantir uma experiência de uso imersiva e responsiva.

## Plano de Ação
- Criar o arquivo `specs/06_Arquitetura_Frontend_React.md` contendo essas descrições arquiteturais.
- Salvar o marco histórico desta iteração em `specs/00_plano_de_implementacao_v6.md`.
