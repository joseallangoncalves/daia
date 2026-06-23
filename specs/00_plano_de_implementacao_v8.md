# Plano de Implementação (Versão 8) - Execução do Design System no Frontend

Este plano descreve como será **executada e implementada fisicamente** a especificação `08_Design_System_Frontend.md` dentro do código do frontend React.

## Mudanças Propostas

### 1. Instalação e Configuração do TailwindCSS
Atualmente o `package.json` do frontend não possui o TailwindCSS instalado.
- **Passo:** Executar `npm install -D tailwindcss postcss autoprefixer` na pasta `frontend`.
- **Passo:** Executar `npx tailwindcss init -p` para gerar os arquivos de configuração padrão.

### 2. Atualizar Configuração do Tailwind
#### [MODIFY] `frontend/tailwind.config.js`
Injetar as definições visuais exatas do PRD:
- **Cores**: `primary: '#065F46'`, `primaryHover: '#059669'`.
- **Backgrounds e Superfícies**: `surface: '#FFFFFF'`, `background: '#F3F4F6'`.
- **Tipografia**: Configurar o `fontFamily` para utilizar a `Inter` como padrão (sans-serif).

### 3. Atualizar Estilo Global
#### [MODIFY] `frontend/src/index.css`
- Substituir o CSS padrão pelas diretivas vitais do Tailwind:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- Importar a fonte `Inter` do Google Fonts na primeira linha.

### 4. Criação dos Componentes Base (UI Kit)
Para refletir fielmente os protótipos, será criada a pasta `src/components/ui/` contendo os primeiros componentes puramente visuais padronizados:

#### [NEW] `frontend/src/components/ui/Button.jsx`
- Componente genérico de botão estilizado com a cor `primary`, contendo suporte de hover (transição suave para `primaryHover`) e sombras interativas (`hover:shadow-md`).

#### [NEW] `frontend/src/components/ui/Badge.jsx`
- Componente visual flexível que recebe uma propriedade `status` (ex: "revisado", "pendente", "alerta").
- Renderiza com o fundo e texto adequados:
  - `revisado`: verde claro com texto verde escuro.
  - `pendente`: amarelo claro com texto ocre.
  - `alerta`: vermelho claro com texto vermelho escuro.

#### [NEW] `frontend/src/components/ui/Card.jsx`
- Estrutura base (`bg-white`), bordas suavemente arredondadas (`rounded-lg`) e sombra leve (`shadow-sm`) para ser usado em volta das tabelas, formulários e KPIs do dashboard principal.
