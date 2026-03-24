FROM python:3.11-slim

WORKDIR /app

# Instalar dependências de sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Copiar apenas os requisitos primeiro para cache de camada
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo o código do repositório para o container
COPY . .

# Garantir permissões de leitura para os assets
RUN chmod -R 755 assets simulator.html

# Expor a porta 5000 (padrão do Coolify para este projeto)
EXPOSE 5000

# Comando para rodar o Gunicorn na porta 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--access-logfile", "-", "--workers", "1", "--threads", "8", "--timeout", "0", "server:app"]
