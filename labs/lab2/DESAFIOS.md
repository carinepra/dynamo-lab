# 🎩 Lab 2 - SINGLE TABLE DESIGN COMPLETO

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🎩 ACADEMIA DO SINGLE TABLE DESIGN                 ┃
┃                                                     ┃
┃  Você dominou os fundamentos! Agora é hora de      ┃
┃  construir com access patterns, hierarquias e      ┃
┃  queries avançadas!                                ┃
┃                                                     ┃
┃  13 desafios | 1.870 XP | ~50 minutos              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**Total:** 13 desafios | 1.870 XP  
**Duração:** ~50 minutos  
**Dificuldade:** ⭐⭐ Intermediário → ⭐⭐⭐⭐⭐ Expert

---

## 🎮 Sistema de Pontuação

### PARTE 1: Arquitetura & Modelagem (520 XP)
| Desafio | Tema | XP | Dificuldade |
|---------|------|----|-------------|
| Q1 | Access Pattern First | 80 | ⭐ Iniciante |
| Q2 | Single Table Design | 100 | ⭐⭐⭐ Avançado |
| Q3 | Hierarquias 1-to-Many | 120 | ⭐⭐⭐⭐ Expert |
| Q4 | Denormalização | 100 | ⭐⭐⭐⭐ Expert |
| Q5 | Problema N+1 | 120 | ⭐⭐⭐⭐⭐ Expert |

### PARTE 2: Queries & Performance (400 XP)
| Desafio | Tema | XP | Dificuldade |
|---------|------|----|-------------|
| Q6 | Ordenação de Resultados | 100 | ⭐⭐ Intermediário |
| Q7 | Buscar Range de Dados | 100 | ⭐⭐⭐ Avançado |
| Q8 | Limitar Quantidade de Resultados | 100 | ⭐⭐ Intermediário |
| Q9 | Filtrar por Atributos Não-Chave | 100 | ⭐⭐⭐ Avançado |

### PARTE 3: Patterns Avançados (950 XP)
| Desafio | Tema | XP | Dificuldade |
|---------|------|----|-------------|
| Q10 | Home do App Completa | 200 | ⭐⭐⭐⭐ Expert |
| Q11 | Detalhes Completos do Plano | 250 | ⭐⭐⭐⭐ Expert |
| Q12 | Buscar Último Saldo | 300 | ⭐⭐⭐⭐⭐ Expert |
| Q13 | Histórico dos Últimos Meses | 200 | ⭐⭐⭐⭐ Expert |

**Total Possível:** 1.870 XP

---

## PARTE 1: Arquitetura & Modelagem

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📜 GUILDA DOS ARQUITETOS                           ┃
┃                                                     ┃
┃  No DynamoDB, você modela pelos USOS, não pelas     ┃
┃  entidades! Esta é a diferença FUNDAMENTAL!         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

### 💎 Q1 (80 XP): Access Pattern First

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 1/13                        ┃
┃  Dificuldade: ⭐ Iniciante              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**📖 Conceito:**

No SQL, você modela entidades primeiro e depois escreve queries. No DynamoDB, é o **inverso**!

**❓ Qual o primeiro passo ao modelar uma tabela DynamoDB?**

- [ ] A) Criar as tabelas (Employee, Plan, Certificate)
- [ ] B) Listar os access patterns (queries que serão feitas)
- [ ] C) Definir PK e SK genéricos
- [ ] D) Normalizar os dados (3NF)

**💡 Conceito-chave:** Access Pattern First! A estrutura é otimizada para queries específicas.

---

### 💎 Q2 (100 XP): Single Table Design

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 2/13                        ┃
┃  Dificuldade: ⭐⭐⭐ Avançado           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**📖 Conceito:**

Single Table Design = múltiplas entidades na mesma tabela DynamoDB!

**❓ Como organizar Employee, Plan e Certificate em uma única tabela?**

- [ ] A) 3 tabelas DynamoDB (employees, plans, certificates)
- [ ] B) 1 tabela com atributo 'type' (EMPLOYEE, PLAN, CERTIFICATE)
- [ ] C) 1 tabela com PK/SK hierárquicos (EMPLOYEE#uuid → PLAN#uuid)
- [ ] D) 3 tabelas + 1 tabela de relacionamentos

**💡 Conceito-chave:** PK e SK com prefixos permitem queries eficientes.

---

### 💎 Q3 (120 XP): Hierarquias 1-to-Many

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 3/13                        ┃
┃  Dificuldade: ⭐⭐⭐⭐ Expert          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**📖 Conceito:**

Hierarquias pai-filho (1-to-Many) são modeladas com prefixos no Sort Key.

**❓ 1 Employee tem N Plans. Cada Plan tem M Certificates. Qual modelagem atende:**
- Listar o plano de um employee
- Listar o certificado de um plano
- Buscar 1 certificate específico (GetItem direto)

