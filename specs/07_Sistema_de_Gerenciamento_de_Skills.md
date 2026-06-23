# Spec: PRD — 07 Sistema de Gerenciamento de Skills (Agentes)

**Versão:** 1.0
**Status:** Draft
**Autor:** Equipe de Desenvolvimento
**Data:** 2026-06-23
**Reviewers:** Time de IA e Backend

---

## 1. Resumo

A arquitetura de injeção de habilidades (`Skills`) possibilita que novas capacidades de análise de contratos, prompts engessados ou guias instrucionais complexos se integrem dinamicamente ao pipeline do FastAPI sem requerer reinicialização do backend. Através deste sistema (Loader -> Router -> Executor), cada subpasta de skill vira um agente especializado reconhecido pela LLM para processar os PDFs.

---

## 2. Contexto e Motivação

**Problema:**
Adicionar novos agentes (ex: Analista de Medição, Analista de SMS) no nível de código Python puro (hardcoded) causa quebras de estabilidade e requer reboot do backend a cada alteração pequena na string de inteligência ou prompt.

**Evidências / Solução:**
Se a LLM receber instruções enormes fixas no seu Master Prompt geral, ela consome muitos tokens desnecessariamente e sofre perda de atenção. Separar num formato plugin (pasta modular) deixa o Router LLM usar um prompt leve para instanciar a skill certa de acordo com o trecho do contrato segmentado.

---

## 3. Goals (Objetivos)

- [ ] G-01: Ler no backend a pasta `.agents` na raiz do projeto, mapeando os arquivos `SKILL.md` (ou YAML).
- [ ] G-02: Executar um Router inicial para identificar qual agente (skill) deve processar aquele trecho específico do contrato.
- [ ] G-03: Inserir a documentação detalhada do Agente no Contexto da LLM apenas durante a iteração necessária (Runtime Injection).

**Métricas de sucesso:**
| Métrica | Baseline atual | Target | Prazo |
|---------|---------------|--------|-------|
| Re-escrita Hot Reload | Reboot do FastAPI | Leitura em tempo real (Python OS) | MVP |
| Taxa de Sucesso Router | Hardcoded Python | 99% precisão ao acionar a skill | MVP |

---

## 4. Non-Goals (Fora do Escopo)

- NG-01: Chamar múltiplas Skills distintas simultaneamente para a mesma intenção sem paralelismo apropriado no backend.

---

## 5. Usuários e Personas

**Usuário primário:** Backend FastAPI e Desenvolvedores de Prompts.

**Jornada atual:**
Prompts ficam misturados no meio do código Python em `app/agents/`, dificultando a manutenção.

**Jornada futura:**
O desenvolvedor de IA apenas cria uma nova pasta com o `SKILL.md` dentro do diretório `.agents` na raiz do projeto, e o sistema lê dinamicamente, transformando-o num novo agente de extração de contratos disponível para o FastAPI.

---

## 6. Requisitos Funcionais

### 6.1 Requisitos Principais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | `SkillLoader` | Must | Ler pasta `.agents` na raiz via Python e carregar os metadados. |
| RF-02 | `SkillRouter` | Must | Retornar em JSON estruturado a skill acionada (ex: `{"skillName": "analista-clausulas"}`). |
| RF-03 | Integração LLM | Must | Apenas a skill correspondente é injetada no System Prompt da chamada à API (OpenAI/Gemini). |

### 6.2 Fluxo Principal (Happy Path)

1. FastAPI recebe PDF e segmenta texto de "Obrigações e Multas".
2. O `SkillLoader` lê as skills de contratos cadastradas.
3. O `SkillRouter` avalia o segmento e retorna `{"skillName": "analista-clausulas"}`.
4. O backend lê o `SKILL.md` do Analista de Cláusulas.
5. O prompt da skill é repassado para a LLM, que extrai as obrigações e multas estruturadas.

### 6.3 Fluxos Alternativos

**Nenhum Casamento (N/A Intent):**
Se o texto segmentado do contrato não for reconhecido por nenhuma skill, o router ignora a extração para poupar tokens ou usa um Agente Resumidor Genérico.

---

## 7. Requisitos Não-Funcionais

| ID | Requisito | Valor alvo | Observação |
|----|-----------|-----------|------------|
| RNF-01 | Velocidade de I/O | Leitura rápida local | O Python deve usar `os` ou `pathlib` para ler os prompts localmente de forma otimizada. |

---

## 8. Design e Interface

**Componentes afetados:**
Não afeta interface do React, apenas a estrutura interna de processamento do backend.

---

## 9. Modelo de Dados

Não gera tabela no MySQL para as configurações, sendo baseado em leitura de YAML Frontmatter nos arquivos `SKILL.md`. Os resultados extraídos seguem para as tabelas de Cláusulas no MySQL.

---

## 10. Integrações e Dependências

| Dependência | Tipo | Impacto se indisponível |
|-------------|------|------------------------|
| Biblioteca `pyyaml` | Obrigatória | Necessária para fazer parse do frontmatter nos arquivos de skill. |
| Sistema de Arquivos OS | Obrigatória | O backend depende de acesso de leitura na pasta de skills. |

---

## 11. Edge Cases e Tratamento de Erros

| Cenário | Trigger | Comportamento esperado |
|---------|---------|----------------------|
| EC-01: Skill Duplicada | Duas pastas com o mesmo ID YAML | Sobrescreve mantendo a última carregada, com um warning no log do FastAPI. |
| EC-02: `SKILL.md` Ausente | Pasta criada vazia | O Loader pula a pasta silenciosamente sem quebrar o sistema. |
| EC-03: Erro no Frontmatter | Arquivo mal formatado | Rejeita load da skill específica e continua com o restante, gerando warning no terminal. |

---

## 12. Segurança e Privacidade

- **Proteção:** Como os prompts e definições de skills estão em arquivos locais, apenas desenvolvedores com acesso ao repositório ou container podem alterá-los. Nenhuma injeção externa do usuário React afeta as skills.

---

## 13. Plano de Rollout

- **Estratégia:** Utilizar o diretório `.agents` na raiz do projeto (`daia/.agents`) como modelo padrão e fonte da verdade. O backend deve ler os prompts e definições de skills diretamente destas pastas.

---

## 14. Open Questions

- N/A
