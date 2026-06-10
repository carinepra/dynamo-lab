# 📚 Lab 1 - Academia dos Fundamentos

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🎓 ACADEMIA DOS FUNDAMENTOS                        ┃
┃                                                     ┃
┃  Antes de enfrentar o Single-Table Design,         ┃
┃  você precisa dominar os CONCEITOS BÁSICOS!        ┃
┃                                                     ┃
┃  15 perguntas | 1.500 XP | 20 minutos              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**Total:** 15 perguntas | 1.500 XP  
**Duração:** 45 minutos  
**Dificuldade:** ⭐ Iniciante → ⭐⭐⭐ Avançado

---

## 🎮 Sistema de Pontuação

### QUIZ 1: SQL vs NoSQL (300 XP)
| Pergunta | Tema | XP | Dificuldade |
|----------|------|----|-------------|
| Q1 | JOINs e Relacionamentos | 100 | ⭐ Iniciante |
| Q2 | Schema Flexível | 100 | ⭐⭐ Intermediário |
| Q3 | Performance e Escalabilidade | 100 | ⭐⭐ Intermediário |

### QUIZ 2: DynamoDB Core e Partições (600 XP)
| Pergunta | Tema | XP | Dificuldade |
|----------|------|----|-------------|
| Q4 | O que é DynamoDB? | 100 | ⭐ Iniciante |
| Q5 | Partition Key e Partições | 100 | ⭐⭐ Intermediário |
| Q6 | Partições Lógicas vs Físicas | 100 | ⭐⭐ Intermediário |
| Q7 | Distribuição por Hash | 100 | ⭐⭐⭐ Avançado |
| Q8 | Hot Partitions | 100 | ⭐⭐ Intermediário |
| Q9 | PK vs PK+SK | 100 | ⭐⭐ Intermediário |

### QUIZ 3: Operações e Limites (600 XP)
| Pergunta | Tema | XP | Dificuldade |
|----------|------|----|-------------|
| Q10 | GetItem vs Query | 100 | ⭐⭐ Intermediário |
| Q11 | Por que Query por PK é rápida | 100 | ⭐⭐ Intermediário |
| Q12 | Query com begins_with | 100 | ⭐⭐⭐ Avançado |
| Q13 | Quando usar Scan | 100 | ⭐⭐ Intermediário |
| Q14 | Limite de Query | 100 | ⭐ Iniciante |
| Q15 | Limite de BatchWriteItem | 100 | ⭐⭐ Intermediário |

**Total Possível:** 1.500 XP

---

## 📝 QUIZ 1: SQL vs NoSQL

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📝 QUIZ 1: SQL vs NoSQL                                 ┃
┃                                                          ┃
┃  3 perguntas | 300 XP | 10 minutos                      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

### 💎 Q1 (100 XP): JOINs e Relacionamentos

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 1/15 - JOINs vs NoSQL        ┃
┃  Dificuldade: ⭐ Iniciante              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Objetivo:** Entender a diferença fundamental entre SQL e NoSQL em relacionamentos

**📖 Contexto:**

Zelda está analisando como buscar dados relacionados em cada modelo.

No SQL, para buscar dados relacionados, você precisa fazer JOINs:

```sql
SELECT u.name, o.product, o.total
FROM tb_users u
JOIN tb_orders o ON u.id = o.user_id
WHERE u.id = 123;
```

No NoSQL (DynamoDB), os dados já vêm juntos:

```json
{
  "PK": "USER#123",
  "SK": "ORDER#456",
  "name": "Zelda",
  "product": "Notebook",
  "total": 5000
}
```

**❓ Qual a principal diferença entre SQL e NoSQL em relação a relacionamentos?**

- [ ] A) SQL não suporta relacionamentos, NoSQL sim
- [ ] B) SQL usa JOINs para relacionar dados, NoSQL já armazena dados relacionados juntos
- [ ] C) SQL é mais rápido para relacionamentos, NoSQL é mais lento
- [ ] D) SQL e NoSQL funcionam da mesma forma com relacionamentos

**💡 Dica:** Pense em como você acessa dados relacionados em cada modelo.

<details>
<summary>💡 Ver Resposta</summary>

**✅ Resposta: B) SQL usa JOINs para relacionar dados, NoSQL já armazena dados relacionados juntos**

**Motivos:**
- ✅ **SQL (Relacional):** Dados normalizados em tabelas separadas, JOINs necessários para combinar dados de múltiplas tabelas
- ✅ **NoSQL (DynamoDB):** Dados denormalizados, já armazenados juntos, sem JOINs necessários, acesso direto aos dados relacionados

**❌ Por que as outras estão erradas:**
- **A)** SQL definitivamente suporta relacionamentos através de JOINs e chaves estrangeiras
- **C)** Na verdade, NoSQL geralmente é mais rápido para relacionamentos porque evita JOINs complexos
- **D)** São modelos fundamentalmente diferentes de armazenamento e acesso

**🎯 Conceito-chave:**

> **SQL = Normalização + JOINs**  
> **NoSQL = Denormalização + Acesso Direto**

**Exemplo Real:**

**SQL:**
```sql
-- 3 tabelas, 2 JOINs
SELECT e.name, p.name, pf.balance
FROM tb_employee e
JOIN tb_plan p ON e.id = p.employee_id
JOIN tb_plan_fund pf ON p.id = pf.plan_id
WHERE e.id = 123;
-- Tempo: 180ms
```

**DynamoDB:**
```json
// 1 Query retorna tudo
{"PK": "EMPLOYEE#123", "SK": "SUMMARY", "name": "Zelda"}
{"PK": "EMPLOYEE#123", "SK": "PLAN#456", "plan_name": "PGBL"}
{"PK": "EMPLOYEE#123", "SK": "PLAN#789", "plan_name": "VGBL"}
// Tempo: 8ms
```

