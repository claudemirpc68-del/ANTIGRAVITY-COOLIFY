"""
ESCALA_FÁCIL - API Supabase
Interface de consulta de escala usando PostgreSQL/Supabase.
Substitui o scripts/api_mock.py.
"""

from datetime import date, timedelta, datetime
from typing import Optional
from supabase_client import get_supabase

def identificar_usuario(matricula: str) -> dict:
    """Identifica o usuário pela matrícula via Supabase."""
    supabase = get_supabase()
    response = supabase.table("colaboradores").select("*").eq("matricula", matricula).execute()
    
    if not response.data:
        return {"tipo": "nao_encontrado", "nome": ""}
    
    usuario = response.data[0]
    return {
        "tipo": usuario["tipo"], # 'gestor' ou 'colaborador'
        "nome": usuario["nome"],
        "funcao": usuario.get("funcao")
    }

def get_escala_semanal(matricula: str) -> str:
    """Retorna os dias de trabalho da semana atual consultando o Supabase."""
    supabase = get_supabase()
    
    # Busca dados do colaborador
    colab = supabase.table("colaboradores").select("nome").eq("matricula", matricula).execute()
    if not colab.data:
        return "❌ Matrícula não encontrada."
    nome = colab.data[0]["nome"]
    
    hoje = date.today()
    inicio_semana = hoje - timedelta(days=hoje.weekday())
    fim_semana = inicio_semana + timedelta(days=6)
    
    # Busca escalas no range da semana
    response = (supabase.table("escalas")
                .select("*")
                .eq("matricula", matricula)
                .gte("data", str(inicio_semana))
                .lte("data", str(fim_semana))
                .order("data")
                .execute())
    
    if not response.data:
        return "⚠️ Nenhuma informação de escala encontrada para a semana atual."

    linhas = [f"📅 *Escala desta semana - {nome}*\n"]
    for dia in response.data:
        emoji = "✅" if dia["status"] == "TRABALHA" else "🟡"
        if dia["status"] == "TRABALHA":
            linha = f"  {emoji} {dia['dia_semana']} ({dia['data']}): TRABALHA às {dia.get('entrada') or '--:--'}"
        else:
            linha = f"  {emoji} {dia['dia_semana']} ({dia['data']}): FOLGA ({dia.get('tipo_folga') or ''})"
        linhas.append(linha)

    linhas.append("\n⚠️ _Atenção: o gestor tem a última palavra e pode alterar em caso de necessidade operacional._")
    return "\n".join(linhas)

def get_proxima_folga(matricula: str) -> str:
    """Retorna a data da próxima folga via Supabase."""
    supabase = get_supabase()
    hoje = str(date.today())
    
    response = (supabase.table("escalas")
                .select("*, colaboradores(nome)")
                .eq("matricula", matricula)
                .eq("status", "FOLGA")
                .gte("data", hoje)
                .order("data")
                .limit(1)
                .execute())
    
    if not response.data:
        return "⚠️ Não foi encontrada uma próxima folga no calendário atual."

    folga = response.data[0]
    nome = folga["colaboradores"]["nome"]
    return (
        f"📆 *{nome}*, sua próxima folga está prevista para "
        f"*{folga['dia_semana']}, {folga['data']}* ({folga.get('tipo_folga') or ''}).\n\n"
        "⚠️ _O gestor tem a última palavra e pode alterar em caso de necessidade operacional._"
    )

def get_domingos_folga(matricula: str) -> str:
    """Lista os domingos de folga do mês via Supabase."""
    supabase = get_supabase()
    
    # Busca nome
    colab = supabase.table("colaboradores").select("nome").eq("matricula", matricula).execute()
    if not colab.data:
        return "❌ Matrícula não encontrada."
    nome = colab.data[0]["nome"]
    
    # Busca domingos
    response = (supabase.table("domingos_folga")
                .select("data")
                .eq("matricula", matricula)
                .order("data")
                .execute())
    
    if not response.data:
        return "⚠️ Nenhum domingo de folga registrado para este mês."

    domingos = [d["data"] for d in response.data]
    datas_formatadas = " e ".join(domingos)
    return (
        f"🗓️ *{nome}*, neste mês você tem *{len(domingos)} domingo(s) de folga*:\n"
        f"  → {datas_formatadas}\n\n"
        "⚠️ _O gestor tem a última palavra e pode alterar em caso de necessidade operacional._"
    )

def get_resumo_equipe() -> str:
    """Retorna um resumo da equipe para o gestor via Supabase."""
    supabase = get_supabase()
    hoje = str(date.today())
    
    # Total de colaboradores
    total_res = supabase.table("colaboradores").select("matricula", count="exact").eq("tipo", "colaborador").execute()
    total = total_res.count if total_res.count is not None else 0
    
    # Trabalhando hoje
    trabalhando_res = supabase.table("escalas").select("matricula", count="exact").eq("data", hoje).eq("status", "TRABALHA").execute()
    trabalhando = trabalhando_res.count if trabalhando_res.count is not None else 0
    
    # De folga hoje
    de_folga_res = supabase.table("escalas").select("matricula", count="exact").eq("data", hoje).eq("status", "FOLGA").execute()
    de_folga = de_folga_res.count if de_folga_res.count is not None else 0

    return (
        f"📊 *Resumo da Equipe - {hoje}*\n"
        f"  👥 Total de colaboradores: {total}\n"
        f"  ✅ Trabalhando hoje: {trabalhando}\n"
        f"  🟡 De folga hoje: {de_folga}"
    )

def salvar_solicitacao(matricula: str, nome: str, tipo_solicitacao: str, texto: str) -> bool:
    """Salva uma nova solicitação no Supabase."""
    supabase = get_supabase()
    try:
        supabase.table("solicitacoes").insert({
            "matricula": matricula,
            "nome": nome,
            "tipo": tipo_solicitacao,
            "texto": texto,
            "status": "PENDENTE"
        }).execute()
        return True
    except Exception as e:
        print(f"❌ Erro ao salvar solicitação: {e}")
        return False

def listar_solicitacoes_pendentes() -> str:
    """Lista solicitações pendentes para o gestor via Supabase."""
    supabase = get_supabase()
    response = (supabase.table("solicitacoes")
                .select("*")
                .eq("status", "PENDENTE")
                .order("id")
                .execute())
    
    pendentes = response.data
    if not pendentes:
        return "✅ Todas as solicitações estão em dia. Não há itens pendentes."
        
    linhas = [f"📋 *Você tem {len(pendentes)} solicitações pendentes:*\n"]
    for s in pendentes:
        linhas.append(f"🔹 *ID {s['id']}* - {s['tipo']} de {s['nome']}")
        linhas.append(f"   💬 \"{s['texto']}\"\n")
        
    linhas.append("Para aprovar ou rejeitar, use o painel administrativo.")
    return "\n".join(linhas)
