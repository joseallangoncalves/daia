from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from ..database import get_db
from ..models import Usuario
from ..core.security import verify_password, create_access_token, get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES
from ..schemas import Token, UsuarioResponse

router = APIRouter()

@router.post("/login", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Endpoint utilitário para criar o primeiro admin (em dev)
@router.post("/setup-admin", response_model=UsuarioResponse)
def create_admin(db: Session = Depends(get_db)):
    if db.query(Usuario).count() > 0:
         raise HTTPException(status_code=400, detail="Admin já existe")
    
    admin = Usuario(
        nome="Administrador",
        username="admin",
        senha_hash=get_password_hash("admin123"),
        nivel_acesso="admin"
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin
