# 📋 Guia de Consultas - Lab1 DynamoDB

Este documento apresenta **todas as formas possíveis** de consultar dados nas tabelas do Lab1.

## 🎯 Objetivo

Execute cada comando abaixo e observe o retorno. Durante o treinamento, vamos discutir:
- **O que cada operação retorna**
- **Quando usar cada uma**
- **Performance e custos**
- **Diferenças entre GetItem, Query e Scan**

**📁 Resultados:** Cada consulta exibe o resultado em JSON formatado e abre em um editor para visualização.

---

## 📊 Tabelas Disponíveis

- **`lab1-chave-simples`**: Tabela com apenas Partition Key (PK)
- **`lab1-chave-composta`**: Tabela com Partition Key (PK) + Sort Key (SK)

---

## 🔍 TABELA SIMPLES (`lab1-chave-simples`)

### 1. GetItem - Buscar Item Específico

**Quando usar:** Você conhece a chave exata (PK)

```bash
TMP_FILE="/tmp/getitem_simples_$(date +%Y%m%d_%H%M%S).json"
aws dynamodb get-item \
  --table-name lab1-chave-simples \
  --key '{"PK": {"S": "USER#550e8400-e29b-41d4-a716-446655440000"}}' \
  --endpoint-url http://localhost:17000 \
  --region us-east-1 \
  --output json | jq '.' | tee "$TMP_FILE" && open "$TMP_FILE"
```

**O que observar:**
- Retorna **1 item** ou **vazio** se não existir
- Mais rápido (O(1))
- Precisa conhecer PK exata

---

### 2. Scan - Varrer Toda a Tabela

**Quando usar:** Precisa buscar todos os items (⚠️ use com cuidado!)

```bash
TMP_FILE="/tmp/scan_simples_$(date +%Y%m%d_%H%M%S).json"
aws dynamodb scan \
  --table-name lab1-chave-simples \
  --endpoint-url http://localhost:17000 \
  --region us-east-1 \
  --output json | jq '.' | tee "$TMP_FILE" && open "$TMP_FILE"
```

**O que observar:**
- Retorna **todos os items** da tabela
- Pode ser **lento** em tabelas grandes
- Consome **muita capacidade** de leitura
- ⚠️ **Evite em produção frequente!**

---


## 🔍 TABELA COMPOSTA (`lab1-chave-composta`)

### 1. GetItem - Buscar Item Específico

**Quando usar:** Você conhece PK e SK exatos

```bash
TMP_FILE="/tmp/getitem_composta_$(date +%Y%m%d_%H%M%S).json"
aws dynamodb get-item \
  --table-name lab1-chave-composta \
  --key '{
    "PK": {"S": "USER#550e8400-e29b-41d4-a716-446655440000"},
    "SK": {"S": "SUMMARY"}
  }' \
  --endpoint-url http://localhost:17000 \
  --region us-east-1 \
  --output json | jq '.' | tee "$TMP_FILE" && open "$TMP_FILE"
```

**O que observar:**
- Retorna **1 item** específico
- Mais rápido (O(1))
- Precisa conhecer **PK + SK** completos

---

### 2. Query por PK - Todos Items da Partição

**Quando usar:** Precisa todos os items de um usuário (mesma PK)

```bash
TMP_FILE="/tmp/query_pk_$(date +%Y%m%d_%H%M%S).json"
aws dynamodb query \
  --table-name lab1-chave-composta \
  --key-condition-expression "PK = :pk" \
  --expression-attribute-values '{":pk": {"S": "USER#550e8400-e29b-41d4-a716-446655440000"}}' \
  --endpoint-url http://localhost:17000 \
  --region us-east-1 \
  --output json | jq '.' | tee "$TMP_FILE" && open "$TMP_FILE"
```

**O que observar:**
- Retorna **todos os items** com a mesma PK
- **Rápido** (acessa apenas uma partição)
- Não precisa conhecer SK
- Ordenado por SK (crescente)

---

### 3. Query com SK = (Igualdade Exata)

**Quando usar:** Precisa um item específico conhecendo PK e SK

```bash
TMP_FILE="/tmp/query_sk_equals_$(date +%Y%m%d_%H%M%S).json"
aws dynamodb query \
  --table-name lab1-chave-composta \
  --key-condition-expression "PK = :pk AND SK = :sk" \
  --expression-attribute-values '{
    ":pk": {"S": "USER#550e8400-e29b-41d4-a716-446655440000"},
    ":sk": {"S": "SUMMARY"}
  }' \
  --endpoint-url http://localhost:17000 \
  --region us-east-1 \
  --output json | jq '.' | tee "$TMP_FILE" && open "$TMP_FILE"
```

