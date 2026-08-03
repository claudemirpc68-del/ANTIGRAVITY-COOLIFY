class StudyPlanManager:
    """
    Gerenciador do Plano de Estudos em 6 Semanas do TutorML para Iniciantes.
    """
    def __init__(self):
        self.weeks = [
            {
                "week": 1,
                "topic": "Fundamentos de Dados e Estatística",
                "summary": "Introdução ao universo dos dados, média, mediana, desvio padrão, correlação e preparação de dados em Python com Pandas e NumPy.",
                "low_code_tool": "Pandas Profiling / Orange Data Mining",
                "quiz": [
                    {
                        "question": "O que a mediana representa em um conjunto de dados?",
                        "options": [
                            "A média aritmética de todos os números",
                            "O valor exatamente no meio quando os dados estão ordenados",
                            "O valor que mais se repete",
                            "A diferença entre o maior e o menor valor"
                        ],
                        "correct": 1,
                        "explanation": "A mediana é a medida de tendência central que divide os dados exatamente ao meio após a ordenação, sendo robusta a outliers."
                    },
                    {
                        "question": "Para que serve a técnica de One-Hot Encoding em Machine Learning?",
                        "options": [
                            "Para transformar dados categóricos em colunas numéricas binárias",
                            "Para remover linhas com valores nulos",
                            "Para diminuir o tamanho dos arquivos de imagem",
                            "Para calcular a precisão de um modelo de regressão"
                        ],
                        "correct": 0,
                        "explanation": "One-Hot Encoding converte variáveis categóricas (como 'vermelho', 'azul') em colunas binárias (0 ou 1) para que os algoritmos de ML possam processá-las."
                    }
                ],
                "mini_project": {
                    "title": "Análise Exploratória do Dataset Titanic",
                    "goal": "Limpar o conjunto de dados, tratar valores nulos e calcular estatísticas descritivas das taxas de sobrevivência.",
                    "colab_snippet": """# [Colab] Semana 1: Análise Exploratória Rápida com Pandas
import pandas as pd

# Carregar dataset
url = "https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv"
df = pd.read_csv(url)

print("--- Primeiras Linhas ---")
print(df.head())

print("\\n--- Resumo Estatístico ---")
print(df.describe())

print("\\n--- Taxa de Sobrevivência por Gênero ---")
print(df.groupby('Sex')['Survived'].mean())
"""
                }
            },
            {
                "week": 2,
                "topic": "Aprendizado Supervisionado (Regressão e Classificação)",
                "summary": "Aprenda a prever rótulos contínuos (Regressão Linear) e categorias (Regressão Logística, Árvores de Decisão) com validação treino/teste.",
                "low_code_tool": "Scikit-Learn Pipelines / PyCaret Classification",
                "quiz": [
                    {
                        "question": "Qual é a principal diferença entre Classificação e Regressão?",
                        "options": [
                            "Classificação prevê valores numéricos contínuos; Regressão prevê categorias",
                            "Classificação prevê rótulos categóricos; Regressão prevê números contínuos",
                            "Não há diferença, ambas fazem o mesmo cálculo",
                            "Regressão só funciona com aprendizado não supervisionado"
                        ],
                        "correct": 1,
                        "explanation": "Classificação prevê categorias (ex: Span ou Não-Spam), enquanto Regressão prevê valores numéricos contínuos (ex: preço de um imóvel)."
                    }
                ],
                "mini_project": {
                    "title": "Previsão de Preços de Casas com Regressão Linear",
                    "goal": "Construir um modelo supervisionado simples para estimar o valor de imóveis.",
                    "colab_snippet": """# [Colab] Semana 2: Classificação Simples com Scikit-Learn
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

# Carregar dados
X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Treinar modelo de Árvore de Decisão
model = DecisionTreeClassifier()
model.fit(X_train, y_train)

# Avaliar
predictions = model.predict(X_test)
print(f"Acurácia do Modelo: {accuracy_score(y_test, predictions) * 100:.2f}%")
"""
                }
            },
            {
                "week": 3,
                "topic": "Aprendizado Não Supervisionado (Clustering e PCA)",
                "summary": "Agrupamento de dados com K-Means, detecção de padrões ocultos e redução de dimensionalidade para visualização.",
                "low_code_tool": "K-Means visual no Orange / Scikit-Learn KMeans",
                "quiz": [
                    {
                        "question": "O que caracteriza o Aprendizado Não Supervisionado?",
                        "options": [
                            "Os dados de treino possuem rótulos e respostas conhecidas",
                            "Os dados NÃO possuem rótulos; o algoritmo busca padrões por conta própria",
                            "Não necessita de computador para treinar",
                            "É usado apenas para prever vendas no futuro"
                        ],
                        "correct": 1,
                        "explanation": "No aprendizado não supervisionado, o algoritmo encontra estruturas e agrupamentos (clusters) nos dados sem ter rótulos prévios."
                    }
                ],
                "mini_project": {
                    "title": "Segmentação de Clientes com K-Means",
                    "goal": "Agrupar perfil de consumidores por hábitos de compras em 3 grupos principais.",
                    "colab_snippet": """# [Colab] Semana 3: Clustering de Dados com K-Means
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
import matplotlib.pyplot as plt

# Criar dados sintéticos de clientes
X, _ = make_blobs(n_samples=300, centers=3, cluster_std=0.6, random_state=42)

# Aplicar K-Means
kmeans = KMeans(n_clusters=3, random_state=42)
labels = kmeans.fit_predict(X)

print("Centróides dos Grupos:")
print(kmeans.cluster_centers_)
"""
                }
            },
            {
                "week": 4,
                "topic": "Redes Neurais e Deep Learning",
                "summary": "Fundamentos de neurônios artificiais, funções de ativação (ReLU, Sigmoid), Perceptron Multicamadas (MLP) e introdução ao TensorFlow/Keras.",
                "low_code_tool": "Keras Sequential API / Teachable Machine (Google)",
                "quiz": [
                    {
                        "question": "Para que serve a Função de Ativação em uma Rede Neural?",
                        "options": [
                            "Para desligar o computador após o treinamento",
                            "Para introduzir não-linearidade e permitir aprender padrões complexos",
                            "Para converter imagens em arquivos de áudio",
                            "Para salvar os pesos no disco rígido"
                        ],
                        "correct": 1,
                        "explanation": "Sem funções de ativação não-lineares (como ReLU), uma rede neural profunda seria equivalente a uma simples combinação linear."
                    }
                ],
                "mini_project": {
                    "title": "Classificação de Dígitos Escritos à Mão (MNIST)",
                    "goal": "Treinar uma Rede Neural Simples (MLP) com Keras para reconhecer números de 0 a 9.",
                    "colab_snippet": """# [Colab] Semana 4: Rede Neural Simples com Keras
import tensorflow as tf
from tensorflow.keras import layers, models

# Carregar dataset MNIST
mnist = tf.keras.datasets.mnist
(X_train, y_train), (X_test, y_test) = mnist.load_data()
X_train, X_test = X_train / 255.0, X_test / 255.0

# Construir arquitetura da rede
model = models.Sequential([
    layers.Flatten(input_shape=(28, 28)),
    layers.Dense(128, activation='relu'),
    layers.Dense(10, activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
model.fit(X_train, y_train, epochs=2, validation_split=0.1)
"""
                }
            },
            {
                "week": 5,
                "topic": "NLP (Processamento de Linguagem Natural) e Visão Computacional",
                "summary": "Processamento de texto (Tokenização, Bag of Words, Embeddings) e introdução ao reconhecimento de imagens com Redes Convolucionais (CNNs).",
                "low_code_tool": "Hugging Face Pipeline / Teachable Machine",
                "quiz": [
                    {
                        "question": "O que é Tokenização no contexto de NLP?",
                        "options": [
                            "A compra de moedas virtuais para pagar servidores de IA",
                            "O processo de divisão de um texto em unidades menores (palavras ou subpalavras)",
                            "A conversão de imagens coloridas em preto e branco",
                            "A exclusão de arquivos duplicados no banco de dados"
                        ],
                        "correct": 1,
                        "explanation": "Tokenização quebra o texto bruto em tokens (palavras ou termos), etapa fundamental para que os modelos de NLP consigam interpretar frases."
                    }
                ],
                "mini_project": {
                    "title": "Análise de Sentimentos em Avaliações de Produtos",
                    "goal": "Utilizar Hugging Face Pipelines para classificar frases como Positivas ou Negativas.",
                    "colab_snippet": """# [Colab] Semana 5: Análise de Sentimentos em 3 linhas com Hugging Face
from transformers import pipeline

# Criar classificador de sentimentos
classifier = pipeline("sentiment-analysis")

frase = "Este curso de Machine Learning é extremamente didático e prático!"
resultado = classifier(frase)

print(f"Frase: '{frase}'")
print(f"Resultado: {resultado}")
"""
                }
            },
            {
                "week": 6,
                "topic": "MLOps, Métricas de Produção e Aplicações Reais",
                "summary": "Implantação de modelos (Deploy com Gradio/Streamlit), métricas de desempenho (Matriz de Confusão, F1-Score, RMSE) e boas práticas de monitoramento.",
                "low_code_tool": "Gradio UI / Streamlit / MLflow",
                "quiz": [
                    {
                        "question": "O que significa o termo MLOps?",
                        "options": [
                            "Machine Learning Operations: práticas para colocar e manter modelos de ML em produção com segurança",
                            "Multi-Layer Options: configuração avançada de placas de vídeo",
                            "Apenas um novo tipo de algoritmo de regressão",
                            "Um software pago para substituir o Python"
                        ],
                        "correct": 0,
                        "explanation": "MLOps combina Machine Learning, DevOps e Engenharia de Dados para automatizar e monitorar o ciclo de vida dos modelos na prática."
                    }
                ],
                "mini_project": {
                    "title": "Criando uma Interface Web com Gradio para o seu Modelo",
                    "goal": "Construir um app interativo em poucas linhas para permitir que qualquer usuário teste seu modelo de IA.",
                    "colab_snippet": """# [Colab] Semana 6: Deploy de Modelo com Gradio
import gradio as gr

def predicao_simples(horas_estudo):
    # Regra intuitiva simulando predição de nota
    nota_estimada = min(10.0, horas_estudo * 1.5 + 2.0)
    return f"Nota Estimada: {nota_estimada:.1f} / 10.0"

demo = gr.Interface(
    fn=predicao_simples,
    inputs=gr.Number(label="Horas de Estudo por Semana"),
    outputs="text",
    title="TutorML App: Previsor de Desempenho"
)

demo.launch(share=True)
"""
                }
            }
        ]

    def get_all_weeks(self):
        return self.weeks

    def get_week_details(self, week_number: int):
        for w in self.weeks:
            if w["week"] == week_number:
                return w
        return None
