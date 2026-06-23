import uuid
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, JSON, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    nome = Column(String(100), nullable=False)
    username = Column(String(100), unique=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)
    nivel_acesso = Column(String(50), nullable=False, default='fiscal')
    is_ativo = Column(Boolean, nullable=False, default=True)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    contratos = relationship("Contrato", back_populates="criador", foreign_keys="[Contrato.criado_por]")
    auditorias = relationship("AuditoriaLog", back_populates="usuario")

class Empresa(Base):
    __tablename__ = "empresas"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    cnpj = Column(String(14), unique=True, nullable=False)
    nome = Column(String(255), nullable=False)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    contratos = relationship("Contrato", back_populates="empresa")

class Contrato(Base):
    __tablename__ = "contratos"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    empresa_id = Column(String(36), ForeignKey("empresas.id", ondelete="RESTRICT"), nullable=False)
    criado_por = Column(String(36), ForeignKey("usuarios.id", ondelete="RESTRICT"), nullable=False)
    nome_contrato = Column(String(255), nullable=False)
    numero_contrato = Column(String(100))
    resumo = Column(Text)
    sms_checklist = Column(JSON)
    status_auditoria = Column(String(50), default='pendente')
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    empresa = relationship("Empresa", back_populates="contratos")
    criador = relationship("Usuario", back_populates="contratos", foreign_keys=[criado_por])
    anexos = relationship("DocumentoAnexo", back_populates="contrato", cascade="all, delete-orphan")
    clausulas = relationship("Clausula", back_populates="contrato", cascade="all, delete-orphan")
    auditoria_logs = relationship("AuditoriaLog", back_populates="contrato", cascade="all, delete-orphan")

class DocumentoAnexo(Base):
    __tablename__ = "documentos_anexos"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    contrato_id = Column(String(36), ForeignKey("contratos.id", ondelete="CASCADE"), nullable=False)
    nome_arquivo = Column(String(255), nullable=False)
    tipo_documento = Column(String(100))
    caminho_storage = Column(String(500), nullable=False)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    contrato = relationship("Contrato", back_populates="anexos")
    clausulas = relationship("Clausula", back_populates="anexo")

class Clausula(Base):
    __tablename__ = "clausulas"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    contrato_id = Column(String(36), ForeignKey("contratos.id", ondelete="CASCADE"), nullable=False)
    documento_anexo_id = Column(String(36), ForeignKey("documentos_anexos.id", ondelete="SET NULL"))
    tipo = Column(String(100), nullable=False)
    texto_extraido = Column(Text, nullable=False)
    pagina_origem = Column(Integer)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    contrato = relationship("Contrato", back_populates="clausulas")
    anexo = relationship("DocumentoAnexo", back_populates="clausulas")

class AuditoriaLog(Base):
    __tablename__ = "auditoria_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    contrato_id = Column(String(36), ForeignKey("contratos.id", ondelete="CASCADE"), nullable=False)
    usuario_id = Column(String(36), ForeignKey("usuarios.id", ondelete="RESTRICT"), nullable=False)
    campo_alterado = Column(String(255), nullable=False)
    valor_antigo = Column(Text)
    valor_novo = Column(Text)
    data_alteracao = Column(DateTime(timezone=True), server_default=func.now())

    contrato = relationship("Contrato", back_populates="auditoria_logs")
    usuario = relationship("Usuario", back_populates="auditorias")
