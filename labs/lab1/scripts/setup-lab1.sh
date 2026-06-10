#!/bin/bash
#
# Setup Lab1 - Criação de Tabelas + Seed de Dados
# Cria tabelas simples e composta e popula com dados para consultas
#

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuração
ENDPOINT_URL="http://localhost:17000"
REGION="us-east-1"
TABLE_SIMPLE="lab1-chave-simples"
TABLE_COMPOSITE="lab1-chave-composta"

# UUIDs fixos
ZELDA_UUID="550e8400-e29b-41d4-a716-446655440000"
LINK_UUID="660e8400-e29b-41d4-a716-446655440001"

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  Setup Lab1 - Criação de Tabelas + Seed               ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Verificar pré-requisitos
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI não encontrado${NC}"
    exit 1
fi

if ! curl -s "$ENDPOINT_URL" > /dev/null 2>&1; then
    echo -e "${RED}❌ DynamoDB Local não está acessível em $ENDPOINT_URL${NC}"
    echo "   Execute: docker-compose up -d dynamodb-local"
    exit 1
fi

echo -e "${GREEN}✅ DynamoDB Local está rodando${NC}"

# Função para deletar tabela se existir
delete_table_if_exists() {
    local table_name=$1
    if aws dynamodb describe-table \
        --table-name "$table_name" \
        --endpoint-url "$ENDPOINT_URL" \
        --region "$REGION" \
        > /dev/null 2>&1; then
        echo -e "${YELLOW}🗑️  Deletando tabela existente: $table_name${NC}"
        aws dynamodb delete-table \
            --table-name "$table_name" \
            --endpoint-url "$ENDPOINT_URL" \
            --region "$REGION" \
            > /dev/null
        aws dynamodb wait table-not-exists \
            --table-name "$table_name" \
            --endpoint-url "$ENDPOINT_URL" \
            --region "$REGION"
    fi
}

# Deletar tabelas existentes
delete_table_if_exists "$TABLE_SIMPLE"
delete_table_if_exists "$TABLE_COMPOSITE"

# Criar tabela simples
echo ""
echo -e "${BLUE}🔧 Criando tabela simples: $TABLE_SIMPLE${NC}"
aws dynamodb create-table \
    --table-name "$TABLE_SIMPLE" \
    --attribute-definitions AttributeName=PK,AttributeType=S \
    --key-schema AttributeName=PK,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url "$ENDPOINT_URL" \
    --region "$REGION" \
    > /dev/null

aws dynamodb wait table-exists \
    --table-name "$TABLE_SIMPLE" \
    --endpoint-url "$ENDPOINT_URL" \
    --region "$REGION"

echo -e "${GREEN}✅ Tabela simples criada${NC}"

# Criar tabela composta
echo -e "${BLUE}🔧 Criando tabela composta: $TABLE_COMPOSITE${NC}"
aws dynamodb create-table \
    --table-name "$TABLE_COMPOSITE" \
    --attribute-definitions \
        AttributeName=PK,AttributeType=S \
        AttributeName=SK,AttributeType=S \
    --key-schema \
        AttributeName=PK,KeyType=HASH \
        AttributeName=SK,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url "$ENDPOINT_URL" \
    --region "$REGION" \
    > /dev/null

aws dynamodb wait table-exists \
    --table-name "$TABLE_COMPOSITE" \
    --endpoint-url "$ENDPOINT_URL" \
    --region "$REGION"

echo -e "${GREEN}✅ Tabela composta criada${NC}"

# Popular tabela simples
echo ""
echo -e "${BLUE}📝 Populando tabela simples (27 items)...${NC}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# BatchWriteItem tem limite de 25 items, então dividimos em chunks
# Processar seed-simple.json em chunks de 25
TOTAL_ITEMS=$(jq ".[\"$TABLE_SIMPLE\"] | length" "$SCRIPT_DIR/data/seed-simple.json")
CHUNK_SIZE=25
OFFSET=0

while [ $OFFSET -lt $TOTAL_ITEMS ]; do
    END=$((OFFSET + CHUNK_SIZE))
    if [ $END -gt $TOTAL_ITEMS ]; then
        END=$TOTAL_ITEMS
    fi
    
    # Criar chunk temporário
    jq "{ \"$TABLE_SIMPLE\": .[\"$TABLE_SIMPLE\"][$OFFSET:$END] }" \
        "$SCRIPT_DIR/data/seed-simple.json" > /tmp/seed-simple-chunk.json
    
    aws dynamodb batch-write-item \
        --request-items file:///tmp/seed-simple-chunk.json \
        --endpoint-url "$ENDPOINT_URL" \
        --region "$REGION" \
        > /dev/null
    
    OFFSET=$END
done

rm -f /tmp/seed-simple-chunk.json

echo -e "${GREEN}✅ Tabela simples populada (27 items)${NC}"

# Popular tabela composta
echo ""
echo -e "${BLUE}📝 Populando tabela composta (43 items: 21 Zelda + 22 Link)...${NC}"

# Processar seed-composite.json em chunks de 25
TOTAL_ITEMS=$(jq ".[\"$TABLE_COMPOSITE\"] | length" "$SCRIPT_DIR/data/seed-composite.json")
CHUNK_SIZE=25
OFFSET=0

while [ $OFFSET -lt $TOTAL_ITEMS ]; do
    END=$((OFFSET + CHUNK_SIZE))
    if [ $END -gt $TOTAL_ITEMS ]; then
        END=$TOTAL_ITEMS
    fi
    
    # Criar chunk temporário
    jq "{ \"$TABLE_COMPOSITE\": .[\"$TABLE_COMPOSITE\"][$OFFSET:$END] }" \
        "$SCRIPT_DIR/data/seed-composite.json" > /tmp/seed-composite-chunk.json
    
    aws dynamodb batch-write-item \
        --request-items file:///tmp/seed-composite-chunk.json \
        --endpoint-url "$ENDPOINT_URL" \
        --region "$REGION" \
        > /dev/null
    
    OFFSET=$END
done

rm -f /tmp/seed-composite-chunk.json

echo -e "${GREEN}✅ Tabela composta populada (43 items)${NC}"

# Resumo
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  ✅ Setup Concluído!                                  ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}📊 Resumo:${NC}"
echo "   • Tabela Simples: 27 items"
echo "   • Tabela Composta: 43 items (21 Zelda + 22 Link)"
echo ""
echo -e "${BLUE}💡 Próximo passo: Veja CONSULTAS.md para exemplos de consultas${NC}"
echo ""

