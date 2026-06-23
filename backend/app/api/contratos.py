from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import Contrato, Empresa, DocumentoAnexo, Usuario, AuditoriaLog
from ..schemas import ContratoResponse, ContratoUpdate
from ..core.security import get_current_user
from ..services.pdf_parser import PDFParser
from ..services.ai_pipeline import agent_cadastro, agent_clausulas, agent_sms

router = APIRouter()

@router.post("/upload", response_model=ContratoResponse)
async def upload_contrato(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=422, detail="Apenas arquivos PDF são aceitos.")

    file_bytes = await file.read()
    
    # 1. Parsing do PDF
    parser = PDFParser(file.filename)
    full_text = parser.extract_text(file_bytes)
    
    if not full_text:
        raise HTTPException(status_code=422, detail="Não foi possível extrair texto do PDF (possível documento escaneado sem OCR).")

    # 2. IA - Cadastro
    try:
        cadastro = agent_cadastro(full_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na extração de metadados: {str(e)}")

    # Procura ou cria a empresa com base no CNPJ extraído
    empresa = db.query(Empresa).filter(Empresa.cnpj == cadastro.cnpj).first()
    if not empresa:
        empresa = Empresa(cnpj=cadastro.cnpj, nome=cadastro.nome)
        db.add(empresa)
        db.flush()

    # Cria o Contrato
    novo_contrato = Contrato(
        empresa_id=empresa.id,
        criado_por=current_user.id,
        nome_contrato=cadastro.nome + " - Contrato",
        numero_contrato=cadastro.numero_contrato,
        status_auditoria="pendente"
    )
    db.add(novo_contrato)
    db.flush()

    # Salva o Anexo
    # Em produção, faríamos o upload para um S3. Aqui apenas simulamos o caminho.
    anexo = DocumentoAnexo(
        contrato_id=novo_contrato.id,
        nome_arquivo=file.filename,
        tipo_documento="PDF Original",
        caminho_storage=f"/storage/{file.filename}"
    )
    db.add(anexo)

    # 3. IA - Cláusulas e SMS (Segmentação prévia para poupar tokens)
    text_clausulas = parser.segment_text(full_text, ["Cláusula", "Obrigação", "Multa", "Pagamento", "Prazo"])
    text_sms = parser.segment_text(full_text, ["Segurança", "Meio Ambiente", "Saúde", "SMS", "EPI", "Treinamento"])

    if text_clausulas:
        res_clausulas = agent_clausulas(text_clausulas)
        novo_contrato.resumo = res_clausulas.resumo_executivo
        # O ideal aqui é inserir em `clausulas` table, mas no MVP podemos apenas colocar no log ou resumir.
        
    if text_sms:
        res_sms = agent_sms(text_sms)
        novo_contrato.sms_checklist = res_sms.model_dump()

    db.commit()
    db.refresh(novo_contrato)
    return novo_contrato

@router.get("/", response_model=List[ContratoResponse])
def listar_contratos(db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    # Fiscais só veem os contratos que eles mesmos subiram (RBAC)
    if current_user.nivel_acesso == "admin":
        return db.query(Contrato).all()
    return db.query(Contrato).filter(Contrato.criado_por == current_user.id).all()

@router.put("/{contrato_id}", response_model=ContratoResponse)
def atualizar_contrato(
    contrato_id: str,
    update_data: ContratoUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    contrato = db.query(Contrato).filter(Contrato.id == contrato_id).first()
    if not contrato:
        raise HTTPException(status_code=404, detail="Contrato não encontrado")
    
    # Verifica permissão
    if current_user.nivel_acesso != "admin" and contrato.criado_por != current_user.id:
        raise HTTPException(status_code=403, detail="Você não tem permissão para editar este contrato")

    # Auditoria e atualização
    update_dict = update_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        old_value = getattr(contrato, key)
        if old_value != value:
            # Salva o log de auditoria
            log = AuditoriaLog(
                contrato_id=contrato.id,
                usuario_id=current_user.id,
                campo_alterado=key,
                valor_antigo=str(old_value),
                valor_novo=str(value)
            )
            db.add(log)
            setattr(contrato, key, value)

    db.commit()
    db.refresh(contrato)
    return contrato