- [ ] A) PK=EMPLOYEE#uuid SK=PLAN#uuid e PK=PLAN#uuid SK=CERTIFICATE#uuid
- [ ] B) PK=EMPLOYEE#uuid SK=type (type='PLAN' ou 'CERTIFICATE')
- [ ] C) PK=uuid SK=parent_uuid
- [ ] D) PK=EMPLOYEE#uuid SK tudo denormalizado em 1 item

**💡 Conceito-chave:** Cada filho vira parent do próximo nível.

---

### 💎 Q4 (100 XP): Denormalização

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 4/13                        ┃
┃  Dificuldade: ⭐⭐⭐⭐ Expert          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**📖 Conceito:**

Denormalização = duplicar dados para evitar queries adicionais.

**Campo company_name:** 1000 leituras/dia, 1 escrita/ano, 10.000 employees.

**❓ Denormalizar (copiar para 10k items) ou normalizar (1 item + query extra)?**

- [ ] A) DENORMALIZAR (copiar para 10k items)
- [ ] B) NORMALIZAR (1 item + query extra)
- [ ] C) Cache Redis
- [ ] D) Depende do tamanho do campo

**💡 Conceito-chave:** Ratio leituras/escritas > 100 = DENORMALIZAR!

---

### 💎 Q5 (120 XP): Problema N+1

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 5/13                        ┃
┃  Dificuldade: ⭐⭐⭐⭐⭐ Expert        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**📖 Conceito:**

Home do app lista 100 funcionários + 3 planos cada.
- SQL: 1 query de 280ms
- DynamoDB: 100 queries paralelas de 10ms cada

**❓ Qual é mais rápido?**

- [ ] A) SQL (1 query vs 100)
- [ ] B) DynamoDB (100 queries paralelas = ~10ms total)
- [ ] C) Empate (280ms vs 1000ms)
- [ ] D) Depende do volume da tabela

**💡 Conceito-chave:** Paralelismo! 100 queries paralelas = MAX(10ms), não soma!

---

## PARTE 2: Queries & Performance

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚡ MISSÕES DE OPERAÇÕES                            ┃
┃                                                     ┃
┃  Você aprendeu os conceitos de arquitetura!         ┃
┃  Agora é hora de EXECUTAR queries reais!            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

### 💎 Q6 (100 XP): Ordenação de Resultados

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 6/13                        ┃
┃  Dificuldade: ⭐⭐ Intermediário        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**📖 Cenário:**

Você quer listar certificados em ordem DECRESCENTE (mais recente primeiro).

**❓ Qual parâmetro usar?**

- [ ] A) ScanIndexForward=true (ordem crescente, padrão)
- [ ] B) ScanIndexForward=false (ordem decrescente)
- [ ] C) Limit=1 e Order='DESC'
- [ ] D) Fazer Scan e ordenar no código da aplicação

**💡 Conceito-chave:** ScanIndexForward controla a direção da ordenação.

---

### 💎 Q7 (100 XP): Buscar Range de Dados

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 7/13                        ┃
┃  Dificuldade: ⭐⭐⭐ Avançado           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**📖 Cenário:**

Listar saldos apenas do primeiro semestre de 2024 (Jan a Jun).
SKs: `BALANCE#2024-01`, `BALANCE#2024-02`, ..., `BALANCE#2024-12`

**❓ Como buscar apenas os saldos de Jan-Jun?**

- [ ] A) Query com SK begins_with 'BALANCE#' + filtrar no código
- [ ] B) Query com SK between 'BALANCE#2024-01' AND 'BALANCE#2024-06'
- [ ] C) GetItem para cada mês (6 requisições separadas)
- [ ] D) Query sem SK + FilterExpression no mês

**💡 Conceito-chave:** BETWEEN permite queries por range no Sort Key.

---

### 💎 Q8 (100 XP): Limitar Quantidade de Resultados

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 8/13                        ┃
┃  Dificuldade: ⭐⭐ Intermediário        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**📖 Cenário:**

Home do app quer apenas os 5 planos mais recentes (ela tem 10 planos).

**❓ Como limitar o número de resultados retornados?**

- [ ] A) Query sem mudanças + filtrar no código (pegar só 5 do array)
- [ ] B) Query com Limit=5 (DynamoDB retorna apenas 5)
- [ ] C) Query com FilterExpression limitando a 5
- [ ] D) Fazer 5 GetItem separados para cada plano

**💡 Conceito-chave:** Limit economiza RCU e banda ao retornar menos items.

---

### 💎 Q9 (100 XP): Filtrar por Atributos Não-Chave

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 9/13                        ┃
┃  Dificuldade: ⭐⭐⭐ Avançado           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**📖 Cenário:**

Listar apenas planos com `status='ACTIVE'`. Status NÃO é chave.

**❓ Como filtrar resultados por um atributo que não é chave?**

- [ ] A) Query com SK begins_with 'PLAN#' + filtrar status no código
- [ ] B) Query com SK begins_with 'PLAN#' + FilterExpression='status = ACTIVE'
- [ ] C) GetItem para cada plano e verificar status
- [ ] D) Scan na tabela inteira com FilterExpression='status = ACTIVE'

