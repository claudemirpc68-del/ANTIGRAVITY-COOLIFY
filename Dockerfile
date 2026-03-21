FROM python:3.11-slim

WORKDIR /app

# Instalar dependências de sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Copiar requisitos e instalar
COPY "Desktop/ESCALA_FÁCIL/requirements.txt" .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar o código do projeto para /app
COPY "Desktop/ESCALA_FÁCIL" .

# Garantir que o simulator.html esteja acessível
RUN ls -la /app

# Expor a porta 5000
EXPOSE 5000

# Comando para rodar o Gunicorn na porta 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "1", "--threads", "8", "--timeout", "0", "server:app"]
