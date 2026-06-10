#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# START BACKEND - Aurora DynamoDB Quest
# ═══════════════════════════════════════════════════════════════════

echo "⚔️  Iniciando Backend - Aurora DynamoDB Quest..."
echo ""

# Verificar se está no diretório correto
if [ ! -f "src/main.py" ]; then
    echo "❌ Execute este script do diretório copilot/"
    exit 1
fi

# Verificar OPENAI_API_KEY
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  OPENAI_API_KEY não configurada!"
    echo ""
    echo "Configure com:"
    echo "  export OPENAI_API_KEY='<sua-chave-openai>'"
    echo ""
    echo "Ou crie arquivo .env com:"
    echo "  OPENAI_API_KEY=<sua-chave-openai>"
    echo ""
fi

# Verificar dependências
if ! python3 -c "import fastapi" 2>/dev/null; then
    echo "⚠️  Dependências não instaladas!"
    echo "Instalando..."
    pip install -r requirements.txt
fi

# Criar diretório de dados
mkdir -p data

echo ""
echo "✅ Rodando backend em http://localhost:8080"
echo "📚 Documentação: http://localhost:8080/docs"
echo ""
echo "Pressione Ctrl+C para parar"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Rodar servidor
python3 -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8080