**+100 XP**
</details>

---

### 💎 Q2 (100 XP): Schema Flexível

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 2/15 - SCHEMA FLEXÍVEL      ┃
┃  Dificuldade: ⭐⭐ Intermediário         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Objetivo:** Entender a vantagem do schema flexível do NoSQL

**📖 Contexto:**

Link está comparando como adicionar novos campos em cada modelo.

Em SQL, você define o schema antes de inserir dados:

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);
-- Todos os registros devem ter essas colunas
```

No DynamoDB, cada item pode ter atributos diferentes:

```json
// Item 1
{"PK": "USER#1", "SK": "PROFILE", "name": "Zelda", "email": "zelda@..."}

// Item 2
{"PK": "USER#2", "SK": "PROFILE", "name": "Link", "age": 30, "company": "Tech Corp"}
```

**❓ Qual a principal vantagem do schema flexível do NoSQL em relação à evolução de dados?**

- [ ] A) Permite adicionar novos campos sem alterar a estrutura da tabela, facilitando evolução gradual
- [ ] B) Garante que todos os items tenham exatamente os mesmos campos, evitando inconsistências
- [ ] C) É mais rápido que schema rígido porque não precisa validar estrutura
- [ ] D) Não tem vantagens, é apenas uma diferença de implementação

**💡 Dica:** Pense em como adicionar novos campos ao longo do tempo em cada modelo.

<details>
<summary>💡 Ver Resposta</summary>

**✅ Resposta: A) Permite adicionar novos campos sem alterar a estrutura da tabela, facilitando evolução gradual**

**Motivos:**
- ✅ **SQL (Schema Rígido):** Precisa fazer `ALTER TABLE` para adicionar colunas, operação pode ser demorada em tabelas grandes (lock, rebuild)
- ✅ **NoSQL (Schema Flexível):** Novos atributos podem ser adicionados por item, sem necessidade de ALTER TABLE, items antigos continuam funcionando, evolução gradual e incremental

**❌ Por que as outras estão erradas:**
- **B)** Schema flexível permite diferenças entre items, não garante uniformidade
- **C)** Performance não é a principal vantagem; a flexibilidade é
- **D)** A flexibilidade é uma vantagem significativa para evolução de dados

**🎯 Conceito-chave:**

> **SQL = Schema primeiro, dados depois**  
> **NoSQL = Dados primeiro, schema evolui**

**Exemplo Real:**

**SQL - Adicionar campo:**
```sql
-- Precisa alterar tabela
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
-- Pode demorar em tabelas grandes
-- Todos os registros existentes terão NULL
```

**DynamoDB - Adicionar campo:**
```json
// Apenas novos items têm o campo
{"PK": "USER#1", "SK": "PROFILE", "name": "Zelda"}
{"PK": "USER#2", "SK": "PROFILE", "name": "Link", "phone": "11999999999"}
// Items antigos continuam funcionando normalmente
```

**+100 XP**
</details>

---

### 💎 Q3 (100 XP): Performance e Escalabilidade

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 3/15 - PERFORMANCE          ┃
┃  Dificuldade: ⭐⭐ Intermediário         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Objetivo:** Entender por que NoSQL tem performance mais previsível

**📖 Contexto:**

Zelda está comparando a performance de queries complexas.

SQL com múltiplos JOINs:
```sql
SELECT * FROM tb_employee e
JOIN tb_plan p ON e.id = p.employee_id
JOIN tb_plan_fund pf ON p.id = pf.plan_id
JOIN tb_balance b ON pf.id = b.fund_id
WHERE e.id = 123;
-- Tempo: 730ms (10+ JOINs)
```

DynamoDB (Single Table):
```json
// 1 Query retorna tudo
{"PK": "EMPLOYEE#123", "SK": "SUMMARY", ...}
{"PK": "EMPLOYEE#123", "SK": "PLAN#456", ...}
{"PK": "EMPLOYEE#123", "SK": "PLAN#789", ...}
-- Tempo: 8ms (0 JOINs)
```

**❓ Por que NoSQL (DynamoDB) tem performance mais previsível que SQL com múltiplos JOINs?**

- [ ] A) SQL é sempre mais lento que NoSQL, independente da query
- [ ] B) NoSQL evita JOINs, acessando dados diretamente por chave, resultando em latência consistente
- [ ] C) NoSQL usa menos memória, por isso é mais rápido
- [ ] D) SQL não pode ser otimizado com índices adequados

**💡 Dica:** Pense no que acontece quando você faz um JOIN versus acesso direto por chave.

<details>
<summary>💡 Ver Resposta</summary>

**✅ Resposta: B) NoSQL evita JOINs, acessando dados diretamente por chave, resultando em latência consistente**

**Motivos:**
- ✅ **SQL com JOINs:** Performance varia conforme número de JOINs, depende de índices e otimização do query planner, pode ter surpresas de performance (JOINs complexos), latência variável (dezenas a centenas de ms)
- ✅ **NoSQL (DynamoDB):** Acesso direto por Partition Key (PK), sem JOINs, sem surpresas, latência previsível: single-digit milliseconds, performance consistente independente do volume

**❌ Por que as outras estão erradas:**
- **A)** SQL pode ser rápido para queries simples; a questão é sobre JOINs complexos
- **C)** Uso de memória não é o fator principal; é a ausência de JOINs
- **D)** SQL pode ser otimizado, mas JOINs complexos sempre terão overhead

**🎯 Conceito-chave:**

> **SQL = Performance variável (depende de JOINs)**  
> **NoSQL = Performance previsível (acesso direto)**

**Exemplo Real:**

**SQL (Aurora Labs atual):**
```go
// Buscar home do app completa
employee, err := employeeRepo.FindByID(uuid)
// SELECT * FROM tb_employee WHERE uuid = ?
// + 6 JOINs internos (plan, fund, balance, etc)
// Tempo: 280ms (variável, pode chegar a 730ms)
```

**DynamoDB:**
```python
# Mesmo resultado
response = table.query(
    KeyConditionExpression='PK = :pk',
    ExpressionAttributeValues={':pk': f'EMPLOYEE#{uuid}'}
)
# Tempo: 8ms ⚡ (consistente, sempre < 10ms)
```

**Comparação:**
- SQL: 280-730ms (variável)
- DynamoDB: 8ms (previsível)
- **91x mais rápido e consistente!**

**+100 XP**
</details>

---

## 📝 QUIZ 2: DynamoDB Core e Partições

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📝 QUIZ 2: DynamoDB Core e Partições                   ┃
┃                                                          ┃
┃  6 perguntas | 600 XP | 20 minutos                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

### 💎 Q4 (100 XP): O que é DynamoDB?

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 4/15 - O QUE É DYNAMODB?    ┃
┃  Dificuldade: ⭐ Iniciante              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Objetivo:** Entender as características fundamentais do DynamoDB

**📖 Contexto:**

Zelda está aprendendo sobre o DynamoDB pela primeira vez.

DynamoDB é um serviço da AWS que oferece banco de dados NoSQL gerenciado.

**❓ Qual característica NÃO é do DynamoDB?**

- [ ] A) Serviço gerenciado (você não gerencia servidor)
- [ ] B) Performance previsível (single-digit milliseconds)
- [ ] C) Escala automaticamente conforme necessidade
- [ ] D) Requer configuração manual de servidores e clusters

**💡 Dica:** DynamoDB é "serverless" e gerenciado.

<details>
<summary>💡 Ver Resposta</summary>

**✅ Resposta: D) Requer configuração manual de servidores e clusters**

**Motivos:**
- ✅ **DynamoDB é totalmente gerenciado:** Sem servidores (você não gerencia infraestrutura), sem clusters (escala automaticamente), sem configuração (apenas use a API), serverless (pague pelo que usar)

**❌ Por que as outras estão corretas:**
- **A)** DynamoDB é totalmente gerenciado pela AWS
- **B)** Performance garantida em milissegundos
- **C)** Escala horizontal automaticamente

**🎯 Conceito-chave:**

> **DynamoDB = Zero Ops**  
> Você não gerencia nada, apenas usa!

**+100 XP**
</details>

---

### 💎 Q5 (100 XP): Partition Key e Partições

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 5/15 - PARTITION KEY         ┃
┃  Dificuldade: ⭐⭐ Intermediário         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Objetivo:** Entender como Partition Key agrupa items e define partição lógica

**📖 Contexto:**

Link está estudando como o DynamoDB organiza dados. A Partition Key (PK) define uma partição lógica - todos os items com a mesma PK formam um grupo lógico que pode ser consultado eficientemente.

No DynamoDB, a Partition Key determina a partição lógica do item. O DynamoDB então usa um hash da PK para distribuir essas partições lógicas entre partições físicas internas.

**❓ O que acontece com items que têm o mesmo Partition Key?**

- [ ] A) São distribuídos em partições físicas diferentes para balancear carga, mas podem ser consultados juntos
- [ ] B) Formam uma partição lógica única e são armazenados juntos na mesma partição física, permitindo queries eficientes
- [ ] C) Não podem ter o mesmo PK, causando erro de duplicação
- [ ] D) São automaticamente deletados para evitar conflitos de chave

**💡 Dica:** PK define partição lógica; items com mesmo PK ficam juntos.

<details>
<summary>💡 Ver Resposta</summary>

**✅ Resposta: B) Formam uma partição lógica única e são armazenados juntos na mesma partição física, permitindo queries eficientes**

**Motivos:**
- ✅ **Partition Key (PK):** Define partição lógica (todos os items com mesmo PK), DynamoDB usa hash da PK para determinar partição física, items com mesmo PK → mesma partição física, permite Query eficiente (todos os items juntos em uma operação), base para relacionamentos 1-to-Many

**❌ Por que as outras estão erradas:**
- **A)** Se fossem distribuídos em partições físicas diferentes, não seria possível fazer Query eficiente por PK
- **C)** Com PK+SK, múltiplos items podem ter o mesmo PK (SK diferencia)
- **D)** Não há conflito; SK diferencia items com mesmo PK

**🎯 Conceito-chave:**

> **PK = Partição Lógica**  
> Items com mesmo PK ficam juntos na mesma partição física

**Exemplo:**

```
PK: EMPLOYEE#650e8400... (partição lógica)
  ├─ SK: SUMMARY          → mesma partição física
  ├─ SK: PLAN#880e8400... → mesma partição física
  └─ SK: PLAN#990e8400... → mesma partição física

