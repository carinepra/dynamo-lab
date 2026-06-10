# 📚 Lab 1 - Academia dos Fundamentos

Bem-vindo à **Academia dos Fundamentos** do DynamoDB!

---

## 🎯 O que é este Lab?

Este é o **aquecimento** antes de entrar no Single-Table Design (Lab 2).

Aqui você vai aprender os **conceitos fundamentais** do DynamoDB:
- 🔑 SQL vs NoSQL (JOINs, schema flexível, performance)
- 📊 DynamoDB (PK, SK, limites, tabelas)
- 🏗️ Partições (lógica vs física, hot partitions, distribuição por hash)
- ⚡ Operações (GetItem, Query, Scan, Batch)
- 🎨 Limites e paginação

**Duração:** 45 minutos  
**Formato:** 15 perguntas conceituais (múltipla escolha)  
**XP Total:** 1.500 XP  
**Dificuldade:** ⭐ Iniciante → ⭐⭐⭐ Avançado

---

## 🎮 Como Funciona

### Durante o Treinamento

1. **Instrutor apresenta:** Conceitos fundamentais (20min)
   - Cap 1: O que é DynamoDB
   - Cap 2: Single Table Design

2. **Quiz completo:** 15 perguntas organizadas em 3 quizzes
   - Quiz 1: SQL vs NoSQL (3 perguntas, 300 XP)
   - Quiz 2: DynamoDB Core e Partições (6 perguntas, 600 XP)
   - Quiz 3: Operações e Limites (6 perguntas, 600 XP)
   - Múltipla escolha
   - Feedback imediato
   - Sem penalidade por erro

3. **Resultado:** Você ganha XP e vai pro Lab 1!

---

## 📖 Conceitos Cobertos

### QUIZ 1: SQL vs NoSQL
- JOINs e relacionamentos
- Schema flexível vs rígido
- Performance e escalabilidade

### QUIZ 2: DynamoDB Core e Partições

### 1. Partition Key (PK) e Sort Key (SK)

**PK:** Agrupa items relacionados
```
EMPLOYEE#650e8400-...  ← Todos os items deste employee
EMPLOYEE#650e8400-...
EMPLOYEE#650e8400-...
```

**SK:** Ordena items dentro do grupo
```
PK: EMPLOYEE#650e8400...
  ├─ SK: SUMMARY          (dados básicos)
  ├─ SK: PLAN#880e8400... (plano 1)
  └─ SK: PLAN#990e8400... (plano 2)
```

---

### 2. PK vs PK+SK
- Tabela com apenas PK (1 item por chave)
- Tabela com PK+SK (múltiplos items, relacionamentos)

### 3. Partições no DynamoDB

**Partição Lógica vs Física:**
- **Partição Lógica:** Definida pela Partition Key (PK). Todos os items com a mesma PK formam uma partição lógica.
- **Partição Física:** Unidade de armazenamento interno do DynamoDB. Múltiplas partições lógicas podem estar na mesma partição física.
- Você trabalha com partições lógicas (PK), o DynamoDB gerencia partições físicas automaticamente.

**Distribuição por Hash:**
- DynamoDB usa função hash da PK para determinar partição física
- Mesma PK sempre vai para mesma partição física (até rebalanceamento)
- Permite acesso direto à partição física conhecida

**Hot Partitions:**
- Partição que recebe desproporcionalmente mais requisições que outras
- Causada por PK que concentra muito tráfego (ex: baixa cardinalidade)
- Solução: escolher PK bem distribuída

### 4. Limites do DynamoDB
- Tamanho máximo de item (400 KB)
- Pattern S3 para arquivos grandes

### QUIZ 3: Operações e Limites
### 5. Operações: GetItem vs Query vs Scan

**GetItem:**
- Busca 1 item com chave exata (PK + SK)
- Mais rápido (O(1))
- Exemplo: Buscar employee específico

**Query:**
- Busca múltiplos items com mesmo PK
- Pode filtrar SK com `begins_with`, `BETWEEN`, etc
- Exemplo: Listar todos os planos de um employee

**Scan:**
- Varre TODA a tabela
- Lento e caro
- Evitar sempre que possível!

---

### 6. Por que Query por PK é rápida
- Hash da PK permite acesso direto à partição física
- Não precisa varrer outras partições ou tabela inteira
- Latência consistente e previsível

### 7. Query com begins_with
- Filtros eficientes no Sort Key
- KeyConditionExpression vs FilterExpression

### 8. Quando usar Scan
- Jobs batch ocasionais
- Evitar em produção frequente

### 9. Limites e Paginação
- Query/Scan: 1 MB por operação
- LastEvaluatedKey para paginação
- BatchWriteItem: 25 items, 16 MB

---

## 📋 Desafios

Veja: **[DESAFIOS.md](./DESAFIOS.md)**

São 15 perguntas organizadas em 3 quizzes para validar se você entendeu os conceitos fundamentais!

---

## 🎓 Após Completar

Você estará pronto para:

✅ Entender os desafios do Lab 1  
✅ Modelar access patterns  
✅ Executar queries eficientes  
✅ Comparar SQL vs DynamoDB

**Próximo passo:** [Lab 1 - Single-Table Design](../lab2/README.md)

---

## 💡 Dicas

- 🎯 **Não se preocupe em decorar:** O importante é entender o conceito
- 🤔 **Pense em USOS, não em entidades:** "Como vou buscar?" ao invés de "Quais tabelas?"
- ⚡ **Denormalização é normal:** Se lê muito e muda pouco, denormalize!

---

**Boa sorte na Academia! 🚀**