**💡 Conceito-chave:** FilterExpression filtra DEPOIS da Query, mas NÃO economiza RCU!

---

## PARTE 3: Patterns Avançados

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🎩 CÂMARA DA MAGIA SINGLE-TABLE                    ┃
┃                                                     ┃
┃  Os desafios finais te aguardam!                    ┃
┃  Domine Single Table Magic e Séries Temporais! 🔥  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

### 💎 Q10 (200 XP): Home do App Completa

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 10/13                       ┃
┃  Dificuldade: ⭐⭐⭐⭐ Expert          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Missão:** Link faz login. Mostre dados + planos em 1 QUERY!

**❓ Como fazer?**

- [ ] A) 2 queries: GetItem para employee, Query para planos
- [ ] B) 1 Query com PK=EMPLOYEE#uuid (retorna SUMMARY + todos PLAN#*)
- [ ] C) 1 Scan filtrando por employee_uuid
- [ ] D) Denormalizar tudo em 1 item gigante

**💡 Single Table Magic:** 1 query, 3 items, 2 types diferentes!

---

### 💎 Q11 (250 XP): Detalhes Completos do Plano

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 11/13                       ┃
┃  Dificuldade: ⭐⭐⭐⭐ Expert          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Missão:** Buscar TUDO do plano: SUMMARY + PROPOSAL + DOCUMENT + CERTIFICATEs

**❓ Como fazer em 1 QUERY?**

- [ ] A) 4 queries separadas, uma para cada tipo
- [ ] B) 1 Query com PK=PLAN#uuid (retorna todos os tipos)
- [ ] C) 1 Scan com FilterExpression por plan_uuid
- [ ] D) BatchGetItem para cada item

**💡 Single Table Magic:** 5 items, 5 types diferentes, 1 query!

---

### 💎 Q12 (300 XP): Buscar Último Saldo

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 12/13                       ┃
┃  Dificuldade: ⭐⭐⭐⭐⭐ Expert        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Missão CRÍTICA:** Buscar o saldo MAIS RECENTE de um certificado!

**❓ Como fazer sem ORDER BY?**

- [ ] A) Scan toda tabela, ordenar no cliente, pegar primeiro
- [ ] B) Query com ScanIndexForward=false e Limit=1
- [ ] C) GetItem com SK='BALANCE#latest'
- [ ] D) Query com BETWEEN pegando todos saldos e ordenar no código

**💡 Query Reversa:** ScanIndexForward=false + Limit=1 = Pattern MAIS USADO!

---

### 💎 Q13 (200 XP): Histórico dos Últimos Meses

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 13/13                       ┃
┃  Dificuldade: ⭐⭐⭐⭐ Expert          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Missão:** Buscar saldos de set/out/nov 2024 (últimos 3 meses)

**❓ Qual operador usar?**

- [ ] A) SK = 'BALANCE#2024-09' OR SK = 'BALANCE#2024-10' OR SK = 'BALANCE#2024-11'
- [ ] B) SK >= 'BALANCE#2024-09-01'
- [ ] C) SK begins_with('BALANCE#2024')
- [ ] D) FilterExpression com data >= '2024-09-01'

**💡 Operador >=:** Funciona no SK! Retorna todos a partir de set/2024.

---

## 🎉 LAB 2 COMPLETO!

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ✨ CONQUISTAS DESBLOQUEADAS!                        ┃
┃                                                     ┃
┃  🎨 Arquiteto de Access Patterns                    ┃
┃  ⚡ Query Master                                     ┃
┃  🎩 Arquiteto Single Table                          ┃
┃                                                     ┃
┃  Você dominou Single Table Design COMPLETO!         ┃
┃  Agora está pronto para os GSIs! 🗼                 ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 🎓 Conceitos Dominados

### Arquitetura
- ✅ **Access Pattern First** (modele pelos USOS!)
- ✅ **Single Table Design** (múltiplas entidades)
- ✅ **Hierarquias 1-to-Many** (begins_with)
- ✅ **Denormalização** (trade-offs)
- ✅ **Problema N+1** (queries paralelas)

### Queries
- ✅ **Ordenação** (ScanIndexForward)
- ✅ **Ranges** (BETWEEN)
- ✅ **Limite** (Limit)
- ✅ **Filtros** (FilterExpression)

### Patterns Avançados
- ✅ **Single Table Magic** - Query só com PK
- ✅ **Query Reversa** - ScanIndexForward=false + Limit=1
- ✅ **Séries Temporais** - operador >=
- ✅ **SK com YYYY-MM-DD** - Ordenação natural

---

**⚡ XP Total:** 1.870  
**🎯 Badge:** 🎩 Arquiteto Single Table  
**⏱️ Tempo:** ~50 minutos  
**🗺️ Próximo:** Lab 3 - Global Secondary Indexes (GSI)
