-- Inicialização do Banco de Dados DAIA

CREATE TABLE IF NOT EXISTS usuarios (
    id VARCHAR(36) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    nivel_acesso VARCHAR(50) NOT NULL DEFAULT 'fiscal',
    is_ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS empresas (
    id VARCHAR(36) PRIMARY KEY,
    cnpj VARCHAR(14) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contratos (
    id VARCHAR(36) PRIMARY KEY,
    empresa_id VARCHAR(36) NOT NULL,
    criado_por VARCHAR(36) NOT NULL,
    nome_contrato VARCHAR(255) NOT NULL,
    numero_contrato VARCHAR(100),
    resumo TEXT,
    sms_checklist JSON,
    status_auditoria VARCHAR(50) DEFAULT 'pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE RESTRICT,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS documentos_anexos (
    id VARCHAR(36) PRIMARY KEY,
    contrato_id VARCHAR(36) NOT NULL,
    nome_arquivo VARCHAR(255) NOT NULL,
    tipo_documento VARCHAR(100),
    caminho_storage VARCHAR(500) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contrato_id) REFERENCES contratos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS clausulas (
    id VARCHAR(36) PRIMARY KEY,
    contrato_id VARCHAR(36) NOT NULL,
    documento_anexo_id VARCHAR(36),
    tipo VARCHAR(100) NOT NULL,
    texto_extraido TEXT NOT NULL,
    pagina_origem INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contrato_id) REFERENCES contratos(id) ON DELETE CASCADE,
    FOREIGN KEY (documento_anexo_id) REFERENCES documentos_anexos(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS auditoria_logs (
    id VARCHAR(36) PRIMARY KEY,
    contrato_id VARCHAR(36) NOT NULL,
    usuario_id VARCHAR(36) NOT NULL,
    campo_alterado VARCHAR(255) NOT NULL,
    valor_antigo TEXT,
    valor_novo TEXT,
    data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contrato_id) REFERENCES contratos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);
