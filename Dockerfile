# Dockerfile na raiz do repositório (ESCALA_FÁCIL via Coolify)
FROM python:3.11-slim

# Diretório de trabalho padrão
WORKDIR /app

# Copia os arquivos do subdiretório específico para o container
# Note que o caminho é relativo à raiz do repositório (onde este Dockerfile está)
# Usando aspas para lidar com caracteres especiais se necessário
COPY "Desktop/ESCALA_FÁCIL/requirements.txt" .
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o projeto da pasta do Desktop
COPY "Desktop/ESCALA_FÁCIL" .

# Gera a escala
RUN python scripts/generator.py

# Expõe a porta
EXPOSE 5000

# Sobe com Gunicorn (produção)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "1", "--timeout", "120", "server:app"]
