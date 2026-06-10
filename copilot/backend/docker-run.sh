#!/bin/bash
# Helper script para rodar o copilot no Docker
# USO: ./docker-run.sh [comando]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}🎮 =============================================${NC}"
echo -e "${BLUE}   DYNAMODB COPILOT - DOCKER MODE${NC}"
echo -e "${BLUE}🎮 =============================================${NC}"
echo ""

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env não encontrado, criando do template...${NC}"
    cp env.example .env
    echo -e "${GREEN}✅ .env criado${NC}"
    echo ""
    echo -e "${YELLOW}📝 IMPORTANTE: Edite o .env e configure a OPENAI_API_KEY${NC}"
    echo -e "${YELLOW}   $ nano .env${NC}"
    echo ""
fi

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker não está rodando!${NC}"
    echo -e "   Inicie o Docker Desktop e tente novamente."
    exit 1
fi

# Voltar para o root (onde está o docker-compose.yml)
cd ..

# Se não passou comando, mostrar ajuda
if [ $# -eq 0 ]; then
    echo -e "${BLUE}📋 Comandos disponíveis:${NC}"
    echo ""
    echo -e "  ${GREEN}test${NC}        - Rodar testes do validator"
    echo -e "  ${GREEN}quiz${NC}        - Iniciar quiz (quando implementado)"
    echo -e "  ${GREEN}encrypt${NC}     - Criptografar gabaritos (instrutor)"
    echo -e "  ${GREEN}genkey${NC}      - Gerar chave de criptografia (instrutor)"
    echo -e "  ${GREEN}shell${NC}       - Abrir shell no container"
    echo -e "  ${GREEN}build${NC}       - Rebuild da imagem Docker"
    echo ""
    echo -e "${BLUE}📖 Exemplos:${NC}"
    echo -e "  $ ./docker-run.sh test"
    echo -e "  $ ./docker-run.sh shell"
    echo ""
    exit 0
fi

# Comandos
case "$1" in
    test)
        echo -e "${GREEN}🧪 Rodando testes do validator...${NC}"
        echo ""
        docker-compose run --rm copilot python3 test_validator.py
        ;;
    
    quiz)
        echo -e "${GREEN}🎮 Iniciando quiz...${NC}"
        echo ""
        docker-compose run --rm copilot python3 src/main.py quiz --name "${2:-Participante}"
        ;;
    
    encrypt)
        echo -e "${GREEN}🔐 Criptografando gabaritos...${NC}"
        echo ""
        docker-compose run --rm copilot python3 scripts/encrypt_gabaritos.py
        ;;
    
    genkey)
        echo -e "${GREEN}🔑 Gerando chave de criptografia...${NC}"
        echo ""
        docker-compose run --rm copilot python3 scripts/generate_key.py
        ;;
    
    shell|bash|sh)
        echo -e "${GREEN}🐚 Abrindo shell no container...${NC}"
        echo ""
        docker-compose run --rm copilot /bin/bash
        ;;
    
    build)
        echo -e "${GREEN}🔨 Rebuilding imagem Docker...${NC}"
        echo ""
        docker-compose build copilot
        echo ""
        echo -e "${GREEN}✅ Build completo!${NC}"
        ;;
    
    *)
        echo -e "${RED}❌ Comando desconhecido: $1${NC}"
        echo ""
        echo -e "Execute ${GREEN}./docker-run.sh${NC} sem argumentos para ver comandos disponíveis."
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Concluído!${NC}"

