from typing import List, Optional
from pydantic import BaseModel, Field
import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

# --- Schemas Pydantic para Structured Output ---

class CadastroEmpresa(BaseModel):
    cnpj: str = Field(description="CNPJ da empresa contratada no formato XX.XXX.XXX/XXXX-XX")
    nome: str = Field(description="Razão social da empresa contratada")
    numero_contrato: Optional[str] = Field(None, description="Número do contrato, se houver")

class RegraClausula(BaseModel):
    tipo: str = Field(description="Tipo da obrigação (ex: Multa, Prazo, Qualidade, Pagamento)")
    descricao: str = Field(description="Descrição detalhada da obrigação ou multa")
    pagina_origem: Optional[int] = Field(None, description="Número da página onde a informação foi encontrada (baseado na tag [PAGINA: X])")

class ClausulasContrato(BaseModel):
    clausulas: List[RegraClausula] = Field(description="Lista de cláusulas importantes extraídas")
    resumo_executivo: str = Field(description="Resumo executivo do contrato")

class SMSChecklist(BaseModel):
    item: str = Field(description="Item do checklist de Segurança, Meio Ambiente e Saúde")
    aplicavel: bool = Field(description="Se o item é aplicável a este contrato (Sim/Não)")
    pagina_origem: Optional[int] = Field(None, description="Página de origem da evidência")

class AnaliseSMS(BaseModel):
    checklist: List[SMSChecklist]

# --- Funções do Pipeline de IA ---

def _call_llm_structured(system_prompt: str, user_prompt: str, response_format_class):
    """Função base para chamar a OpenAI utilizando o recurso de parse e Structured Output."""
    if not openai.api_key:
        raise ValueError("OPENAI_API_KEY não configurada no ambiente.")

    response = openai.beta.chat.completions.parse(
        model="gpt-4o", # Modelos que suportam structured output
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        response_format=response_format_class,
        temperature=0.0
    )
    return response.choices[0].message.parsed

from .skill_router import SkillRouter

router = SkillRouter()

def agent_cadastro(texto_completo: str) -> CadastroEmpresa:
    skill = router.get_skill_by_id("cadastro")
    system_prompt = skill.prompt if skill else "Você é um assistente de extração."
    return _call_llm_structured(system_prompt, texto_completo[:8000], CadastroEmpresa)

def agent_clausulas(texto_segmentado: str) -> ClausulasContrato:
    skill = router.get_skill_by_id("clausulas")
    system_prompt = skill.prompt if skill else "Você extrai cláusulas."
    return _call_llm_structured(system_prompt, texto_segmentado, ClausulasContrato)

def agent_sms(texto_segmentado: str) -> AnaliseSMS:
    skill = router.get_skill_by_id("sms")
    system_prompt = skill.prompt if skill else "Você extrai regras de SMS."
    return _call_llm_structured(system_prompt, texto_segmentado, AnaliseSMS)
