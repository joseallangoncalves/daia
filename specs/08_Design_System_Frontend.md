# Spec: PRD — 08 Design System (Frontend)

**Versão:** 1.0
**Status:** Aprovado
**Autor:** Equipe de Design / Frontend
**Data:** 2026-06-23
**Reviewers:** Desenvolvedores Frontend, PO

---

## 1. Resumo

Este documento define o Design System oficial do DAIA (Desenvolvimento Ágil para Projetos de Inteligência Artificial), ditando a identidade visual, paleta de cores, tipografia e diretrizes de usabilidade para o frontend (React). A especificação é derivada diretamente dos protótipos de interface (`prints`) do MVP, estabelecendo o padrão visual Premium que o sistema deve seguir.

---

## 2. Contexto e Motivação

**Problema:**
A construção de um painel web (dashboard) de fiscalização de contratos com muitas informações textuais e numéricas pode gerar cansaço visual e inconsistência de UI se não houver um padrão bem definido. Telas sem padronização prejudicam a usabilidade e a percepção de valor (design premium).

**Por que agora / A Solução:**
Criar um Design System padronizado garante que todos os componentes (tabelas, botões, modais e *badges*) sigam a mesma linguagem visual corporativa (com foco em tons de verde e contraste limpo), acelerando o desenvolvimento e entregando uma interface premium.

---

## 3. Goals (Objetivos)

- [ ] G-01: Estabelecer a paleta de cores padrão (Primary Green) e de feedback (Sucesso, Alerta, Perigo).
- [ ] G-02: Padronizar a tipografia do sistema para leitura de dados de alta densidade.
- [ ] G-03: Definir a estrutura principal do layout (Sidebar à esquerda, Main Content com Header).
- [ ] G-04: Mapear os estilos visuais de componentes chave (Tabelas, KPIs, Drag & Drop).

**Métricas de sucesso:**
| Métrica | Baseline atual | Target | Prazo |
|---------|---------------|--------|-------|
| Padronização de Cores | 0% | 100% de uso de tokens mapeados no Tailwind | MVP |
| Experiência Premium | Sem CSS base | Transições fluidas (hover) em 100% da UI | MVP |

---

## 4. Non-Goals (Fora do Escopo)

- NG-01: Não abrange a criação lógica (Javascript) dos componentes React, apenas sua especificação visual (CSS/Tailwind).
- NG-02: Não abrange o desenvolvimento de temas escuros (Dark Mode) para o MVP.

---

## 5. Usuários e Personas

**Usuário primário:** Desenvolvedores Frontend responsáveis por componentizar as telas no React.

**Jornada atual (sem a feature):**
Os desenvolvedores precisam "adivinhar" cores e espaçamentos olhando para os prints, gerando retrabalho e interfaces não coesas.

**Jornada futura (com a feature):**
Os desenvolvedores têm um guia técnico (Tokens Tailwind) para consultar as cores exatas, pesos de fonte e padrões de comportamento interativo.

---

## 6. Requisitos Funcionais

### 6.1 Requisitos Principais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | Configuração do Tailwind | Must | O `tailwind.config.js` deve conter as cores mapeadas neste PRD. |
| RF-02 | Cores de Status | Must | O sistema deve usar as cores de feedback (Verde, Amarelo, Vermelho) para status exatos. |
| RF-03 | Componente Sidebar | Must | A sidebar deve ter cor de fundo fixada no verde primário. |
| RF-04 | Transições e Micro-interações | Must | Botões e links devem ter transições de *hover* e sombras ativas (`shadow-sm` para `shadow-md`). |

### 6.2 Fluxo Principal (Happy Path)
*Nota: Sendo um PRD de Design, o fluxo principal descreve a jornada de implementação.*
1. O desenvolvedor Frontend adiciona a configuração de cores baseadas na seção 8 no Tailwind.
2. A fonte principal da aplicação é inserida no arquivo CSS central.
3. Componentes comuns (Botão, Badge, Card) são criados seguindo estritamente essas regras antes da montagem das telas complexas.

