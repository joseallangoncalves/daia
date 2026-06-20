# Plano de Implementação (Versão 4) - Rastreabilidade Visual no Documento Original

Este plano foca em garantir que a interface do usuário possa exibir o PDF exato e apontar para a página onde a IA extraiu a informação, conforme solicitado.

## Mudanças Propostas nas Especificações

### 1. Atualizar Modelagem de Dados
#### [MODIFY] [05_Modelagem_de_Dados_MySQL.md](file:///c:/Users/User/Documents/GitHub/daia/specs/05_Modelagem_de_Dados_MySQL.md)
Vamos refinar a tabela `clausulas` para que ela aponte diretamente para o documento físico de origem:
- Adicionar `documento_anexo_id` (INT, FK) na tabela `clausulas`.
- Dessa forma, o React (Frontend) saberá exatamente qual PDF carregar na tela e para qual `pagina_origem` rolar quando você clicar na cláusula extraída.
- O `sms_checklist` na tabela `contratos` também precisará de uma estrutura JSON capaz de indicar o documento e a página da evidência.

### 2. Atualizar Pipeline de IA
#### [MODIFY] [03_Agentes_e_Pipeline_IA.md](file:///c:/Users/User/Documents/GitHub/daia/specs/03_Agentes_e_Pipeline_IA.md)
- O módulo de ingestão deverá injetar no texto (antes de mandar para a IA) uma marcação de qual arquivo e página aquele bloco de texto pertence (ex: `[Arquivo: anexo.pdf | Página: 4]`).
- Os System Prompts dos Agentes (Cláusulas, Medição, SMS) serão atualizados para exigir que eles retornem a `pagina_origem` e o `nome_arquivo_origem` da evidência encontrada.

### 3. Atualizar Endpoints da API
#### [MODIFY] [04_Especificacao_de_Endpoints_FastAPI.md](file:///c:/Users/User/Documents/GitHub/daia/specs/04_Especificacao_de_Endpoints_FastAPI.md)
- O payload de resposta detalhado (`GET /api/v1/contracts/{id_contrato}`) será atualizado para refletir o vínculo entre a cláusula e o seu respectivo arquivo físico, provendo a URL do PDF e a página da extração de forma explícita para o Frontend.
