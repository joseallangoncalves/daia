# 05 - Modelagem de Dados MySQL

Este documento descreve a estrutura relacional de banco de dados (`MySQL`) para suportar o armazenamento persistente dos contratos, cláusulas, resumos e o relacionamento 1:N entre Empresas e Contratos.

## 1. Diagrama de Relacionamento Lógico
O **Contrato é a entidade centralizadora** do sistema. Tudo estará vinculado a ele:
- Uma Entidade `Empresa` (identificada unicamente pelo seu CNPJ) pode ser contratante ou contratada em **múltiplos** `Contratos` (Relacionamento 1:N). 
- Um `Contrato` pode ter **múltiplos** `Documentos Anexos` atrelados a ele, como o pdf original, aditivos e especificações técnicas (Relacionamento 1:N).
- Um `Contrato` possui **múltiplas** `Clausulas` extraídas (Relacionamento 1:N).

## 2. Estrutura das Tabelas (Esquema SQL Proposto)

### 2.1 Tabela `usuarios`
Gerencia a autenticação e autorização (RBAC) dos operadores do sistema.
- `id` (INT, PK, Auto Increment)
- `nome` (VARCHAR(255), NOT NULL)
- `username` (VARCHAR(100), UNIQUE, NOT NULL)
- `senha_hash` (VARCHAR(255), NOT NULL)
- `nivel_acesso` (ENUM('admin', 'fiscal', 'auditor', 'leitor'), DEFAULT 'leitor')
- `is_ativo` (BOOLEAN, DEFAULT TRUE)
- `criado_em` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 2.2 Tabela `empresas`
Armazena de forma única os CNPJs e nomes das empresas envolvidas para evitar redundância.
- `id` (INT, PK, Auto Increment)
- `cnpj` (VARCHAR(18), UNIQUE, NOT NULL)
- `nome` (VARCHAR(255), NOT NULL)

### 2.3 Tabela `contratos`
Entidade central do projeto, armazenando os metadados e um resumo estruturado. Ela é o elo de ligação principal para as demais informações.
- `id` (INT, PK, Auto Increment)
- `empresa_id` (INT, FK referenciando `empresas.id`)
- `criado_por` (INT, FK referenciando `usuarios.id`) - *Garante o isolamento de visualização por fiscal*
- `nome_contrato` (VARCHAR(255), NOT NULL) - *Ex: "Prestação de Serviços de Limpeza"*
- `numero_contrato` (VARCHAR(50), NOT NULL)
- `resumo` (TEXT) - *Resumo executivo gerado pelo Agente 5*
- `sms_checklist` (JSON) - *Resultado bruto das checagens (incluindo qual documento_anexo_id e página comprovam a regra)*
- `status_auditoria` (ENUM('pendente', 'validado'), DEFAULT 'pendente')
- `criado_em` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 2.4 Tabela `documentos_anexos`
Armazena a referência física para múltiplos arquivos (geralmente PDFs) anexados ao Contrato.
- `id` (INT, PK, Auto Increment)
- `contrato_id` (INT, FK referenciando `contratos.id`)
- `nome_arquivo` (VARCHAR(255))
- `tipo_documento` (VARCHAR(100)) - *Ex: 'Contrato Principal', 'Anexo Técnico', 'Aditivo'*
- `caminho_storage` (VARCHAR(500)) - *Caminho no storage (ex: `/uploads/1234_2026_anexo_A.pdf`)*
- `data_upload` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 2.5 Tabela `clausulas`
Armazena as cláusulas extraídas individualmente, apontando EXATAMENTE para o documento e a página de onde foram retiradas. Isso garante que a interface (Frontend) possa abrir o PDF correto e destacar o texto para o fiscal de contrato.
- `id` (INT, PK, Auto Increment)
- `contrato_id` (INT, FK referenciando `contratos.id`)
- `documento_anexo_id` (INT, FK referenciando `documentos_anexos.id`) - *Permite carregar o PDF correto daquela cláusula*
- `tipo` (VARCHAR(50)) - *Ex: 'Vigencia', 'Multa', 'CriterioMedicao'*
- `texto_extraido` (TEXT)
- `pagina_origem` (INT) - *Página exata do PDF referenciado acima*

### 2.6 Tabela `auditoria_logs`
Rastreamento de qualquer alteração manual realizada por um usuário nos dados extraídos pela IA, garantindo segurança e transparência (contingência contra alucinação).
- `id` (INT, PK, Auto Increment)
- `contrato_id` (INT, FK referenciando `contratos.id`)
- `usuario_id` (INT, FK referenciando `usuarios.id`)
- `campo_alterado` (VARCHAR(100)) - *Ex: 'clausulas.multa', 'resumo'*
- `valor_antigo` (TEXT)
- `valor_novo` (TEXT)
- `data_alteracao` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

## 3. Implementação Prática (SQLAlchemy)
Recomenda-se o uso do ORM SQLAlchemy no backend FastAPI. Os modelos do SQLAlchemy mapearão as relações utilizando `relationship()`. Além da estrutura de contratos, um foco especial deve ser dado ao hashing de senha (ex: biblioteca `passlib`) no modelo `Usuario`.
