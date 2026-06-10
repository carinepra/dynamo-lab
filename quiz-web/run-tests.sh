#!/bin/bash

# Script para rodar testes com timeout e feedback visual
# Uso: ./run-tests.sh [unit|e2e|all]

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Timeout padrão (5 minutos)
TIMEOUT=300

# Função para rodar comando com timeout
run_with_timeout() {
    local cmd=$1
    local name=$2
    local timeout=$3
    
    echo -e "${BLUE}⏱️  Iniciando: $name${NC}"
    echo -e "${YELLOW}   Timeout: ${timeout}s${NC}"
    echo ""
    
    # Rodar comando em background
    timeout $timeout bash -c "$cmd" &
    local pid=$!
    
    # Mostrar progresso
    local elapsed=0
    while kill -0 $pid 2>/dev/null; do
        sleep 1
        elapsed=$((elapsed + 1))
        
        # Mostrar ponto a cada segundo
        if [ $((elapsed % 5)) -eq 0 ]; then
            echo -ne "${YELLOW}.${NC}"
        fi
        
        # Avisar quando estiver demorando
        if [ $elapsed -eq 30 ]; then
            echo -e "\n${YELLOW}⚠️  Já se passaram 30 segundos...${NC}"
        fi
        if [ $elapsed -eq 60 ]; then
            echo -e "\n${YELLOW}⚠️  Já se passou 1 minuto...${NC}"
        fi
        if [ $elapsed -eq 120 ]; then
            echo -e "\n${YELLOW}⚠️  Já se passaram 2 minutos...${NC}"
        fi
    done
    
    # Verificar resultado
    wait $pid
    local exit_code=$?
    
    echo ""
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✅ $name: SUCESSO (${elapsed}s)${NC}"
        return 0
    elif [ $exit_code -eq 124 ]; then
        echo -e "${RED}⏱️  $name: TIMEOUT após ${timeout}s${NC}"
        return 124
    else
        echo -e "${RED}❌ $name: FALHOU (exit code: $exit_code)${NC}"
        return $exit_code
    fi
}

# Função principal
main() {
    local test_type=${1:-all}
    
    echo ""
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}  🧪 Executando Testes - Aurora DynamoDB${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo ""
    
    case $test_type in
        unit)
            echo -e "${GREEN}📦 Rodando apenas Testes Unitários${NC}"
            echo ""
            run_with_timeout "npm run test:unit" "Testes Unitários" 60
            ;;
        e2e)
            echo -e "${GREEN}🌐 Rodando apenas Testes E2E${NC}"
            echo ""
            run_with_timeout "npm run test:e2e" "Testes E2E" 180
            ;;
        all)
            echo -e "${GREEN}🚀 Rodando TODOS os Testes${NC}"
            echo ""
            
            # Testes unitários (60s timeout)
            run_with_timeout "npm run test:unit:fast" "Testes Unitários" 60
            local unit_result=$?
            
            echo ""
            
            # Testes E2E (180s timeout)
            run_with_timeout "npm run test:e2e:fast" "Testes E2E" 180
            local e2e_result=$?
            
            echo ""
            echo -e "${BLUE}════════════════════════════════════════${NC}"
            echo -e "${BLUE}  📊 RESUMO FINAL${NC}"
            echo -e "${BLUE}════════════════════════════════════════${NC}"
            
            if [ $unit_result -eq 0 ]; then
                echo -e "${GREEN}✅ Testes Unitários: PASSOU${NC}"
            else
                echo -e "${RED}❌ Testes Unitários: FALHOU${NC}"
            fi
            
            if [ $e2e_result -eq 0 ]; then
                echo -e "${GREEN}✅ Testes E2E: PASSOU${NC}"
            else
                echo -e "${RED}❌ Testes E2E: FALHOU${NC}"
            fi
            
            echo ""
            
            # Exit code final
            if [ $unit_result -eq 0 ] && [ $e2e_result -eq 0 ]; then
                echo -e "${GREEN}🎉 TODOS OS TESTES PASSARAM!${NC}"
                exit 0
            else
                echo -e "${RED}⚠️  ALGUNS TESTES FALHARAM${NC}"
                exit 1
            fi
            ;;
        *)
            echo -e "${RED}❌ Tipo de teste inválido: $test_type${NC}"
            echo ""
            echo "Uso: $0 [unit|e2e|all]"
            echo ""
            echo "Exemplos:"
            echo "  $0 unit    # Roda apenas testes unitários (60s timeout)"
            echo "  $0 e2e     # Roda apenas testes E2E (180s timeout)"
            echo "  $0 all     # Roda todos os testes (padrão)"
            exit 1
            ;;
    esac
}

# Executar
main "$@"

