# Dockerfile para DynamoDB Backend API
FROM python:3.11-slim

# Metadata
LABEL maintainer="Aurora Labs"
LABEL description="DynamoDB Quest Backend API - FastAPI + OpenAI"

# Configurar timezone
ENV TZ=America/Sao_Paulo
ENV PYTHONUNBUFFERED=1

# Instalar curl para healthcheck
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Criar diretório de trabalho
WORKDIR /app

# Copiar requirements primeiro (melhor cache)
COPY requirements.txt .

# Instalar dependências
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copiar apenas arquivos necessários para runtime.
# Evita incluir .env, caches, resultados de teste e arquivos locais na imagem.
COPY src ./src
COPY config.example.yaml ./config.example.yaml

# Criar diretórios necessários
RUN mkdir -p /app/data && \
    addgroup --system app && \
    adduser --system --ingroup app app && \
    chown -R app:app /app

# Expor porta da API
EXPOSE 8091

# Rodar runtime sem privilégios de root
USER app

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8091/health || exit 1

# Comando padrão: iniciar FastAPI
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8091"]