**O que observar:**
- Retorna **1 item** (igual GetItem, mas usando Query)
- Útil quando já está fazendo Query e quer filtrar por SK

---

### 4. Query com SK begins_with - Prefixo

**Quando usar:** Precisa todos os items que começam com um prefixo

```bash
TMP_FILE="/tmp/query_begins_with_order_$(date +%Y%m%d_%H%M%S).json"
# Buscar todos os pedidos (ORDER#)
aws dynamodb query \
  --table-name lab1-chave-composta \
  --key-condition-expression "PK = :pk AND begins_with(SK, :prefix)" \
  --expression-attribute-values '{
    ":pk": {"S": "USER#550e8400-e29b-41d4-a716-446655440000"},
    ":prefix": {"S": "ORDER#"}
  }' \
  --endpoint-url http://localhost:17000 \
  --region us-east-1 \
  --output json | jq '.' | tee "$TMP_FILE" && open "$TMP_FILE"
```

**O que observar:**
- Retorna **todos os items** com SK começando com o prefixo
- Muito útil para hierarquias (ORDER#, ADDRESS#, etc.)
- Ordenado por SK

**Experimente também:**

```bash
# Buscar todos endereços (ADDRESS#)
TMP_FILE="/tmp/query_begins_with_address_$(date +%Y%m%d_%H%M%S).json"
aws dynamodb query \
  --table-name lab1-chave-composta \
  --key-condition-expression "PK = :pk AND begins_with(SK, :prefix)" \
  --expression-attribute-values '{
    ":pk": {"S": "USER#550e8400-e29b-41d4-a716-446655440000"},
    ":prefix": {"S": "ADDRESS#"}
  }' \
  --endpoint-url http://localhost:17000 \
  --region us-east-1 \
  --output json | jq '.' | tee "$TMP_FILE" && open "$TMP_FILE"

# Buscar todos saldos (BALANCE#)
TMP_FILE="/tmp/query_begins_with_balance_$(date +%Y%m%d_%H%M%S).json"
aws dynamodb query \
  --table-name lab1-chave-composta \
  --key-condition-expression "PK = :pk AND begins_with(SK, :prefix)" \
  --expression-attribute-values '{
    ":pk": {"S": "USER#550e8400-e29b-41d4-a716-446655440000"},
    ":prefix": {"S": "BALANCE#"}
  }' \
  --endpoint-url http://localhost:17000 \
  --region us-east-1 \
  --output json | jq '.' | tee "$TMP_FILE" && open "$TMP_FILE"
```

---

### 5. Query com SK BETWEEN - Range

**Quando usar:** Precisa items em um intervalo de SK

```bash
TMP_FILE="/tmp/query_between_$(date +%Y%m%d_%H%M%S).json"
# Buscar saldos entre duas datas
aws dynamodb query \
  --table-name lab1-chave-composta \
  --key-condition-expression "PK = :pk AND SK BETWEEN :sk_start AND :sk_end" \
  --expression-attribute-values '{
    ":pk": {"S": "USER#550e8400-e29b-41d4-a716-446655440000"},
    ":sk_start": {"S": "BALANCE#2024-01-15"},
    ":sk_end": {"S": "BALANCE#2024-06-15"}
  }' \
  --endpoint-url http://localhost:17000 \
  --region us-east-1 \
  --output json | jq '.' | tee "$TMP_FILE" && open "$TMP_FILE"
```

**O que observar:**
- Retorna **items no intervalo** (inclusive)
- Perfeito para dados temporais (datas, timestamps)
- Ordenado por SK

---

### 6. Query com SK > (Maior Que)

**Quando usar:** Precisa items com SK maior que um valor

```bash
TMP_FILE="/tmp/query_sk_greater_than_$(date +%Y%m%d_%H%M%S).json"
aws dynamodb query \
  --table-name lab1-chave-composta \
  --key-condition-expression "PK = :pk AND SK > :sk" \
  --expression-attribute-values '{
    ":pk": {"S": "USER#550e8400-e29b-41d4-a716-446655440000"},
    ":sk": {"S": "BALANCE#2024-06-15"}
  }' \
  --endpoint-url http://localhost:17000 \
  --region us-east-1 \
  --output json | jq '.' | tee "$TMP_FILE" && open "$TMP_FILE"
```

**O que observar:**
- Retorna **items com SK maior** que o valor
- Útil para "buscar tudo após uma data"
- Ordenado por SK

---

### 7. Query com SK >= (Maior ou Igual)

**Quando usar:** Precisa items com SK maior ou igual a um valor

```bash
TMP_FILE="/tmp/query_sk_greater_equal_$(date +%Y%m%d_%H%M%S).json"
aws dynamodb query \
  --table-name lab1-chave-composta \
  --key-condition-expression "PK = :pk AND SK >= :sk" \
  --expression-attribute-values '{
    ":pk": {"S": "USER#550e8400-e29b-41d4-a716-446655440000"},
    ":sk": {"S": "BALANCE#2024-06-15"}
  }' \
  --endpoint-url http://localhost:17000 \
  --region us-east-1 \
  --output json | jq '.' | tee "$TMP_FILE" && open "$TMP_FILE"
```

**O que observar:**
- Retorna **items com SK >= valor** (inclui o valor)
- Útil para "buscar a partir de uma data"

---

### 8. Query com SK < (Menor Que)

**Quando usar:** Precisa items com SK menor que um valor

```bash
TMP_FILE="/tmp/query_sk_less_than_$(date +%Y%m%d_%H%M%S).json"
aws dynamodb query \
  --table-name lab1-chave-composta \
  --key-condition-expression "PK = :pk AND SK < :sk" \
  --expression-attribute-values '{
    ":pk": {"S": "USER#550e8400-e29b-41d4-a716-446655440000"},
    ":sk": {"S": "ORDER#003"}
  }' \
  --endpoint-url http://localhost:17000 \
  --region us-east-1 \
  --output json | jq '.' | tee "$TMP_FILE" && open "$TMP_FILE"
```

**O que observar:**
- Retorna **items com SK menor** que o valor
- Útil para "buscar tudo antes de um valor"

---

### 9. Query com SK <= (Menor ou Igual)

**Quando usar:** Precisa items com SK menor ou igual a um valor

```bash
TMP_FILE="/tmp/query_sk_less_equal_$(date +%Y%m%d_%H%M%S).json"
aws dynamodb query \
  --table-name lab1-chave-composta \
  --key-condition-expression "PK = :pk AND SK <= :sk" \
  --expression-attribute-values '{
    ":pk": {"S": "USER#550e8400-e29b-41d4-a716-446655440000"},
    ":sk": {"S": "ORDER#003"}
  }' \
  --endpoint-url http://localhost:17000 \
  --region us-east-1 \
  --output json | jq '.' | tee "$TMP_FILE" && open "$TMP_FILE"
```

**O que observar:**
- Retorna **items com SK <= valor** (inclui o valor)
- Útil para "buscar até um valor"

---

### 10. Query com Ordem Reversa (ScanIndexForward)

**Quando usar:** Precisa items em ordem decrescente

```bash
TMP_FILE="/tmp/query_reverse_order_$(date +%Y%m%d_%H%M%S).json"
# Buscar saldos mais recentes primeiro
aws dynamodb query \
  --table-name lab1-chave-composta \
  --key-condition-expression "PK = :pk AND begins_with(SK, :prefix)" \
  --expression-attribute-values '{
    ":pk": {"S": "USER#550e8400-e29b-41d4-a716-446655440000"},
    ":prefix": {"S": "BALANCE#"}
  }' \
  --scan-index-forward false \
  --limit 5 \
  --endpoint-url http://localhost:17000 \
  --region us-east-1 \
  --output json | jq '.' | tee "$TMP_FILE" && open "$TMP_FILE"
```

**O que observar:**
- Retorna items em **ordem decrescente** (SK)
- Útil para "últimos N items"
- Combine com `--limit` para paginação

---


### 11. Scan - Varrer Toda a Tabela

**Quando usar:** Precisa buscar em múltiplas partições (⚠️ use com cuidado!)

```bash
TMP_FILE="/tmp/scan_composta_$(date +%Y%m%d_%H%M%S).json"
aws dynamodb scan \
  --table-name lab1-chave-composta \
  --endpoint-url http://localhost:17000 \
  --region us-east-1 \
  --output json | jq '.' | tee "$TMP_FILE" && open "$TMP_FILE"
```

**O que observar:**
- Retorna **todos os items** da tabela
- **Muito lento** (varre todas partições)
- Consome **muita capacidade**
- ⚠️ **Evite em produção frequente!**

---


