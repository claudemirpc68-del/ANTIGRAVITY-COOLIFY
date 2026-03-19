# ============================================================
# ESCALA_FÁCIL - Dockerfile
# Deploy via Coolify
# ============================================================

FROM python:3.11-slim

# Diretório de trabalho
WORKDIR /app

# Instala dependências primeiro (cache de camadas)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o projeto
COPY . .

# Gera a escala do mês antes de subir o servidor
RUN python scripts/generator.py

# Expõe a porta
EXPOSE 5000

# Sobe com Gunicorn (produção)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "1", "--timeout", "120", "server:app"]