Query(PK) retorna todos os 3 items em 1 operação! ⚡
```

**+100 XP**
</details>

---

### 💎 Q6 (100 XP): Partições Lógicas vs Físicas

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 6/15 - PARTIÇÕES            ┃
┃  Dificuldade: ⭐⭐ Intermediário         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Objetivo:** Entender a diferença entre partição lógica (PK) e partição física

**📖 Contexto:**

Zelda está estudando a arquitetura interna do DynamoDB. Ela aprendeu que existe uma diferença importante entre o que o desenvolvedor vê (partição lógica) e como o DynamoDB organiza internamente os dados (partições físicas).

**Partição Lógica:** Definida pela Partition Key (PK). Todos os items com a mesma PK formam uma partição lógica.

**Partição Física:** Unidade de armazenamento interno do DynamoDB. Múltiplas partições lógicas podem estar na mesma partição física.

**❓ Qual a diferença principal entre partição lógica e partição física no DynamoDB?**

- [ ] A) Partição lógica é visível ao desenvolvedor e define como os dados são organizados; partição física é interna e pode conter múltiplas partições lógicas
- [ ] B) Partição lógica e física são a mesma coisa, apenas nomes diferentes
- [ ] C) Partição física é o que o desenvolvedor define com PK; partição lógica é interna
- [ ] D) Não existe diferença, DynamoDB não usa partições

**💡 Dica:** Você trabalha com partições lógicas (PK), o DynamoDB gerencia partições físicas internamente.

<details>
<summary>💡 Ver Resposta</summary>

**✅ Resposta: A) Partição lógica é visível ao desenvolvedor e define como os dados são organizados; partição física é interna e pode conter múltiplas partições lógicas**

**Motivos:**
- ✅ **Partição Lógica (PK):** Definida pela Partition Key, visível ao desenvolvedor, agrupa items relacionados, você consulta por partição lógica (PK)
- ✅ **Partição Física:** Unidade de armazenamento interno do DynamoDB, gerenciada automaticamente, pode conter múltiplas partições lógicas, distribuída através de hash da PK, transparente para o desenvolvedor

**❌ Por que as outras estão erradas:**
- **B)** São conceitos diferentes: lógica (PK) vs física (infraestrutura)
- **C)** Invertido: PK define partição lógica, não física
- **D)** DynamoDB definitivamente usa partições para escalabilidade

**🎯 Conceito-chave:**

> **Partição Lógica (PK) = o que você vê**  
> **Partição Física = como DynamoDB armazena internamente**

**Exemplo:**

```
Partição Lógica (PK):
  PK: "EMPLOYEE#123" → partição lógica 1
  PK: "EMPLOYEE#456" → partição lógica 2
  PK: "EMPLOYEE#789" → partição lógica 3

