# Spec: PRD — 06 Arquitetura de Frontend React

**Versão:** 1.0
**Status:** Draft
**Autor:** Equipe de Desenvolvimento
**Data:** 2026-06-23
**Reviewers:** UX/UI Designers e Frontenders

---

## 1. Resumo

Especifica a arquitetura da interface de usuário (UI) e a experiência de usuário (UX) do painel web. O objetivo do frontend é ser a porta de entrada segura, elegante e funcional para a gestão dos contratos auditados pela Inteligência Artificial.

---

## 2. Contexto e Motivação

**Problema:**
A interface não pode ser lenta e confusa, pois o intuito de todo o sistema é aliviar a carga cognitiva dos Fiscais.

**Solução:**
Uma aplicação Single Page Application (SPA) em React garantindo estado fluido, visualizações dinâmicas e o efeito "UAU" requerido nas interfaces de produtos modernos.

---

## 3. Goals (Objetivos)

- [ ] G-01: Implementar sistema de Rotas Seguras.
- [ ] G-02: Tela de Login.
- [ ] G-03: Dashboard Global e de Empresas.
- [ ] G-04: Workspace de Auditoria em formato "Split Screen".
- [ ] G-05: Painel Administrativo de Controle.

**Métricas de sucesso:**
| Métrica | Baseline atual | Target | Prazo |
|---------|---------------|--------|-------|
| Interações "Wow" | Ausente | Animações suaves em hover e cliques | MVP |
| Carregamento Render PDF | N/A | Exibição de página exata apontada pela IA | MVP |

---

## 4. Non-Goals (Fora do Escopo)

- NG-01: Grandes bibliotecas genéricas e pesadas CSS. Serão utilizados Design Tokens em CSS Vanilla.

---

## 5. Usuários e Personas

**Usuário primário:** Fiscais interagindo na interface para submeter anexos e auditar o trabalho da IA. Administradores gerenciando perfis.

**Jornada de UI:**
Tela de Login -> Dashboard Macro -> Selecionar Empresa -> Subir novo Contrato via Modal -> Após processamento abre a tela de Trabalho de Auditoria (Split Screen).

---

## 6. Requisitos Funcionais

### 6.1 Requisitos Principais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | State Management | Must | Context API protegendo dados e salvando o Token JWT. |
| RF-02 | Upload de Modal | Must | Modal recebe Múltiplos Arquivos e exibe Spinner na submissão. |
| RF-03 | Visualizador PDF | Must | Reagir clicando na "cláusula", que pula a página do componente PDF automaticamente para `pagina_origem`. |
| RF-04 | Edição de Dados | Must | Cada item estruturado deve apresentar um botão de "Lápis" para ajuste, e enviar PUT via `axios/fetch`. |

### 6.2 Roteamento (Happy Path)

- `/login` (Login, *Glassmorphism* limpo).
- `/` (Dashboard Macro, cards e tabelas das Empresas).
- `/empresas/{cnpj}` (Painel da empresa exibindo todos os contratos e Botão Upload).
- `/contratos/{id}` (Split Screen: Lado Esq. PDF, Lado Dir. Estruturas IA com opção de edição).
- `/usuarios` (Acesso Admin para painel da equipe).

### 6.3 Fluxos Alternativos

**Sessão Expirada:** React intercepta 401 do Backend, limpa Context e redireciona `/login`.

---

## 7. Requisitos Não-Funcionais

| ID | Requisito | Valor alvo | Observação |
|----|-----------|-----------|------------|
| RNF-01 | React.js | Vite | Mais leve e rápido para bundling do SPA. |
| RNF-02 | API Client | Fetch/Axios | Requisições HTTP. |
| RNF-03 | Componente PDF | react-pdf | Biblioteca ou iframe para o visualizador integrado. |

---

## 8. Design e Interface

**Aparência "Wow":**
- **Cores e Micro-interações:** Fuga do padrão básico. Transições CSS suaves. Opção de Dark Mode ou cores vibrantes.
- **Tipografia:** Uso do Google Fonts (Inter, Outfit, ou Roboto) garantindo uma leitura "Premium".
- **Feedback Constante:** Exibir aos Fiscais de Contrato quando a "IA está processando" com componentes visuais atraentes.

---

## 9. Modelo de Dados

**Dados retidos no Frontend:**
Token e Dados Básicos do User (ID, Nível) em memória ou LocalStorage seguro.

---

## 10. Integrações e Dependências

| Dependência | Tipo | Impacto se indisponível |
|-------------|------|------------------------|
| FastAPI Backend | Obrigatória | Interface vazia sem comunicação de API. |

---

## 11. Edge Cases e Tratamento de Erros

| Cenário | Trigger | Comportamento esperado |
|---------|---------|----------------------|
| EC-01: Erro no login | Credencial Incorreta | Toast Message "Credencial inválida" com destaque sem desconfigurar a interface limpa. |

---

## 12. Segurança e Privacidade

- **Rotas protegidas:** React Router DOM irá expulsar e barrar navegação via link direto de usuários sem token autêntico e sem permissão adequada.

---

## 13. Plano de Rollout

- **Estratégia:** Inicializado na porta 3000 de forma autônoma pelo docker-compose.

---

## 14. Open Questions
- Nenhum.
