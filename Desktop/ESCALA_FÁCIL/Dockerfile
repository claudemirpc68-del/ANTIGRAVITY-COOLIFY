FROM python:3.11-slim

WORKDIR /app

# Copiar subdiretório ESCALA_FÁCIL
COPY Desktop/ESCALA_FÁCIL/* .

# Instalar dependências
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir -r requirements.txt

RUN chmod -R 755 assets simulator.html

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--access-logfile", "-", "--workers", "1", "--threads", "8", "--timeout", "0", "server:app"]
