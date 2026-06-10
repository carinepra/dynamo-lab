# 🛠️ Scripts do Lab 2 - Setup DynamoDB

Scripts para criar e popular a tabela DynamoDB Local.

## 📋 Pré-requisitos

1. **Docker rodando** com DynamoDB Local:
   ```bash
   make start
   # ou
   docker-compose up -d dynamodb-local
   ```

2. **Python 3** com boto3:
   ```bash
   pip install boto3
   ```

## 🚀 Uso Rápido

```bash
cd labs/lab2/scripts

# 1. Criar tabela
python create-table.py

# 2. Popular dados (61 items)
python seed-data.py
```

Ou use o Makefile na raiz:
```bash
make lab-setup LAB=lab2
```

## 📊 O que é criado

### Tabela: `aurora-benefits`
- **PK** (Partition Key): String
- **SK** (Sort Key): String
- **Billing Mode**: PAY_PER_REQUEST

### Dados: 61 items

| Personagem | Items | Planos | Certificados | Histórico |
|------------|-------|--------|--------------|-----------|
| 👩 Zelda | 19 | 1 (Individual) | 2 fundos | 6 meses |
| 👨 Link | 42 | 2 (PGBL + VGBL) | 3 fundos | 12 meses |

## 🎯 UUIDs para Queries

### Zelda
```
EMPLOYEE: 650e8400-e29b-41d4-a716-446655440010
PLAN:     880e8400-e29b-41d4-a716-446655440003
CERT 1:   bb0e8400-e29b-41d4-a716-446655440020
CERT 2:   cc0e8400-e29b-41d4-a716-446655440021
```

### Link
```
EMPLOYEE: 770e8400-e29b-41d4-a716-446655440002
PLAN 1:   880e8400-e29b-41d4-a716-446655440004 (PGBL)
PLAN 2:   881e8400-e29b-41d4-a716-446655440005 (VGBL)
CERT 1:   aa0e8400-e29b-41d4-a716-446655440020
CERT 2:   ab0e8400-e29b-41d4-a716-446655440021
CERT 3:   ac0e8400-e29b-41d4-a716-446655440022
```

## 🔧 Comandos Úteis

```bash
# Recriar tabela (deleta e cria novamente)
python create-table.py --force

# Verificar contagem de items
aws dynamodb scan \
  --table-name aurora-benefits \
  --endpoint-url http://localhost:17000 \
  --select COUNT

# Listar todos os items
aws dynamodb scan \
  --table-name aurora-benefits \
  --endpoint-url http://localhost:17000
```

## 📁 Estrutura dos Arquivos

```
labs/lab2/scripts/
├── create-table.py   # Cria tabela aurora-benefits
├── seed-data.py      # Popula com 61 items (Zelda + Link)
└── README.md         # Este arquivo
```

