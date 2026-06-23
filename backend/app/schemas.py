from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class UsuarioBase(BaseModel):
    nome: str
    username: str

class UsuarioResponse(UsuarioBase):
    id: str
    nivel_acesso: str
    is_ativo: bool

    class Config:
        from_attributes = True

class EmpresaBase(BaseModel):
    cnpj: str
    nome: str

class EmpresaResponse(EmpresaBase):
    id: str
    criado_em: datetime

    class Config:
        from_attributes = True

class ContratoUpdate(BaseModel):
    resumo: Optional[str] = None
    status_auditoria: Optional[str] = None
    sms_checklist: Optional[Dict[str, Any]] = None

class ContratoResponse(BaseModel):
    id: str
    empresa_id: str
    criado_por: str
    nome_contrato: str
    numero_contrato: Optional[str]
    resumo: Optional[str]
    sms_checklist: Optional[Dict[str, Any]]
    status_auditoria: str
    criado_em: datetime

    class Config:
        from_attributes = True
