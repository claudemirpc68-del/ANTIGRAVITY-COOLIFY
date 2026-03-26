import sys
import os
sys.path.append(os.getcwd())

from services.bot_service import BotService

def run_demo():
    bot = BotService()
    
    print("="*40)
    print("🚀 DEMONSTRAÇÃO PRÁTICA - ESCALA_FÁCIL")
    print("="*40)

    # TESTE 1: Colaborador (Claudemir)
    print("\n[TESTE 1] LOGIN COLABORADOR - CLAUDEMIR (7101309)")
    # 1. Identificação
    resp = bot.process_message("+55117101309", "7101309")
    print(f"Bot: {resp}")
    # 2. Consulta de Escala (Opção 1)
    resp = bot.process_message("+55117101309", "1")
    print(f"\nBot (Opção 1): {resp}")

    print("\n" + "-"*40)

    # TESTE 2: Gestor Principal (Ederson Cubas)
    print("\n[TESTE 2] LOGIN GESTOR PRINCIPAL - EDERSON CUBAS (101010)")
    # 1. Identificação (Limpando sessão anterior)
    bot.process_message("+5511888888888", "REINICIAR")
    resp = bot.process_message("+5511888888888", "101010")
    print(f"Bot: {resp}")
    # 2. Resumo da Equipe (Opção 1)
    resp = bot.process_message("+5511888888888", "1")
    print(f"\nBot (Opção 1): {resp}")

    print("\n" + "-"*40)

    # TESTE 3: Gestor Secundário (John)
    print("\n[TESTE 3] LOGIN GESTOR SECUNDÁRIO - JOHN (111111)")
    # 1. Identificação
    bot.process_message("+5511777777777", "REINICIAR")
    resp = bot.process_message("+5511777777777", "111111")
    print(f"Bot: {resp}")
    
    print("\n" + "="*40)
    print("🏁 DEMONSTRAÇÃO CONCLUÍDA")
    print("="*40)

if __name__ == "__main__":
    run_demo()
