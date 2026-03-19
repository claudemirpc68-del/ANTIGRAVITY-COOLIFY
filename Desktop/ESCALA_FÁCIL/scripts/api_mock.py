"""
ESCALA_FÁCIL - Mock API
Interface de consulta de escala por matrícula para o AssaiBot.
Simula as intents do bot: consulta de escala, próxima folga e domingos de folga.
"""

import json
import os
from datetime import date, timedelta


# -----------------------------------------------------------------------
# Carregamento de Dados
# -----------------------------------------------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ESCALA_PATH = os.path.join(BASE_DIR, "skill_config", "escala_gerada.json")
COLABORADORES_PATH = os.path.join(BASE_DIR, "skill_config", "colaboradores.json")
GESTORES = {"101010", "101011", "101012", "101013"}
GESTORES_NOMES = {
    "101010": "Anderson Cubas",
    "101011": "John",
    "101012": "Antonio",
    "101013": "Leonardo",
}


def _carregar_escala() -> dict:
    if not os.path.exists(ESCALA_PATH):
        raise FileNotFoundError(
            "❌ Arquivo de escala não encontrado. Execute 'generator.py' primeiro."
        )
    with open(ESCALA_PATH, encoding="utf-8") as f:
        return json.load(f)


def _carregar_colaboradores() -> list:
    with open(COLABORADORES_PATH, encoding="utf-8") as f:
        return json.load(f)["colaboradores"]


# -----------------------------------------------------------------------
# Funções de Identificação
# -----------------------------------------------------------------------

def identificar_usuario(matricula: str) -> dict:
    """
    Identifica o usuário pela matrícula.
    Retorna: { "tipo": "gestor" | "colaborador" | "nao_encontrado", "nome": str }
    """
    if matricula in GESTORES:
        return {"tipo": "gestor", "nome": GESTORES_NOMES[matricula]}

    colaboradores = _carregar_colaboradores()
    for c in colaboradores:
        if c["matricula"] == matricula:
            return {"tipo": "colaborador", "nome": c["nome"], "funcao": c["funcao"]}

    return {"tipo": "nao_encontrado", "nome": ""}


# -----------------------------------------------------------------------
# Intents de Colaborador
# -----------------------------------------------------------------------

def get_escala_semanal(matricula: str) -> str:
    """Intent: consultar_escala_semanal - Retorna os dias de trabalho da semana atual."""
    dados = _carregar_escala()
    escala = dados["escala"]

    if matricula not in escala:
        return "❌ Matrícula não encontrada. Verifique o número informado."

    info = escala[matricula]
    hoje = date.today()
    # Encontra o início (segunda) e fim (domingo) da semana atual
    inicio_semana = hoje - timedelta(days=hoje.weekday())
    fim_semana = inicio_semana + timedelta(days=6)

    dias_semana = [
        d for d in info["dias"]
        if inicio_semana <= date.fromisoformat(d["data"]) <= fim_semana
    ]

    if not dias_semana:
        return "⚠️ Nenhuma informação de escala encontrada para a semana atual."

    linhas = [f"📅 *Escala desta semana - {info['nome']}*\n"]
    for dia in dias_semana:
        emoji = "✅" if dia["status"] == "TRABALHA" else "🟡"
        if dia["status"] == "TRABALHA":
            linha = f"  {emoji} {dia['dia_semana']} ({dia['data']}): TRABALHA às {dia.get('entrada','')}"
        else:
            linha = f"  {emoji} {dia['dia_semana']} ({dia['data']}): FOLGA ({dia.get('tipo_folga','')})"
        linhas.append(linha)

    linhas.append(
        "\n⚠️ _Atenção: esta escala é programada, mas o gestor tem a última palavra e pode alterar em caso de necessidade operacional._"
    )
    return "\n".join(linhas)