### 6.3 Fluxos Alternativos
**N/A** - Esta especificação é predominantemente visual.

---

## 7. Requisitos Não-Funcionais

| ID | Requisito | Valor alvo | Observação |
|----|-----------|-----------|------------|
| RNF-01 | Acessibilidade (Contraste) | WCAG AA | Textos secundários não podem ter contraste inferior à norma (ex: usar cinza médio/escuro). |
| RNF-02 | Performance CSS | Tailwind | Uso de classes utilitárias em vez de criar estilos excessivos em arquivos `.css` isolados. |

---

## 8. Design e Interface

### 8.1 Paleta de Cores (Color Tokens)
- **Primary Green:** `#065F46` (Fundo da Sidebar, Botões principais, Textos de destaque).
- **Primary Hover:** `#059669` (Estado de Hover de botões, fundo de item ativo na Sidebar).
- **Background Principal:** `#F3F4F6` ou `#F9FAFB` (Fundo da tela).
- **Surface / Card:** `#FFFFFF` (Fundo das tabelas e containers).
- **Bordas:** `#E5E7EB`.
- **Textos:** Principal `#111827`, Secundário `#6B7280`.

### 8.2 Cores de Feedback (Status Badges)
- **Sucesso / Revisado:** Fundo `#DCFCE7`, Texto `#166534`.
- **Pendente:** Fundo `#FEF08A`, Texto `#854D0E`.
- **Alerta:** Fundo `#FEE2E2`, Texto `#991B1B`.

### 8.3 Tipografia
- **Font-family:** `Inter`, `Roboto` ou sistema nativo.
- **Títulos (H1/H2):** Bold/SemiBold (`700`/`600`), `#111827`.
- **Cabeçalhos de Tabela:** Medium (`500`), Uppercase, `text-xs`, `#6B7280`.

### 8.4 Estrutura Base e Componentes
- **Layout:** Sidebar à esquerda. Área principal central com Header branco (contendo Breadcrumbs).
- **Tabelas:** Bordas finas e espaçamento amplo, texto em caixa alta nos cabeçalhos.
- **Cards de KPI:** Fundo branco, cantos arredondados, sobra fina (`shadow-sm`).
- **Drag & Drop:** Zona pontilhada, feedback em hover (`bg-green-50`).

---

## 9. Modelo de Dados

**Tokens de Estilo (Exemplo de Tailwind Config):**
Apesar de não ser banco de dados, o Design System estabelece o "modelo" visual do CSS:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#065F46',
      primaryHover: '#059669',
      surface: '#FFFFFF',
      background: '#F3F4F6',
    }
  }
}
```

---

## 10. Integrações e Dependências

| Dependência | Tipo | Impacto se indisponível |
|-------------|------|------------------------|
| Tailwind CSS | UI Framework | Obrigatório para construir a UI sem necessidade de escrever CSS puro (vanilla) do zero. |
| Google Fonts | Tipografia | Afetará a legibilidade e sensação "Premium" se a fonte Inter/Roboto não for carregada. |

---

## 11. Edge Cases e Tratamento de Erros

| Cenário | Trigger | Comportamento esperado |
|---------|---------|----------------------|
| EC-01: Responsividade Móvel | Acesso por tela pequena | A Sidebar vira um "hamburger menu" ou desliza (Off-canvas). As tabelas adicionam scroll horizontal. |

---

## 12. Segurança e Privacidade

N/A - As definições de estilo do CSS não afetam a segurança da aplicação.

---

## 13. Plano de Rollout

- **Estratégia:** Inicializar o front-end React utilizando Vite + TailwindCSS e declarar as cores descritas na seção 8 diretamente no arquivo de configuração do Tailwind (`tailwind.config.js`).

---

## 14. Open Questions

- N/A
