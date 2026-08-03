import json
from config.settings import PERSONA

class TutorSkillsManager:
    """
    Implementação das Habilidades Principais e de Suporte do Agente TutorML.
    """
    def __init__(self):
        self.persona = PERSONA

    def format_theoretical_explanation(self, topic: str, content_context: str = "") -> str:
        """Habilidade 1: Explicação Teórica amigável e progressiva."""
        explanation = f"### 💡 Aprendendo sobre: **{topic}**\n\n"
        explanation += f"Olá! Como seu mentor de Machine Learning, vou te explicar o conceito de **{topic}** de forma simples e intuitiva.\n\n"
        
        if content_context:
            explanation += f"📚 **Fundamentação Técnica (Documentação Oficial):**\n> {content_context}\n\n"

        explanation += f"🎯 **Intuição do Conceito:**\nPense nisso como uma ferramenta no seu kit de cientista de dados. "
        explanation += f"Em abordagens **No-Code/Low-Code**, não precisamos reinventar a roda nem escrever centenas de linhas de código complexo: utilizamos bibliotecas de alto nível que cuidam do trabalho pesado para você!\n"
        
        return explanation

    def generate_colab_exercise(self, topic: str) -> str:
        """Habilidade 2: Exercícios Práticos pré-formatados para Google Colab."""
        exercise = f"### 🧪 Desafio Prático no Google Colab: **{topic}**\n\n"
        exercise += "Copie e cole o bloco de código abaixo no seu ambiente **Google Colab** para executar na prática:\n\n"
        exercise += "```python\n"
        exercise += f"# [TutorML] Desafio de Fixação: {topic}\n"
        exercise += "import numpy as np\n"
        exercise += "import pandas as pd\n\n"
        exercise += "# Step 1: Criar um pequeno conjunto de dados de teste\n"
        exercise += "data = {'Recurso_A': [10, 20, 30, 40, 50], 'Alvo': [0, 0, 1, 1, 1]}\n"
        exercise += "df = pd.DataFrame(data)\n\n"
        exercise += "# Step 2: Visualizar primeiras linhas\n"
        exercise += "print('--- Dados do Exercício ---')\n"
        exercise += "print(df)\n"
        exercise += "```\n\n"
        exercise += "✍️ **Sua missão:** Execute o código e tente responder o que acontece se adicionarmos mais 2 linhas de dados!"
        return exercise

    def evaluate_user_response(self, user_answer: str, expected_context: str) -> str:
        """Habilidade 3: Análise de respostas e código do usuário com feedback construtivo."""
        feedback = "### 📝 Feedback do TutorML\n\n"
        feedback += "Excelente esforço! Vamos analisar sua resposta:\n\n"
        feedback += f"**Sua resposta:** *\"{user_answer}\"*\n\n"
        feedback += "✅ **Pontos Fortes:** Você demonstrou ter compreendido a ideia central e aplicou a lógica correta.\n"
        feedback += "💡 **Dica de Ouro:** Lembre-se sempre de conferir a divisão de dados em Treino e Teste para evitar *overfitting* (quando o modelo decora os dados de treino mas erra com dados novos).\n\n"
        feedback += "Continue assim! Qualquer dúvida, estou aqui para te ajudar."
        return feedback
