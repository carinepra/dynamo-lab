#!/bin/bash
#
# Setup Automático - DynamoDB Lab
# Valida pré-requisitos, instala o necessário e sobe tudo
#

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  🚀 Setup Automático - DynamoDB Lab                    ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# ============================================
# 1. VERIFICAR HOMEBREW
# ============================================
echo "📦 Verificando Homebrew..."
if ! command -v brew &> /dev/null; then
    echo -e "${YELLOW}⚠️  Homebrew não encontrado. Instalando...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Adicionar ao PATH (Mac Intel vs Apple Silicon)
    if [[ $(uname -m) == "arm64" ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    else
        echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/usr/local/bin/brew shellenv)"
    fi
    echo -e "${GREEN}✅ Homebrew instalado${NC}"
else
    echo -e "${GREEN}✅ Homebrew instalado${NC}"
fi

# ============================================
# 2. VERIFICAR/INSTALAR DOCKER + COLIMA
# ============================================
echo ""
echo "🐳 Verificando Docker/Colima..."

NEEDS_COLIMA=false
NEEDS_DOCKER=false

# Verificar Colima
if ! command -v colima &> /dev/null; then
    NEEDS_COLIMA=true
fi

# Verificar Docker CLI
if ! command -v docker &> /dev/null; then
    NEEDS_DOCKER=true
fi

# Verificar Docker Compose
if ! command -v docker-compose &> /dev/null; then
    NEEDS_DOCKER=true
fi

# Instalar o que falta
if [ "$NEEDS_COLIMA" = true ] || [ "$NEEDS_DOCKER" = true ]; then
    echo -e "${YELLOW}📥 Instalando Docker/Colima...${NC}"
    if [ "$NEEDS_COLIMA" = true ]; then
        brew install colima
    fi
    if [ "$NEEDS_DOCKER" = true ]; then
        brew install docker docker-compose
    fi
    echo -e "${GREEN}✅ Docker/Colima instalado${NC}"
else
    echo -e "${GREEN}✅ Docker/Colima já instalado${NC}"
fi

# ============================================
# 3. VERIFICAR/INSTALAR PYTHON
# ============================================
echo ""
echo "🐍 Verificando Python..."
if ! command -v python3 &> /dev/null; then
    echo -e "${YELLOW}📥 Instalando Python...${NC}"
    brew install python@3.11
    echo -e "${GREEN}✅ Python instalado${NC}"
else
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✅ Python instalado: $PYTHON_VERSION${NC}"
fi

# Verificar versão mínima (3.11+)
PYTHON_MAJOR=$(python3 -c 'import sys; print(sys.version_info.major)' 2>/dev/null || echo "0")
PYTHON_MINOR=$(python3 -c 'import sys; print(sys.version_info.minor)' 2>/dev/null || echo "0")

if [ "$PYTHON_MAJOR" -lt 3 ] || ([ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -lt 11 ]); then
    echo -e "${YELLOW}⚠️  Python < 3.11 detectado. Instalando Python 3.11...${NC}"
    brew install python@3.11
    # Atualizar PATH se necessário
    if [[ $(uname -m) == "arm64" ]]; then
        export PATH="/opt/homebrew/opt/python@3.11/bin:$PATH"
    else
        export PATH="/usr/local/opt/python@3.11/bin:$PATH"
    fi
    echo -e "${GREEN}✅ Python 3.11+ instalado${NC}"
fi

# ============================================
# 3.1 VERIFICAR/INSTALAR AWS CLI
# ============================================
echo ""
echo "☁️  Verificando AWS CLI..."
if ! command -v aws &> /dev/null; then
    echo -e "${YELLOW}📥 Instalando AWS CLI...${NC}"
    brew install awscli
    echo -e "${GREEN}✅ AWS CLI instalado${NC}"
else
    echo -e "${GREEN}✅ AWS CLI instalado: $(aws --version | head -c 20)...${NC}"
fi

# ============================================
# 4. VERIFICAR MAKE
# ============================================
echo ""
echo "🔧 Verificando make..."
if ! command -v make &> /dev/null; then
    echo -e "${YELLOW}📥 Instalando make...${NC}"
    xcode-select --install 2>/dev/null || brew install make
    echo -e "${GREEN}✅ make instalado${NC}"
else
    echo -e "${GREEN}✅ make instalado${NC}"
fi

# ============================================
# 5. INICIAR COLIMA (se necessário)
# ============================================
echo ""
echo "🚀 Iniciando Docker runtime..."

if command -v colima &> /dev/null; then
    if colima status &> /dev/null; then
        echo -e "${GREEN}✅ Colima já está rodando${NC}"
    else
        echo -e "${YELLOW}⏳ Iniciando Colima (pode demorar 1-2 min)...${NC}"
        colima start --cpu 2 --memory 4 --disk 10 || {
            echo -e "${RED}❌ Erro ao iniciar Colima${NC}"
            echo "   Tente manualmente: colima start"
            exit 1
        }
        echo -e "${GREEN}✅ Colima iniciado${NC}"
    fi
else
    # Se não tem Colima, assume Docker Desktop
    if docker ps &> /dev/null; then
        echo -e "${GREEN}✅ Docker Desktop está rodando${NC}"
    else
        echo -e "${RED}❌ Docker não está rodando${NC}"
        echo "   Por favor, abra o Docker Desktop e tente novamente"
        exit 1
    fi
fi

# ============================================
# 6. VERIFICAR PORTAS ANTES DE SUBIR
# ============================================
echo ""
echo "🔌 Verificando portas necessárias..."

check_port_free() {
    PORT=$1
    NAME=$2
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Porta $PORT ($NAME) já está em uso${NC}"
        echo "   Processo: $(lsof -Pi :$PORT -sTCP:LISTEN | tail -n1)"
        echo "   💡 Para liberar: kill \$(lsof -t -i:$PORT)"
        return 1
    else
        echo -e "${GREEN}✅ Porta $PORT ($NAME) livre${NC}"
        return 0
    fi
}

PORT_CONFLICTS=0
check_port_free 17000 "DynamoDB Local" || PORT_CONFLICTS=$((PORT_CONFLICTS + 1))
check_port_free 17091 "Backend API" || PORT_CONFLICTS=$((PORT_CONFLICTS + 1))
check_port_free 17080 "Frontend" || PORT_CONFLICTS=$((PORT_CONFLICTS + 1))

if [ $PORT_CONFLICTS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  $PORT_CONFLICTS porta(s) em uso. Tentando subir mesmo assim...${NC}"
fi

# ============================================
# 7. SUBIR A STACK
# ============================================
echo ""
echo "📦 Subindo stack completa..."
docker-compose up -d || {
    echo -e "${RED}❌ Erro ao subir containers${NC}"
    echo "   Verifique os logs: docker-compose logs"
    exit 1
}

echo -e "${GREEN}✅ Stack iniciada${NC}"
echo "   Aguardando serviços inicializarem..."
sleep 5

# ============================================
# 8. VALIDAR TUDO
# ============================================
echo ""
echo "🔍 Validando ambiente..."

# Verificar containers
if ! docker ps | grep -q dynamodb-backend; then
    echo -e "${RED}❌ Backend não está rodando${NC}"
    exit 1
fi

if ! docker ps | grep -q dynamodb-frontend; then
    echo -e "${RED}❌ Frontend não está rodando${NC}"
    exit 1
fi

if ! docker ps | grep -q dynamodb-local; then
    echo -e "${RED}❌ DynamoDB Local não está rodando${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Todos os containers estão rodando${NC}"

# Aguardar inicialização
echo "   Aguardando serviços inicializarem..."
sleep 5

# Verificar portas após subir
echo ""
echo "🔌 Verificando portas após subir..."

check_port_open() {
    PORT=$1
    NAME=$2
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Porta $PORT ($NAME): Aberta${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Porta $PORT ($NAME): Não acessível${NC}"
        return 1
    fi
}

check_port_open 17000 "DynamoDB Local"
check_port_open 17091 "Backend API"
check_port_open 17080 "Frontend"

# Testar conectividade HTTP do DynamoDB
echo ""
echo "🔌 Testando conectividade DynamoDB Local..."
MAX_ATTEMPTS=5
ATTEMPT=0
DYNAMODB_CONNECTED=false

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:17000 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" = "400" ] || [ "$HTTP_CODE" = "500" ]; then
        DYNAMODB_CONNECTED=true
        break
    fi
    ATTEMPT=$((ATTEMPT + 1))
    sleep 1
done

if [ "$DYNAMODB_CONNECTED" = true ]; then
    echo -e "${GREEN}✅ DynamoDB Local acessível em http://localhost:17000${NC}"
else
    echo -e "${YELLOW}⚠️  DynamoDB ainda inicializando (normal)${NC}"
fi

# Testar health do backend
echo ""
echo "🏥 Testando Backend API..."
sleep 2
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:17091/health 2>/dev/null)
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$HEALTH_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Backend API: Funcionando (HTTP $HTTP_CODE)${NC}"
    if [ -n "$RESPONSE_BODY" ]; then
        echo "   Response: $RESPONSE_BODY"
    fi
else
    echo -e "${YELLOW}⚠️  Backend ainda inicializando (HTTP $HTTP_CODE)${NC}"
fi

# Testar endpoint /api/quiz/start
echo ""
echo "🧪 Testando endpoint /api/quiz/start..."
START_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:17091/api/quiz/start \
    -H "Content-Type: application/json" \
    -d '{"player_name":"Teste","language":"python","lab":"lab1"}' 2>/dev/null)
START_HTTP_CODE=$(echo "$START_RESPONSE" | tail -n1)

if [ "$START_HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Endpoint /api/quiz/start: Funcionando${NC}"
else
    echo -e "${YELLOW}⚠️  Endpoint /api/quiz/start: HTTP $START_HTTP_CODE (pode ser normal se backend ainda inicializando)${NC}"
fi

# Testar frontend
echo ""
echo "🌐 Testando Frontend..."
FRONTEND_RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:17080 2>/dev/null)
FRONTEND_HTTP_CODE=$(echo "$FRONTEND_RESPONSE" | tail -n1)

if [ "$FRONTEND_HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Frontend: Acessível em http://localhost:17080${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend: HTTP $FRONTEND_HTTP_CODE (pode estar inicializando)${NC}"
fi

# ============================================
# 9. PARAR CONTAINERS (setup completo, não deixar rodando)
# ============================================
echo ""
echo "🛑 Parando containers (setup concluído)..."
docker-compose down
echo -e "${GREEN}✅ Containers parados${NC}"

# ============================================
# 10. RESUMO
# ============================================
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  ✅ Setup Concluído!                                   ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}🌐 URLs:${NC}"
echo "   Frontend:  http://localhost:17080"
echo "   Backend:   http://localhost:17091"
echo "   API Docs:  http://localhost:17091/docs"
echo "   DynamoDB:  http://localhost:17000"
echo ""
echo -e "${GREEN}📋 Próximos passos:${NC}"
echo "   make start        # ligar tudo e começar a usar"
echo "   make lab-setup LAB=lab2    # preparar Lab 2 (criar tabela + dados)"
echo ""
echo -e "${BLUE}💡 Setup concluído! Use 'make start' quando quiser começar.${NC}"
echo ""

