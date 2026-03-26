"""
ESCALA_FÁCIL - Generator
Gerador de escala 6x1 com 2 domingos de folga por mês para cada colaborador.
"""

import json
import calendar
from datetime import date

# -----------------------------------------------------------------------
# Configurações
# -----------------------------------------------------------------------
ANO = date.today().year
MES = date.today().month
DOMINGOS_FOLGA_POR_MES = 2

# -----------------------------------------------------------------------
# Utilitários
# -----------------------------------------------------------------------

def carregar_colaboradores(caminho: str) -> list:
    """Lê o arquivo JSON de colaboradores."""
    with open(caminho, encoding="utf-8") as f:
        dados = json.load(f)
    return dados["colaboradores"]


def dias_do_mes(ano: int, mes: int) -> list:
    """Retorna lista de objetos date para cada dia do mês."""
    qtd_dias = calendar.monthrange(ano, mes)[1]
    return [date(ano, mes, d) for d in range(1, qtd_dias + 1)]


def domingos_do_mes(dias: list) -> list:
    """Filtra apenas os domingos de uma lista de datas (weekday() == 6)."""
    return [d for d in dias if d.weekday() == 6]


# -----------------------------------------------------------------------
# Geração da Escala 6x1
# -----------------------------------------------------------------------

def gerar_escala(colaboradores: list, ano: int, mes: int) -> dict:
    """
    Gera a escala mensal no padrão 6x1.
    - Cada colaborador trabalha 6 dias e folga 1, de forma cíclica.
    - Cada colaborador tem exatamente 2 domingos de folga no mês.
    - Os domingos de folga são distribuídos de forma rotativa (equitativa).
    """
    dias = dias_do_mes(ano, mes)
    domingos = domingos_do_mes(dias)

    # Mapa inicial: qual domingo de folga cada colaborador recebe
    # Distribui de forma rotativa entre todos os colaboradores
    domingo_folga_map: dict[str, list] = {c["matricula"]: [] for c in colaboradores}

    total_colaboradores = len(colaboradores)
    for idx_domingo, domingo in enumerate(domingos):
        # Seleciona 'n_folgas' colaboradores para folgar nesse domingo, de forma rotativa
        # Divide os colaboradores em grupos por domingo, rotacionando a cada mês
        for offset in range(total_colaboradores // len(domingos) if len(domingos) > 0 else 1):
            idx_colab = (idx_domingo + offset * len(domingos)) % total_colaboradores
            matricula = colaboradores[idx_colab]["matricula"]
            if len(domingo_folga_map[matricula]) < DOMINGOS_FOLGA_POR_MES:
                domingo_folga_map[matricula].append(str(domingo))

    # Garante que todos tenham exatamente 2 domingos de folga
    # Para colaboradores com menos de 2, atribuímos domingos disponíveis
    for colaborador in colaboradores:
        mat = colaborador["matricula"]
        folgas_atuais = domingo_folga_map[mat]
        if len(folgas_atuais) < DOMINGOS_FOLGA_POR_MES:
            for domingo in domingos:
                domingo_str = str(domingo)
                if domingo_str not in folgas_atuais:
                    folgas_atuais.append(domingo_str)
                if len(folgas_atuais) >= DOMINGOS_FOLGA_POR_MES:
                    break

    # Agora gera a escala 6x1 dia a dia
    escala_final = {}

    for colaborador in colaboradores:
        mat = colaborador["matricula"]
        domingos_de_folga = set(domingo_folga_map[mat])

        escala_colaborador = []
        contador_trabalho = 0  # Conta dias consecutivos de trabalho

        for dia in dias:
            dia_str = str(dia)
            dia_semana_pt = traduzir_dia(dia.weekday())

            # É domingo de folga?
            if dia.weekday() == 6 and dia_str in domingos_de_folga:
                escala_colaborador.append({
                    "data": dia_str,
                    "dia_semana": dia_semana_pt,
                    "status": "FOLGA",
                    "tipo_folga": "Domingo"
                })
                contador_trabalho = 0
                continue

            # Regra 6x1: se chegou a 6 dias de trabalho seguidos, deve folgar
            if contador_trabalho >= 6:
                escala_colaborador.append({
                    "data": dia_str,
                    "dia_semana": dia_semana_pt,
                    "status": "FOLGA",
                    "tipo_folga": "Regular (6x1)"
                })
                contador_trabalho = 0
            else:
                escala_colaborador.append({
                    "data": dia_str,
                    "dia_semana": dia_semana_pt,
                    "status": "TRABALHA",
                    "entrada": colaborador["horario"]
                })
                contador_trabalho += 1

        escala_final[mat] = {
            "nome": colaborador["nome"],
            "funcao": colaborador["funcao"],
            "horario_padrao": colaborador["horario"],
            "domingos_folga": sorted(list(domingos_de_folga)),
            "dias": escala_colaborador
        }

    return escala_final


def traduzir_dia(weekday: int) -> str:
    """Traduz o número do dia da semana para português."""
    dias_pt = {
        0: "Segunda-feira",
        1: "Terça-feira",
        2: "Quarta-feira",
        3: "Quinta-feira",
        4: "Sexta-feira",
        5: "Sábado",
        6: "Domingo",
    }
    return dias_pt.get(weekday, "")


# -----------------------------------------------------------------------
# Execução Principal
# -----------------------------------------------------------------------

if __name__ == "__main__":
    import os

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    caminho_colaboradores = os.path.join(base_dir, "skill_config", "colaboradores.json")
    caminho_saida = os.path.join(base_dir, "skill_config", "escala_gerada.json")

    print(f"[GERANDO] Escala para {MES:02d}/{ANO}...")
    colaboradores = carregar_colaboradores(caminho_colaboradores)
    print(f"[INFO] Total de colaboradores: {len(colaboradores)}")

    escala = gerar_escala(colaboradores, ANO, MES)

    with open(caminho_saida, "w", encoding="utf-8") as f:
        json.dump({"mes_referencia": f"{ANO}-{MES:02d}", "escala": escala}, f, ensure_ascii=False, indent=2)

    print(f"[OK] Escala gerada com sucesso! Arquivo salvo em: {caminho_saida}")

    # Resumo
    for mat, info in list(escala.items())[:3]:  # Mostra os 3 primeiros
        folgas_domingo = info["domingos_folga"]
        total_folgas = sum(1 for d in info["dias"] if d["status"] == "FOLGA")
        print(f"  -> {info['nome']} | Domingos: {folgas_domingo} | Total folgas: {total_folgas}")
