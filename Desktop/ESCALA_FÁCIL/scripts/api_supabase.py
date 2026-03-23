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
    """Retorna um resumo detalhado da equipe para o gestor via Supabase."""
    supabase = get_supabase()
    hoje = str(date.today())
    
    # 1. Total de colaboradores
    total_res = supabase.table("colaboradores").select("matricula", count="exact").eq("tipo", "colaborador").execute()
    total = total_res.count if total_res.count is not None else 0
    
    # 2. Trabalhando hoje (com nomes)
    trabalhando_res = (supabase.table("escalas")
                       .select("matricula, colaboradores(nome)")
                       .eq("data", hoje)
                       .eq("status", "TRABALHA")
                       .execute())
    trabalhando_lista = [e["colaboradores"]["nome"] for e in trabalhando_res.data]
    
    # 3. De folga hoje (com nomes e motivos)
    de_folga_res = (supabase.table("escalas")
                    .select("matricula, tipo_folga, colaboradores(nome)")
                    .eq("data", hoje)
                    .eq("status", "FOLGA")
                    .execute())
    de_folga_lista = [f"{e['colaboradores']['nome']} ({e.get('tipo_folga') or 'Folga'})" for e in de_folga_res.data]

    # 4. Justificativas de ausência para hoje
    # (Solicitações do tipo 'Justificativa' criadas hoje ou com menção a hoje)
    justificativas_res = (supabase.table("solicitacoes")
                          .select("nome, texto")
                          .ilike("tipo", "%Justificativa%")
                          .gte("data_criacao", hoje)
                          .execute())
    justificativas_lista = [f"{j['nome']}: {j['texto']}" for j in justificativas_res.data]

    # Montando a resposta
    linhas = [f"📊 *Resumo Detalhado - {hoje}*\n"]
    linhas.append(f"👥 *Total da Equipe:* {total}")
    
    linhas.append(f"\n✅ *Presentes ({len(trabalhando_lista)}):*")
    if trabalhando_lista:
        linhas.append(f"  → {', '.join(trabalhando_lista)}")
    else:
        linhas.append("  → Nenhum colaborador escalado para hoje.")

    linhas.append(f"\n🟡 *Folgas ({len(de_folga_lista)}):*")
    if de_folga_lista:
        for f in de_folga_lista:
            linhas.append(f"  → {f}")
    else:
        linhas.append("  → Nenhuma folga hoje.")

    if justificativas_lista:
        linhas.append(f"\n⚠️ *Justificativas de Ausência/Atraso:*")
        for j in justificativas_lista:
            linhas.append(f"  → {j}")

    return "\n".join(linhas)

def salvar_solicitacao(matricula: str, nome: str, tipo_solicitacao: str, texto: str, media_url: str = None) -> bool:
    """Salva uma nova solicitação no Supabase."""
    supabase = get_supabase()
    try:
        supabase.table("solicitacoes").insert({
            "matricula": matricula,
            "nome": nome,
            "tipo": tipo_solicitacao,
            "texto": texto,
            "media_url": media_url,
            "status": "PENDENTE"
        }).execute()
        return True
    except Exception as e:
        print(f"❌ Erro ao salvar solicitação: {e}")
        return False

def listar_solicitacoes_pendentes(tipo_filtro: Optional[str] = None) -> str:
    """Lista solicitações pendentes para o gestor via Supabase, opcionalmente filtradas por tipo."""
    supabase = get_supabase()
    query = supabase.table("solicitacoes").select("*").eq("status", "PENDENTE")
    
    if tipo_filtro:
        # Busca aproximada para tipos como 'Justificativa', 'Troca', etc.
        query = query.ilike("tipo", f"%{tipo_filtro}%")
        
    response = query.order("id").execute()
    
    pendentes = response.data
    if not pendentes:
        msg = "✅ Não há solicitações pendentes"
        if tipo_filtro:
            msg += f" do tipo *{tipo_filtro}*."
        else:
            msg += "."
        return msg
        
    titulo = f"📋 *Pendentes: {len(pendentes)}*"
    if tipo_filtro:
        titulo = f"📋 *{tipo_filtro} Pendentes: {len(pendentes)}*"
        
    linhas = [f"{titulo}\n"]
    for s in pendentes:
        linhas.append(f"🔹 *ID {s['id']}* - {s['tipo']} de {s['nome']}")
        linhas.append(f"   💬 \"{s['texto']}\"\n")
        
    linhas.append("Para aprovar ou rejeitar, use o painel administrativo.")
    return "\n".join(linhas)

def get_relatorio_mensal_equipe() -> str:
    """Gera um relatório estatístico simples do mês atual via Supabase."""
    supabase = get_supabase()
    hoje = date.today()
    inicio_mes = hoje.replace(day=1)
    
    # Busca todas as escalas do mês para estatísticas
    response = (supabase.table("escalas")
                .select("status")
                .gte("data", str(inicio_mes))
                .lte("data", str(hoje)) # Até hoje
                .execute())
    
    escalas = response.data
    if not escalas:
        return "📊 Sem dados de escala suficientes para gerar o relatório do mês."

    trabalhados = sum(1 for e in escalas if e["status"] == "TRABALHA")
    folgas = sum(1 for e in escalas if e["status"] == "FOLGA")
    total = len(escalas)
    
    # Busca solicitações aprovadas/rejeitadas no mês
    solic_res = (supabase.table("solicitacoes")
                 .select("status")
                 .gte("data_criacao", str(inicio_mes))
                 .execute())
    
    solics = solic_res.data
    aprovadas = sum(1 for s in solics if s["status"] == "APROVADO")
    pendentes = sum(1 for s in solics if s["status"] == "PENDENTE")

    mes_nome = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][hoje.month - 1]

    return (
        f"📈 *Relatório Mensal - {mes_nome}*\n\n"
        f"📍 *Cobertura da Equipe:*\n"
        f"  ✅ Dias trabalhados: {trabalhados}\n"
        f"  🟡 Folgas realizadas: {folgas}\n"
        f"  📊 Taxa de ocupação: {(trabalhados/total)*100:.1f}%\n\n"
        f"📍 *Gestão de Pedidos:*\n"
        f"  ✔️ Solicitções aprovadas: {aprovadas}\n"
        f"  ⏳ Ainda pendentes: {pendentes}\n\n"
        "Relatório gerado automaticamente pelo ESCALA_FÁCIL."
    )

def salvar_mensagem_direta(matricula: str, nome: str, texto: str, media_url: str = None) -> bool:
    """Salva uma mensagem de texto livre (não menu) no Supabase."""
    supabase = get_supabase()
    dados = {
        "matricula": matricula,
        "nome": nome,
        "tipo": "Mensagem Direta",
        "texto": texto,
        "media_url": media_url,
        "status": "RECEBIDO"
    }
    try:
        supabase.table("solicitacoes").insert(dados).execute()
        return True
    except Exception as e:
        print(f"❌ Erro ao salvar mensagem direta: {e}")
        return False