Partição Física (interna):
  Partição Física 1:
    - PK: "EMPLOYEE#123" (hash → partição física 1)
    - PK: "EMPLOYEE#789" (hash → partição física 1)
  
  Partição Física 2:
    - PK: "EMPLOYEE#456" (hash → partição física 2)

Você consulta por PK (lógica), DynamoDB sabe qual física buscar!
```

**+100 XP**
</details>

---

### 💎 Q7 (100 XP): Distribuição por Hash

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 7/15 - DISTRIBUIÇÃO         ┃
┃  Dificuldade: ⭐⭐⭐ Avançado            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Objetivo:** Entender como o DynamoDB decide em qual partição física armazenar cada PK

**📖 Contexto:**

Link está investigando como o DynamoDB distribui dados entre partições físicas. Ele sabe que a PK determina a partição lógica, mas quer entender o mecanismo interno de distribuição.

O DynamoDB usa uma função hash para calcular um valor numérico a partir da Partition Key. Esse valor hash determina em qual partição física a partição lógica será armazenada.

**❓ Como o DynamoDB decide em qual partição física armazenar uma partição lógica (PK)?**

- [ ] A) Usa round-robin, distribuindo sequencialmente entre as partições físicas disponíveis
- [ ] B) Calcula um hash da Partition Key e usa esse valor para determinar a partição física, garantindo que a mesma PK sempre vá para a mesma partição física
- [ ] C) Armazena todas as PKs na primeira partição física até ela ficar cheia, depois usa a próxima
- [ ] D) Permite que o desenvolvedor escolha manualmente qual partição física usar

**💡 Dica:** Hash garante distribuição uniforme e determinística.

<details>
<summary>💡 Ver Resposta</summary>

**✅ Resposta: B) Calcula um hash da Partition Key e usa esse valor para determinar a partição física, garantindo que a mesma PK sempre vá para a mesma partição física**

**Motivos:**
- ✅ **Função Hash:** DynamoDB aplica hash function na PK, resultado do hash determina partição física, distribuição uniforme (hash bem distribuído), determinística (mesma PK → mesmo hash → mesma partição física), permite acesso direto à partição física conhecida

**❌ Por que as outras estão erradas:**
- **A)** Round-robin não garante que mesma PK vá para mesma partição (quebraria Query)
- **C)** Armazenar tudo em uma partição causaria hot partition e não escalaria
- **D)** DynamoDB gerencia partições físicas automaticamente, desenvolvedor não escolhe

**🎯 Conceito-chave:**

> **Hash(PK) → Partição Física**  
> Mesma PK sempre → mesma partição física (até rebalanceamento)

**Exemplo:**

```
PK: "EMPLOYEE#123"
  → Hash("EMPLOYEE#123") = 0x7A3F...
  → Mapeia para Partição Física 3

PK: "EMPLOYEE#456"
  → Hash("EMPLOYEE#456") = 0x2B9E...
  → Mapeia para Partição Física 1