def get_proxima_folga(matricula: str) -> str:
    """Intent: consultar_proxima_folga - Retorna a data da próxima folga."""
    dados = _carregar_escala()
    escala = dados["escala"]

    if matricula not in escala:
        return "❌ Matrícula não encontrada."

    info = escala[matricula]
    hoje = date.today()

    for dia in info["dias"]:
        d = date.fromisoformat(dia["data"])
        if d >= hoje and dia["status"] == "FOLGA":
            return (
                f"📆 *{info['nome']}*, sua próxima folga está prevista para "
                f"*{dia['dia_semana']}, {dia['data']}* ({dia.get('tipo_folga', '')}).\n\n"
                "⚠️ _O gestor tem a última palavra e pode alterar em caso de necessidade operacional._"
            )

    return "⚠️ Não foi encontrada uma próxima folga no calendário atual."


def get_domingos_folga(matricula: str) -> str:
    """Intent: consultar_domingos_folga - Lista os 2 domingos de folga do mês."""
    dados = _carregar_escala()
    escala = dados["escala"]

    if matricula not in escala:
        return "❌ Matrícula não encontrada."

    info = escala[matricula]
    domingos = info.get("domingos_folga", [])

    if not domingos:
        return "⚠️ Nenhum domingo de folga registrado para este mês."

    datas_formatadas = " e ".join(domingos)
    return (
        f"🗓️ *{info['nome']}*, neste mês você tem *{len(domingos)} domingo(s) de folga*:\n"
        f"  → {datas_formatadas}\n\n"
        "⚠️ _O gestor tem a última palavra e pode alterar em caso de necessidade operacional._"
    )


# -----------------------------------------------------------------------
# Intents de Gestor
# -----------------------------------------------------------------------

def get_resumo_equipe() -> str:
    """Retorna um resumo da equipe para o gestor."""
    dados = _carregar_escala()
    escala = dados["escala"]
    total = len(escala)
    hoje = date.today()
    hoje_str = str(hoje)

    trabalhando = sum(
        1 for info in escala.values()
        for d in info["dias"]
        if d["data"] == hoje_str and d["status"] == "TRABALHA"
    )
    de_folga = sum(
        1 for info in escala.values()
        for d in info["dias"]
        if d["data"] == hoje_str and d["status"] == "FOLGA"
    )

    return (
        f"📊 *Resumo da Equipe - {hoje_str}*\n"
        f"  👥 Total de colaboradores: {total}\n"
        f"  ✅ Trabalhando hoje: {trabalhando}\n"
        f"  🟡 De folga hoje: {de_folga}\n"
        f"  📅 Mês de referência: {dados['mes_referencia']}"
    )


# -----------------------------------------------------------------------
# Execução como linha de comando (demonstração)
# -----------------------------------------------------------------------

if __name__ == "__main__":
    print("=" * 60)
    print("  ESCALA_FACIL - Mock API (Modo Demonstracao)")
    print("=" * 60)

    test_matriculas = ["5741181", "7101309", "101010"]

    for mat in test_matriculas:
        usuario = identificar_usuario(mat)
        print(f"\n--- Matricula: {mat} ---")
        print(f"Tipo: {usuario['tipo']} | Nome: {usuario['nome']}")

        if usuario["tipo"] == "colaborador":
            print("\n-> Proxima Folga:")
            resultado = get_proxima_folga(mat)
            # Remove emojis para exibicao no terminal Windows
            resultado_limpo = resultado.encode("ascii", "ignore").decode("ascii")
            print(resultado_limpo)
            print("\n-> Domingos de Folga do Mes:")
            resultado2 = get_domingos_folga(mat)
            resultado2_limpo = resultado2.encode("ascii", "ignore").decode("ascii")
            print(resultado2_limpo)

        elif usuario["tipo"] == "gestor":
            print("\n-> Resumo da Equipe:")
            resultado = get_resumo_equipe()
            resultado_limpo = resultado.encode("ascii", "ignore").decode("ascii")
            print(resultado_limpo)
