"""
⚔️ Aurora DynamoDB Quest - Backend API
FastAPI + OpenAI + DynamoDB Local
"""
from dotenv import load_dotenv
load_dotenv()  # Carregar .env antes de qualquer import

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api import quiz_routes
from contextlib import asynccontextmanager
import logging
import os

# Configurar logger
logger = logging.getLogger(__name__)

# Recursos globais que precisam ser limpos
_resources = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gerencia lifecycle da aplicação (startup/shutdown)"""
    # Startup
    logger.info("🚀 Iniciando backend...")
    _resources['startup_time'] = None
    
    yield  # Aplicação rodando
    
    # Shutdown - limpar recursos
    logger.info("🛑 Encerrando backend e limpando recursos...")
    # Forçar garbage collection de recursos boto3/sqlite
    import gc
    gc.collect()
    logger.info("✅ Recursos limpos")


app = FastAPI(
    title="⚔️ DynamoDB Quest API",
    description="Sistema de quiz gamificado com validação determinística de questões fechadas",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan  # Adicionar gerenciamento de lifecycle
)

def get_cors_origins() -> list[str]:
    origins = os.getenv("CORS_ORIGINS")
    if origins:
        return [origin.strip() for origin in origins.split(",") if origin.strip()]
    
    return [
        "http://localhost:17080",  # Docker frontend
        "http://localhost:3010",   # Python simple server
        "http://127.0.0.1:17080",
        "http://127.0.0.1:3010",
    ]


# CORS - permitir frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas
app.include_router(quiz_routes.router, prefix="/api/quiz", tags=["quiz"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "⚔️ Aurora DynamoDB Quest",
        "status": "🟢 online",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health")
async def health():
    """Health check"""
    return {
        "status": "ok",
        "service": "dynamodb-quiz-api",
        "version": "1.0.0"
    }


@app.get("/ping")
async def ping():
    """Simple ping endpoint"""
    return {"message": "pong"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8091,
        reload=True,
        log_level="info"
    )

