from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import auth, contratos
from .database import engine, Base

# Cria as tabelas caso não usemos o init.sql do Docker
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DAIA API - Fiscalização de Contratos",
    description="API do MVP de Inteligência Artificial para leitura de contratos",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Ajustar para o IP do frontend em produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Autenticação"])
app.include_router(contratos.router, prefix="/api/v1/contratos", tags=["Contratos"])

@app.get("/")
def root():
    return {"message": "DAIA API is running!"}
