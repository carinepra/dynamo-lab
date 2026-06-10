# 🆘 FAQ - Perguntas Frequentes

## 🐳 Problemas com Docker/Colima

### ❌ Erro: "colima: command not found"

**Causa:** Homebrew não está no PATH.

**Solução:**
```bash
# Para zsh (shell padrão do Mac):
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# Feche e abra o Terminal novamente
```

---

### ❌ Erro: "Cannot connect to the Docker daemon"

**Causa:** Colima não está rodando.

**Solução:**
```bash
make setup

# Aguarde 1-2 minutos
# Verifique status:
colima status
```

---

### ❌ Erro: "error starting vm: error at 'starting': exit status 1"

**Causa:** Instância do Colima corrompida.

**Solução:**
```bash
# Deletar e recriar
colima delete
make setup

# ⚠️ Isso apaga dados do DynamoDB Local!
# Você precisará recriar a tabela
```

---

## 💾 Problemas com DynamoDB Local

### ❌ DynamoDB Local não responde

**Solução 1:** Aguardar inicialização
```bash
# O container demora alguns segundos
sleep 10
make health-check
```

**Solução 2:** Reiniciar container
```bash
make reset
```

**Solução 3:** Verificar porta
```bash
# Verificar se porta 17000 está livre
lsof -i :17000

# Se algo estiver usando, matar processo ou mudar porta no docker-compose.yml
```

---

### ❌ Query não retorna dados

**Causa 1:** Dados não foram carregados

**Solução:**
```bash
make lab-setup LAB=lab2

# Verificar se dados estão lá (deve retornar 61 items)
AWS_ACCESS_KEY_ID=fakeMyKeyId AWS_SECRET_ACCESS_KEY=fakeSecretAccessKey \
  aws dynamodb scan \
  --table-name aurora-benefits \
  --endpoint-url http://localhost:17000 \
  --region us-east-1 \
  --select COUNT
```

**Causa 2:** PK ou SK errados (case-sensitive!)

**Solução:**
```bash
# Verificar exatamente como está no seed
# PK correto: EMPLOYEE#650e8400-e29b-41d4-a716-446655440010
# SK correto: SUMMARY

# ❌ Errado: employee#... (minúsculo)
# ❌ Errado: Summary (maiúscula no meio)
```

---

## 🤖 Problemas com Validação (Copilot)

### ❌ Copilot não está validando minhas respostas

**Solução 1:** Mencionar arquivos de contexto
```
@copilot/lab1/validation-schema.json
@copilot/lab1/README.md

Valide minha resposta: AP1 - C) GetItem
```

**Solução 2:** Adicionar em .cursorrules
```bash
# Criar arquivo .cursorrules na raiz:
cat > .cursorrules << 'EOF'
When validating Lab 1 challenges, use:
- copilot/lab1/validation-schema.json
- copilot/lab1/README.md
EOF
```

**Solução 3:** Usar o quiz web
```bash
# Se Copilot não funcionar, use o quiz gamificado:
make start

# Acessar: http://localhost:17080
```

---

### ❌ Copilot dá resposta genérica ("Correto!" sem explicação)

**Causa:** IA não está usando validation-schema.json

**Solução:** Seja mais específico
```
# ❌ Vago:
"AP1 é C"

# ✅ Específico:
"AP1 - Escolhi C) GetItem porque já tenho o UUID da Zelda 
e quero buscar apenas o registro dela. GetItem é O(1) quando 
você tem PK+SK completos."
```

---

## ⚡ Problemas de Performance

### ❌ Query está muito lenta (> 50ms)

**Causa 1:** Usando Scan ao invés de Query

**Solução:**
```python
# ❌ Errado: Scan (varre toda tabela)
response = table.scan()

# ✅ Correto: Query com chave
response = table.query(
    KeyConditionExpression='PK = :pk',
    ExpressionAttributeValues={':pk': 'EMPLOYEE#...'}
)
```

**Causa 2:** FilterExpression desnecessário

**Solução:**
```python
# ❌ Errado: Filter DEPOIS da query (caro)
response = table.query(
    KeyConditionExpression='PK = :pk',
    FilterExpression='status = :s'  # ⚠️ Caro!
)

# ✅ Correto: Usar SK ou GSI
response = table.query(
    KeyConditionExpression='PK = :pk AND begins_with(SK, :prefix)'
)
```

---

## 📖 Problemas Conceituais

### ❓ Quando usar GetItem vs Query?

**GetItem:**
- Você tem PK **E** SK completos
- Buscar 1 item específico
- O(1) - mais rápido possível

**Query:**
- Você tem PK mas quer múltiplos items
- Buscar por prefixo de SK
- Buscar com BETWEEN, >=, <=
- O(log n + itens retornados)

---

### ❓ Como ordenar resultados?

**Ordem padrão:** SK em ordem lexicográfica (A→Z, 0→9)

**Ordem reversa:** `ScanIndexForward=false`
```python
# Últimos 3 saldos (mais recentes primeiro)
response = table.query(
    KeyConditionExpression='PK = :pk',
    ExpressionAttributeValues={':pk': 'CERTIFICATE#...'},
    ScanIndexForward=False,  # ⭐ Inverte ordem!
    Limit=3
)
```

---

### ❓ Por que denormalizar dados?

**Trade-off:**
```
Normalizado (SQL):
  ✅ Consistência garantida
  ❌ Múltiplas queries + JOINs lentos

Denormalizado (DynamoDB):
  ✅ 1 query rápida
  ❌ Atualizar múltiplos places se mudar
```

**Regra de ouro:** Denormalizar quando:
- Dados mudam RARAMENTE
- Dados são MUITO lidos
- Exemplo: nome da empresa (muda 1x/ano)

---

## 📞 Precisa de Mais Ajuda?

1. **Durante o lab:** Pergunte ao instrutor
2. **Problemas técnicos:** Releia [INSTALACAO.md](INSTALACAO.md)
3. **Dúvidas conceituais:** Consulte [DESAFIOS.md](../../labs/lab1/DESAFIOS.md)
4. **Erros no código:** Revise os exemplos e gabaritos comentados nos desafios do lab correspondente

---

**Não encontrou sua dúvida?** Pergunte ao instrutor! 🙋‍♂️