PK: "EMPLOYEE#789"
  → Hash("EMPLOYEE#789") = 0x7A3F... (mesmo hash que #123)
  → Mapeia para Partição Física 3 (mesma que #123)

Query por PK → DynamoDB calcula hash → vai direto à partição física!
```

**+100 XP**
</details>

---

### 💎 Q8 (100 XP): Hot Partitions

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 8/15 - HOT PARTITIONS       ┃
┃  Dificuldade: ⭐⭐ Intermediário         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Objetivo:** Entender o que é hot partition e como evitar

**📖 Contexto:**

Zelda está analisando métricas de performance e notou que uma partição específica está recebendo muito mais requisições que as outras. Ela suspeita que pode ser um caso de "hot partition".

Hot partition acontece quando uma partição lógica (PK) recebe uma quantidade desproporcional de requisições comparada às outras partições, causando gargalo de performance.

**❓ O que caracteriza uma hot partition e qual a principal causa?**

- [ ] A) Partição com muitos items, causada por escolher PK com baixa cardinalidade
- [ ] B) Partição que recebe desproporcionalmente mais requisições que outras, geralmente causada por escolher PK que concentra muito tráfego
- [ ] C) Partição física que está cheia, causada por items muito grandes
- [ ] D) Partição que não recebe requisições, causada por escolher PK incorreta

**💡 Dica:** Hot partition = partição "quente" com muito tráfego concentrado.

<details>
<summary>💡 Ver Resposta</summary>

**✅ Resposta: B) Partição que recebe desproporcionalmente mais requisições que outras, geralmente causada por escolher PK que concentra muito tráfego**

**Motivos:**
- ✅ **Hot Partition:** Uma partição lógica (PK) recebe muito mais requisições que outras, causa gargalo de performance, limita throughput da tabela, pode causar throttling
- ✅ **Causas Comuns:** PK com baixa cardinalidade (poucos valores únicos), PK que concentra tráfego (ex: data/hora, status fixo), distribuição desigual de acesso

**❌ Por que as outras estão erradas:**
- **A)** Muitos items não causa hot partition; muitas requisições sim
- **C)** Partição cheia é problema de tamanho, não de tráfego
- **D)** Partição sem requisições não é "hot", é o oposto

**🎯 Conceito-chave:**

> **Hot Partition = muito tráfego em uma PK**  
> **Solução = escolher PK bem distribuída**

**Exemplo:**

```
❌ PROBLEMA - Hot Partition:
PK: "STATUS#ACTIVE" → 90% das requisições
PK: "STATUS#INACTIVE" → 10% das requisições
→ Partição "ACTIVE" fica sobrecarregada!

✅ SOLUÇÃO - PK bem distribuída:
PK: "USER#123" → ~1% das requisições
PK: "USER#456" → ~1% das requisições
PK: "USER#789" → ~1% das requisições
→ Tráfego distribuído uniformemente!
```

**+100 XP**
</details>

---

### 💎 Q9 (100 XP): PK vs PK+SK

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 9/15 - PK vs PK+SK          ┃
┃  Dificuldade: ⭐⭐ Intermediário         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Objetivo:** Entender a diferença entre tabela com apenas PK e PK+SK

**📖 Contexto:**

Zelda está comparando diferentes estruturas de tabela.

Tabela com apenas PK:
```json
{"PK": "USER#123", "name": "Zelda"}
```

Tabela com PK + SK:
```json
{"PK": "USER#123", "SK": "PROFILE", "name": "Zelda"}
{"PK": "USER#123", "SK": "ORDER#456", "product": "Notebook"}
```

**❓ Qual a diferença principal entre tabela com apenas PK e PK+SK em relação à modelagem de relacionamentos?**

- [ ] A) Não há diferença, funcionam igual para todos os casos de uso
- [ ] B) Com PK+SK você pode modelar relacionamentos 1-to-Many, permitindo múltiplos items com o mesmo PK
- [ ] C) Apenas PK é mais rápido para todas as operações
- [ ] D) PK+SK não permite Query, apenas GetItem

**💡 Dica:** Pense em quantos items podem ter o mesmo PK em cada caso.

<details>
<summary>💡 Ver Resposta</summary>

**✅ Resposta: B) Com PK+SK você pode modelar relacionamentos 1-to-Many, permitindo múltiplos items com o mesmo PK**

**Motivos:**
- ✅ **Apenas PK (Simple Primary Key):** 1 item único por PK, GetItem precisa apenas do PK, não permite múltiplos items relacionados, limitado para relacionamentos
- ✅ **PK + SK (Composite Primary Key):** Múltiplos items podem compartilhar o mesmo PK, SK diferencia items dentro do mesmo PK, permite modelar hierarquias (1-to-Many), Query retorna todos os items do PK

**❌ Por que as outras estão erradas:**
- **A)** São fundamentalmente diferentes para modelagem
- **C)** PK+SK pode ser mais eficiente para relacionamentos
- **D)** PK+SK permite tanto GetItem quanto Query

**🎯 Conceito-chave:**

> **PK apenas = 1 item por chave**  
> **PK+SK = múltiplos items, relacionamentos**

**Exemplo:**

```
Apenas PK:
  PK: "USER#123" → 1 item apenas

PK + SK:
  PK: "USER#123", SK: "PROFILE" → item 1
  PK: "USER#123", SK: "ORDER#1" → item 2
  PK: "USER#123", SK: "ORDER#2" → item 3
  
  Query(PK="USER#123") → retorna todos os 3 items!
```

**+100 XP**
</details>

---

## 📝 QUIZ 3: Operações e Limites

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📝 QUIZ 3: Operações e Limites                         ┃
┃                                                          ┃
┃  6 perguntas | 600 XP | 20 minutos                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

### 💎 Q10 (100 XP): GetItem vs Query

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 10/15 - GETITEM vs QUERY     ┃
┃  Dificuldade: ⭐⭐ Intermediário         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Objetivo:** Escolher a operação correta quando você tem chave exata

**📖 Contexto:**

Link precisa buscar dados de um employee específico. Ele sabe o PK e SK exatos.

**❓ Qual operação você deve usar e por quê?**

- [ ] A) Query, porque permite buscar múltiplos items de uma vez
- [ ] B) GetItem, porque é a operação mais rápida quando você tem PK+SK exatos
- [ ] C) Scan, porque varre toda a tabela garantindo que encontra o item
- [ ] D) BatchGetItem, porque é otimizado para buscar items específicos

**💡 Dica:** É a operação mais rápida possível.

<details>
<summary>💡 Ver Resposta</summary>

**✅ Resposta: B) GetItem, porque é a operação mais rápida quando você tem PK+SK exatos**

**Motivos:**
- ✅ **GetItem:** Acesso direto O(1) quando você tem PK+SK, mais rápido possível (single-digit ms), retorna exatamente 1 item
- ✅ **Quando usar:** Você sabe PK e SK exatos, quer 1 item específico, máxima performance

**❌ Por que as outras estão erradas:**
- **A)** Query é para múltiplos items com mesmo PK
- **C)** Scan é lento e caro, não use para item específico
- **D)** BatchGetItem é para múltiplos items diferentes, não 1 item

**🎯 Comparação:**

| Operação | Quando usar | Performance |
|----------|-------------|-------------|
| **GetItem** | PK+SK exatos | ⚡⚡⚡ O(1) |
| **Query** | Mesmo PK, múltiplos SK | ⚡⚡ O(log n) |
| **Scan** | Sem chave | 🐌 O(n) |

**Exemplo:**

```python
# GetItem - mais rápido
response = table.get_item(
    Key={'PK': 'EMPLOYEE#123', 'SK': 'SUMMARY'}
)
# Tempo: single-digit ms típico ⚡
```

**+100 XP**
</details>

---

### 💎 Q11 (100 XP): Por que Query por PK é rápida

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 11/15 - QUERY RÁPIDA        ┃
┃  Dificuldade: ⭐⭐ Intermediário         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Objetivo:** Entender por que queries por Partition Key são tão eficientes

**📖 Contexto:**

Link está analisando a performance de queries no DynamoDB. Ele notou que queries usando apenas a Partition Key são extremamente rápidas, sempre retornando em milissegundos.

Quando você faz uma Query especificando a PK, o DynamoDB:
1. Calcula o hash da PK para determinar a partição física
2. Vai diretamente àquela partição física (sem varrer outras)
3. Retorna todos os items daquela partição lógica

**❓ Por que uma Query usando apenas a Partition Key é tão rápida comparada a operações que não usam PK?**

- [ ] A) DynamoDB mantém um índice especial para PKs que acelera todas as queries
- [ ] B) O hash da PK permite acesso direto à partição física específica, evitando varrer outras partições ou a tabela inteira
- [ ] C) Queries por PK são mais rápidas porque DynamoDB usa cache especial para partições mais acessadas
- [ ] D) DynamoDB pré-carrega todas as partições em memória, então qualquer query é rápida

**💡 Dica:** Pense no que acontece quando você tem a PK vs quando não tem.

<details>
<summary>💡 Ver Resposta</summary>

**✅ Resposta: B) O hash da PK permite acesso direto à partição física específica, evitando varrer outras partições ou a tabela inteira**

**Motivos:**
- ✅ **Acesso Direto:** Hash da PK determina partição física exata, DynamoDB vai direto àquela partição (O(1) lookup), não precisa varrer outras partições, não precisa varrer tabela inteira, latência consistente e previsível

**❌ Por que as outras estão erradas:**
- **A)** Não é sobre índice especial; é sobre acesso direto por hash
- **C)** Cache ajuda, mas não é o fator principal; é o acesso direto
- **D)** DynamoDB não pré-carrega tudo; escala dinamicamente

**🎯 Conceito-chave:**

> **PK → Hash → Partição Física → Acesso Direto**  
> Sem PK = precisa varrer tudo (Scan)

**Exemplo:**

```
Query com PK:
  PK: "EMPLOYEE#123"
  → Hash("EMPLOYEE#123") = 0x7A3F...
  → Vai direto à Partição Física 3
  → Retorna items (8ms) ⚡

Scan (sem PK):
  → Precisa varrer TODAS as partições físicas
  → Partição 1, 2, 3, 4, 5...
  → Muito mais lento (centenas de ms) 🐌
```

**+100 XP**
</details>

---

### 💎 Q12 (100 XP): Query Eficiente com Filtros

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 12/15 - QUERY EFICIENTE     ┃
┃  Dificuldade: ⭐⭐⭐ Avançado            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Objetivo:** Escolher a operação correta quando você precisa buscar múltiplos items relacionados sem saber quantos são

**📖 Contexto:**

Zelda precisa listar todos os planos de benefícios de um employee específico. A tabela tem estrutura:

```json
{"PK": "EMPLOYEE#123", "SK": "SUMMARY", ...}
{"PK": "EMPLOYEE#123", "SK": "PLAN#456", ...}
{"PK": "EMPLOYEE#123", "SK": "PLAN#789", ...}
{"PK": "EMPLOYEE#123", "SK": "ORDER#111", ...}
{"PK": "EMPLOYEE#123", "SK": "BALANCE#2024-01", ...}
```

Ela sabe o PK do employee mas não sabe quantos planos existem nem seus SKs exatos.

**❓ Qual operação você recomenda?**

- [ ] A) Usar GetItem com PK+SK exatos, fazendo uma chamada para cada plano conhecido
- [ ] B) Usar Query com PK e begins_with no SK para buscar apenas items cujo SK começa com "PLAN#"
- [ ] C) Usar Query apenas com PK, retornando todos os items e depois filtrar no código os que têm SK começando com "PLAN#"
- [ ] D) Usar Scan na tabela inteira e filtrar no código os items com PK do employee e SK começando com "PLAN#"

**💡 Dica:** Query permite filtrar o Sort Key diretamente usando begins_with na KeyConditionExpression.

<details>
<summary>💡 Ver Resposta</summary>

**✅ Resposta: B) Usar Query com PK e begins_with no SK**

**Motivos:**
- ✅ **Query com begins_with:** Filtra diretamente no Sort Key ANTES de retornar dados, executado na partição física, reduz bandwidth (apenas items relevantes são lidos), reduz processamento (filtro na origem), funciona mesmo sem saber quantos items existem, mais eficiente possível

**Exemplo:**
```python
response = table.query(
  KeyConditionExpression='PK = :pk AND begins_with(SK, :prefix)',
  ExpressionAttributeValues={
    ':pk': 'EMPLOYEE#123',
    ':prefix': 'PLAN#'
  }
)
# Filtro aplicado NA PARTIÇÃO, antes de retornar
# Retorna apenas items com SK começando com "PLAN#"
# Funciona mesmo sem saber quantos planos existem
# Bandwidth: ~2 KB (apenas 2 planos)
# Tempo: 5ms ⚡
```

**❌ Por que as outras estão erradas:**
- **A) GetItem com PK+SK exatos:** GetItem requer que você saiba o SK exato de cada item. Como Zelda não sabe quantos planos existem nem seus SKs, ela não pode usar GetItem. Além disso, mesmo que soubesse, precisaria fazer múltiplas chamadas (uma por plano), o que é ineficiente. Query com begins_with resolve tudo em uma única chamada.
- **C) Query sem filtro + filtrar no código:** Você lê TODOS os items do PK (SUMMARY, PLAN#, ORDER#, BALANCE#, etc) e depois filtra no cliente. Isso desperdiça bandwidth e processamento. Se houver muitos items, você pode exceder 1 MB e precisar paginar, lendo ainda mais dados desnecessários. Query com begins_with filtra na origem, retornando apenas o que precisa.
- **D) Scan na tabela inteira:** Scan varre TODA a tabela (todas as partições de todos os employees), depois filtra no cliente. Extremamente ineficiente! Você paga pelo Scan de milhões de items quando só precisa de alguns items de uma partição específica. Scan é O(n) da tabela inteira, Query é O(n) apenas da partição do PK.

**🎯 Conceito-chave:**

> **Query com begins_with = filtra na partição ANTES de retornar**  
> **Filtrar no código = lê dados desnecessários e filtra DEPOIS**

**Comparação de Performance:**

```python
# ✅ CORRETO - Query com begins_with
response = table.query(
  KeyConditionExpression='PK = :pk AND begins_with(SK, :prefix)',
  ExpressionAttributeValues={':pk': 'EMPLOYEE#123', ':prefix': 'PLAN#'}
)
# Lê apenas items com SK começando com "PLAN#"
# Bandwidth: ~2 KB, Tempo: 5ms ⚡

# ❌ ERRADO - Query sem filtro + filtrar no código
response = table.query(
  KeyConditionExpression='PK = :pk',
  ExpressionAttributeValues={':pk': 'EMPLOYEE#123'}
)
# Lê TODOS os items do PK (SUMMARY, PLAN#, ORDER#, BALANCE#)
# Depois filtra no código
# Bandwidth: ~8 KB, Tempo: 12ms 🐌
```

**+100 XP**
</details>

---

### 💎 Q13 (100 XP): Quando usar Scan

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 13/15 - QUANDO USAR SCAN    ┃
┃  Dificuldade: ⭐⭐ Intermediário         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Objetivo:** Entender quando Scan é aceitável

**📖 Contexto:**

Link está analisando quando usar Scan, que varre toda a tabela, item por item, consumindo muita capacidade.

**❓ Em qual situação é aceitável usar Scan?**

- [ ] A) Em queries frequentes de produção que precisam buscar por atributos não-chave
- [ ] B) Em jobs batch que rodam ocasionalmente para análise ou backup de dados
- [ ] C) Sempre que você não sabe a PK, mesmo em queries frequentes
- [ ] D) Para buscar 1 item específico quando você tem PK+SK

**💡 Dica:** Scan é caro, mas tem seu lugar em cenários específicos.

<details>
<summary>💡 Ver Resposta</summary>

**✅ Resposta: B) Em jobs batch que rodam ocasionalmente para análise ou backup de dados**

**Motivos:**
- ✅ **Scan é aceitável quando:** Jobs batch (backup, ETL, análise), rodam ocasionalmente (não frequente), processamento offline ou assíncrono, impacto aceitável para o caso de uso

**❌ Por que as outras estão erradas:**
- **A)** Queries frequentes devem usar Query ou GSI, não Scan
- **C)** Se não sabe PK, crie GSI ao invés de Scan frequente
- **D)** Para 1 item com PK+SK, use GetItem

**🎯 Conceito-chave:**

> **Scan = jobs batch ocasionais**  
> **Query/GetItem = produção frequente**

**Exemplo:**

```python
# ✅ ACEITÁVEL - Job batch diário
def backup_table():
    # Roda 1x por dia às 3h da manhã
    response = table.scan()
    # Processa todos os items para backup
    # Impacto aceitável para operação ocasional

# ❌ NÃO ACEITÁVEL - Query frequente
def get_employee_by_name(name):
    # Chamado 1000x por minuto
    response = table.scan(
        FilterExpression='#name = :name',
        ExpressionAttributeNames={'#name': 'name'},
        ExpressionAttributeValues={':name': name}
    )
    # Muito caro! Use GSI ao invés disso
```

**+100 XP**
</details>

---

### 💎 Q14 (100 XP): Limite de Query

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 14/15 - LIMITE DE QUERY     ┃
┃  Dificuldade: ⭐ Iniciante              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Objetivo:** Entender paginação no DynamoDB

**📖 Contexto:**

Zelda fez uma Query que retornou muitos items. Query retorna dados de uma partição.

**❓ Qual o limite máximo de dados que uma Query pode retornar em uma única operação e o que acontece se exceder?**

- [ ] A) 400 KB, retorna erro se exceder
- [ ] B) 1 MB, usa LastEvaluatedKey para paginação automática
- [ ] C) 10 MB, sem necessidade de paginação
- [ ] D) Ilimitado, DynamoDB escala automaticamente

**💡 Dica:** É o mesmo limite do Scan.

<details>
<summary>💡 Ver Resposta</summary>

**✅ Resposta: B) 1 MB, usa LastEvaluatedKey para paginação automática**

**Motivos:**
- ✅ **Limite de 1 MB:** Query retorna máximo 1 MB por operação, garante latência consistente, mesmo limite do Scan
- ✅ **Paginação:** Se exceder 1 MB, Query retorna `LastEvaluatedKey`, use `ExclusiveStartKey` na próxima chamada, continue até `LastEvaluatedKey` ser null, processo automático e transparente

**❌ Por que as outras estão erradas:**
- **A)** Limite é 1 MB, não 400 KB (que é limite de item)
- **C)** Limite é 1 MB, não 10 MB
- **D)** Há limite de 1 MB por operação

**🎯 Conceito-chave:**

> **Query = 1 MB por operação**  
> **Paginação = LastEvaluatedKey**

**Exemplo:**

```python
# Query com paginação
items = []
last_key = None

while True:
    if last_key:
        response = table.query(
            KeyConditionExpression='PK = :pk',
            ExpressionAttributeValues={':pk': 'EMPLOYEE#123'},
            ExclusiveStartKey=last_key
        )
    else:
        response = table.query(
            KeyConditionExpression='PK = :pk',
            ExpressionAttributeValues={':pk': 'EMPLOYEE#123'}
        )
    
    items.extend(response['Items'])
    
    last_key = response.get('LastEvaluatedKey')
    if not last_key:
        break  # Terminou!

# Agora items contém todos os resultados
```

**+100 XP**
</details>

---

### 💎 Q15 (100 XP): Limite de BatchWriteItem

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 15/15 - BATCHWRITEITEM      ┃
┃  Dificuldade: ⭐⭐ Intermediário         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Objetivo:** Conhecer os limites de operações em lote

**📖 Contexto:**

Link precisa escrever muitos items de uma vez. BatchWriteItem permite escrever múltiplos items de uma vez, otimizando operações em lote.

**❓ Quais são os limites de BatchWriteItem e como lidar com mais items?**

- [ ] A) 10 items por operação, fazer múltiplas chamadas se necessário
- [ ] B) 25 items por operação (máximo 16 MB total), fazer múltiplas chamadas se necessário
- [ ] C) 100 items por operação, sem necessidade de múltiplas chamadas
- [ ] D) Ilimitado, DynamoDB processa tudo automaticamente

**💡 Dica:** É menor que BatchGetItem.

<details>
<summary>💡 Ver Resposta</summary>

**✅ Resposta: B) 25 items por operação (máximo 16 MB total), fazer múltiplas chamadas se necessário**

**Motivos:**
- ✅ **Limites de BatchWriteItem:** Máximo 25 items por operação, máximo 16 MB total por operação, qualquer limite que for atingido primeiro aplica
- ✅ **Múltiplas chamadas:** Se tiver mais de 25 items, divida em lotes, cada lote pode ter até 25 items, processe lotes sequencialmente ou em paralelo, padrão comum em ETL e migrações

**❌ Por que as outras estão erradas:**
- **A)** Limite é 25, não 10
- **C)** Limite é 25, não 100 (100 é BatchGetItem)
- **D)** Há limites definidos

**🎯 Comparação:**

| Operação | Limite Items | Limite Tamanho |
|----------|--------------|----------------|
| **BatchWriteItem** | 25 | 16 MB |
| **BatchGetItem** | 100 | 16 MB |

**Exemplo:**

```python
# Processar 100 items em lotes
items = [...]  # 100 items

# Dividir em lotes de 25
for i in range(0, len(items), 25):
    batch = items[i:i+25]
    
    table.batch_writer().put_items(batch)
    # ou
    dynamodb.batch_write_item(
        RequestItems={
            'table-name': [
                {'PutRequest': {'Item': item}} for item in batch
            ]
        }
    )
```

**+100 XP**
</details>

---

## 🎉 ACADEMIA COMPLETA!

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ✨ PARABÉNS! Você dominou os fundamentos!         ┃
┃                                                     ┃
┃  🎓 Conceitos aprendidos:                           ┃
┃     ✅ SQL vs NoSQL (JOINs, schema, performance)   ┃
┃     ✅ DynamoDB (PK, SK, limites, tabelas)         ┃
┃     ✅ Partições (lógica vs física, hot partitions)┃
┃     ✅ Operações (GetItem, Query, Scan, Batch)     ┃
┃     ✅ Limites e paginação                          ┃
┃                                                     ┃
┃  Você está pronto para o Single-Table Design! ⚔️   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**XP Ganho:** 1.500 XP  
**Próximo desafio:** [Lab 2 - Single Table Design](../lab2/DESAFIOS.md)

---

## 📚 Referências

- **[DynamoDB Core Components](https://docs.aws.amazon.com/dynamodb/latest/developerguide/HowItWorks.CoreComponents.html)** - Docs oficiais
- **[Single Table Design](https://www.alexdebrie.com/posts/dynamodb-single-table/)** - Alex DeBrie
- **[Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)** - AWS

---

**Que os access patterns estejam com você! 🚀**
