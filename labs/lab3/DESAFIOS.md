# 🗼 Lab 3 - TORRE DOS GSIs

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🗼 TORRE DOS ÍNDICES SECUNDÁRIOS                   ┃
┃                                                     ┃
┃  Você dominou queries por PK!                       ┃
┃  Agora aprenda a buscar por QUALQUER atributo!     ┃
┃                                                     ┃
┃  8 desafios | 1.050 XP | ~30 minutos               ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**Total:** 8 desafios | 1.050 XP  
**Duração:** ~30 minutos  
**Dificuldade:** ⭐⭐ Intermediário → ⭐⭐⭐⭐⭐ Boss

---

## 🎮 Sistema de Pontuação

| Desafio | Tema | XP | Dificuldade |
|---------|------|----|-------------|
| Q1 | O que é um GSI? | 100 | ⭐⭐ Intermediário |
| Q2 | Para que servem os GSIs? | 100 | ⭐⭐ Intermediário |
| Q3 | GSI vs LSI: Diferença Principal | 100 | ⭐⭐⭐ Avançado |
| Q4 | Quando usar LSI ao invés de GSI? | 100 | ⭐⭐⭐ Avançado |
| Q5 | Atualizações Assíncronas do GSI | 150 | ⭐⭐⭐⭐ Expert |
| Q6 | Eventual Consistency em GSIs | 150 | ⭐⭐⭐⭐ Expert |
| Q7 | Importância da Partition Key | 150 | ⭐⭐⭐⭐⭐ Boss |
| Q8 | Query em GSI HIERARCHY | 200 | ⭐⭐⭐⭐ Expert |

**Total Possível:** 1.050 XP

---

## 🎯 Objetivo da Fase

Até agora, todas as suas queries usaram PK (Partition Key) para buscar dados:
- `EMPLOYEE#uuid` → buscar dados do employee
- `PLAN#uuid` → buscar dados do plano
- `CERTIFICATE#uuid` → buscar saldos

**Mas e se você quiser buscar:**
- Todos os employees com `status=active`?
- Todos os planos da empresa "Tech Corp"?
- Todos os usuários com um CPF específico?

❌ **Sem GSI:** Você precisaria fazer **Scan** (varrer TODA a tabela) = LENTO e CARO!  
✅ **Com GSI:** Você faz **Query** (busca eficiente) = RÁPIDO! ⚡

---

### 💎 Q1 (100 XP): O que é um GSI?

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 1/7                         ┃
┃  💎 Recompensa: 100 XP                  ┃
┃  Dificuldade: ⭐⭐ Intermediário        ┃
┃  ⏱️ Tempo: 1min 30s                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Objetivo:** Entender o conceito fundamental de Global Secondary Index

**📖 Contexto:**

Zelda está gerenciando o sistema de funcionários da Aurora Benefits. A tabela principal usa `EMPLOYEE#uuid` como PK, mas ela precisa buscar funcionários por email para validar logins.

No SQL isso seria simples:
```sql
SELECT * FROM employees WHERE email = 'zelda@email.com'
-- Index automático em email!
```

Mas no DynamoDB, você só pode fazer Query eficiente pela PK/SK principal.

**❓ O que é um Índice Global Secundário (GSI) no DynamoDB?**

- [ ] A) Um índice usado apenas para ordenar os dados da tabela principal
- [ ] B) Um índice que permite consultar dados usando uma nova chave de partição e/ou ordenação
- [ ] C) Uma tabela nova criada automaticamente para cada entidade
- [ ] D) Um recurso utilizado apenas para aumentar a capacidade de escrita

**💡 Dica:** Pense no GSI como uma nova forma de acessar seus dados sem mudar a tabela original.

<details>
<summary>💡 Ver Resposta</summary>

**✅ Resposta: B) Um índice que permite consultar dados usando uma nova chave de partição e/ou ordenação**

**Motivos:**
- ✅ **GSI cria uma "view" alternativa** da sua tabela com novas chaves
- ✅ **Você pode definir PK e SK diferentes** da tabela principal
- ✅ **Query eficiente** em atributos que não são PK/SK da tabela base
- ✅ **Não altera a estrutura original** da tabela

**Exemplo Prático:**

```
Tabela Principal:
  PK: EMPLOYEE#650e8400-e29b-41d4-a716-446655440010
  SK: SUMMARY
  email: zelda@email.com
  name: Zelda
  status: active

GSI "EmailIndex":
  GSI_PK: zelda@email.com  ← Agora é chave!
  GSI_SK: EMPLOYEE#650e8400...
  (outros atributos projetados)
```

**Query no GSI:**
```python
# Buscar employee por email (RÁPIDO!)
response = table.query(
    IndexName='EmailIndex',
    KeyConditionExpression=Key('email').eq('zelda@email.com')
)
# ⚡ 5ms, 1 RCU apenas!
```

**❌ Por que as outras estão erradas:**

**Opção A:** "Um índice usado apenas para ordenar os dados"
- ❌ GSI não é só para ordenação! Ele permite buscar por novos atributos que não são PK/SK da tabela principal. A ordenação é apenas um dos benefícios.

**Opção C:** "Uma tabela nova criada automaticamente"
- ❌ GSI não é uma tabela separada! É um índice da mesma tabela que cria uma view alternativa dos dados sem duplicação completa.

**Opção D:** "Um recurso para aumentar capacidade de escrita"
- ❌ GSI é focado em melhorar queries de leitura, não aumenta capacidade de escrita. Na verdade, escrever no GSI consome WCUs adicionais.

**+100 XP**
</details>

---

### 💎 Q2 (100 XP): Para que servem os GSIs?

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 2/7                         ┃
┃  💎 Recompensa: 100 XP                  ┃
┃  Dificuldade: ⭐⭐ Intermediário        ┃
┃  ⏱️ Tempo: 1min 30s                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Objetivo:** Compreender os casos de uso reais dos GSIs

**📖 Contexto:**

Zelda modelou a tabela `aurora-benefits` seguindo o padrão Single Table Design. Agora ela percebe que precisa buscar dados de formas diferentes:
- Buscar certificados por CPF do titular
- Buscar todos os planos de uma empresa específica  
- Buscar funcionários por status (active/inactive)

Ela está em dúvida: "Devo criar tabelas separadas? Fazer Scan? Ou usar GSI?"

**❓ Para que servem os GSIs no DynamoDB?**

- [ ] A) Para substituir totalmente a tabela principal
- [ ] B) Para permitir consultas usando joins entre entidades
- [ ] C) Para criar novos padrões de acesso sem alterar a tabela original
- [ ] D) Para armazenar backups dos dados

**💡 Dica:** Pense nos GSIs como atalhos de busca criados para responder a perguntas diferentes.

<details>
<summary>💡 Ver Resposta</summary>

**✅ Resposta: C) Para criar novos padrões de acesso sem alterar a tabela original**

**Motivos:**
- ✅ **Novos access patterns** sem reestruturar a tabela base
- ✅ **Queries eficientes** em atributos não-PK da tabela principal
- ✅ **Flexibilidade** para adicionar índices depois que a tabela já existe
- ✅ **Mantém Single Table Design** sem precisar criar múltiplas tabelas

**Exemplo Real da Aurora Labs:**

```python
# Access Pattern 1: Buscar certificado por ID (usa tabela principal)
response = table.query(
    KeyConditionExpression=Key('PK').eq('CERTIFICATE#bb0e8400...')
)

# Access Pattern 2: Buscar certificados por CPF (usa GSI!)
response = table.query(
    IndexName='CPFIndex',
    KeyConditionExpression=Key('cpf').eq('12345678900')
)
# Retorna TODOS os certificados dessa pessoa
```

**Comparação de abordagens:**

| Abordagem | Custo | Performance | Manutenção |
|-----------|-------|-------------|------------|
| **GSI** ✅ | Storage extra | Query rápida (5-10ms) | Simples |
| Scan ❌ | Lê tabela inteira | Lento (100-500ms) | Caro |
| Tabela separada ❌ | Sincronização manual | Rápido | Complexo |

**❌ Por que as outras estão erradas:**

**Opção A:** "Para substituir totalmente a tabela principal"
- ❌ GSI complementa a tabela principal, não a substitui! A tabela base continua sendo a fonte primária dos dados.

**Opção B:** "Para permitir consultas usando joins entre entidades"
- ❌ DynamoDB não tem joins nativos, e GSI não muda isso. GSI apenas permite buscar dados por atributos diferentes.

**Opção D:** "Para armazenar backups dos dados"
- ❌ GSI é para criar novos padrões de acesso (queries), não para backup. Use AWS Backup ou Point-in-Time Recovery para backups.

**+100 XP**
</details>

---

### 💎 Q3 (100 XP): GSI vs LSI - Diferença Principal

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 3/7                         ┃
┃  💎 Recompensa: 100 XP                  ┃
┃  Dificuldade: ⭐⭐⭐ Avançado           ┃
┃  ⏱️ Tempo: 1min 30s                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Objetivo:** Distinguir GSI e LSI (Local Secondary Index)

**📖 Contexto:**

Zelda leu sobre dois tipos de índices secundários no DynamoDB:
- **GSI** (Global Secondary Index)
- **LSI** (Local Secondary Index)

Ela está confusa sobre quando usar cada um. A documentação fala sobre PK, SK, mas qual é a **diferença fundamental**?

**❓ Qual a principal diferença entre GSI e LSI?**

- [ ] A) GSI usa outra capacidade de leitura; LSI não usa capacidade
- [ ] B) GSI permite nova PK; LSI usa a mesma PK da tabela principal
- [ ] C) GSI só pode ser criado na criação da tabela; LSI pode ser criado depois
- [ ] D) LSI replica todos os atributos; GSI não replica nenhum

**💡 Dica:** Um deles muda a Partition Key, o outro não.

<details>
<summary>💡 Ver Resposta</summary>

**✅ Resposta: B) GSI permite nova PK; LSI usa a mesma PK da tabela principal**

**Motivos:**
- ✅ **LSI mantém a mesma PK**, apenas troca a Sort Key
- ✅ **GSI pode ter PK e SK totalmente diferentes**
- ✅ Isso define os **casos de uso** de cada um
- ✅ GSI é mais flexível, LSI mais limitado mas tem vantagens

**Comparação Visual:**

```
┌─────────────────────────────────────────────────┐
│ TABELA PRINCIPAL                                │
├─────────────────────────────────────────────────┤
│ PK: EMPLOYEE#650e8400-e29b-41d4-a716-446655440010 │
│ SK: SUMMARY                                     │
│ name: Zelda                                     │
│ email: zelda@email.com                         │
│ hire_date: 2024-01-15                           │
└─────────────────────────────────────────────────┘
           ↓                          ↓
    ┌──────────┐              ┌──────────────┐
    │   LSI    │              │     GSI      │
    └──────────┘              └──────────────┘
         ↓                           ↓
┌────────────────────┐    ┌──────────────────────┐
│ LSI "HireDateIndex"│    │ GSI "EmailIndex"     │
├────────────────────┤    ├──────────────────────┤
│ PK: EMPLOYEE#650... │    │ PK: zelda@email.com   │
│ SK: 2024-01-15 ⬅️  │    │ SK: EMPLOYEE#650...    │
│ (mesma PK!)        │    │ (PK diferente! ✅)   │
└────────────────────┘    └──────────────────────┘
```

**Quando usar cada um:**

| Característica | GSI | LSI |
|----------------|-----|-----|
| **Mudar PK?** | ✅ Sim | ❌ Não (mesma PK) |
| **Mudar SK?** | ✅ Sim | ✅ Sim |
| **Criar depois?** | ✅ Sim | ❌ Só na criação da tabela |
| **Limit 10GB por PK?** | ❌ Não | ✅ Sim |
| **Strongly consistent?** | ❌ Não | ✅ Sim (opcional) |
| **Usa capacidade própria?** | ✅ Sim | ❌ Não (usa da tabela) |

**❌ Por que as outras estão erradas:**

**Opção A:** "GSI usa outra capacidade de leitura; LSI não usa capacidade"
- ❌ Ambos usam capacidade de leitura! GSI tem capacidade própria configurável, enquanto LSI compartilha a capacidade da tabela principal.

**Opção C:** "GSI só pode ser criado na criação da tabela; LSI pode ser criado depois"
- ❌ Está invertido! GSI pode ser criado depois que a tabela já existe, mas LSI só pode ser criado durante a criação da tabela.

**Opção D:** "LSI replica todos os atributos; GSI não replica nenhum"
- ❌ Ambos permitem escolher quais atributos projetar através das opções KEYS_ONLY, INCLUDE ou ALL.

**+100 XP**
</details>

---

### 💎 Q4 (100 XP): Quando usar LSI ao invés de GSI?

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 4/7                         ┃
┃  💎 Recompensa: 100 XP                  ┃
┃  Dificuldade: ⭐⭐⭐ Avançado           ┃
┃  ⏱️ Tempo: 1min 30s                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Objetivo:** Identificar o caso de uso ideal para LSI

**📖 Contexto:**

Zelda está modelando a entidade `CERTIFICATE#uuid` na tabela. Cada certificado tem múltiplos balances (saldos):

```
PK: CERTIFICATE#bb0e8400...
SK: BALANCE#2024-01-15  → value: 1000.00
SK: BALANCE#2024-02-15  → value: 1050.00
SK: BALANCE#2024-03-15  → value: 1100.00
```

Ela quer permitir duas formas de busca:
1. **Por data** (já funciona com SK)
2. **Por valor** (saldos ordenados do maior para o menor)

**❓ Em qual situação um LSI é mais indicado do que um GSI?**

- [ ] A) Quando você precisa ordenar os itens da mesma PK de diferentes formas
- [ ] B) Quando você quer buscar itens por atributos completamente diferentes da tabela
- [ ] C) Quando deseja armazenar grandes volumes de dados fora da tabela
- [ ] D) Quando precisa melhorar a velocidade de escrita

**💡 Dica:** LSI = mesma PK, outra ordenação.

<details>
<summary>💡 Ver Resposta</summary>

**✅ Resposta: A) Quando você precisa ordenar os itens da mesma PK de diferentes formas**

**Motivos:**
- ✅ **LSI é perfeito para ordenações alternativas** dentro da mesma partição
- ✅ **Mantém a mesma PK** mas permite SK diferente
- ✅ **Strongly consistent reads** (opção não disponível em GSI)
- ✅ Ideal para **dados relacionados** que já estão agrupados pela mesma PK

**Exemplo Prático:**

```python
# Tabela Principal: Saldos por DATA (crescente)
PK: CERTIFICATE#bb0e8400...
SK: BALANCE#2024-01-15  → value: 1000.00
SK: BALANCE#2024-02-15  → value: 1050.00
SK: BALANCE#2024-03-15  → value: 1100.00
SK: BALANCE#2024-04-15  → value: 900.00  # Caiu!

# LSI "ValueIndex": Mesma PK, ordena por VALOR
PK: CERTIFICATE#bb0e8400...     (mesma!)
SK: 1100.00  → ref: 2024-03-15  (maior valor)
SK: 1050.00  → ref: 2024-02-15
SK: 1000.00  → ref: 2024-01-15
SK: 900.00   → ref: 2024-04-15  (menor valor)
```

**Queries possíveis:**

```python
# Query 1: Últimos 3 meses (usa tabela principal)
response = table.query(
    KeyConditionExpression=Key('PK').eq('CERTIFICATE#bb0e...') &
                          Key('SK').between('BALANCE#2024-01', 'BALANCE#2024-03')
)

# Query 2: Top 5 maiores saldos (usa LSI!)
response = table.query(
    IndexName='ValueIndex',
    KeyConditionExpression=Key('PK').eq('CERTIFICATE#bb0e...'),
    ScanIndexForward=False,  # Ordem decrescente
    Limit=5
)
```

**Quando NÃO usar LSI:**
- ❌ Se você precisa buscar por **PK diferente** → use GSI
- ❌ Se a tabela **já existe** e você esqueceu de criar o LSI → use GSI
- ❌ Se os dados ultrapassam **10GB por partição** → use GSI

**❌ Por que as outras estão erradas:**

**Opção B:** "Quando você quer buscar itens por atributos completamente diferentes da tabela"
- ❌ Para buscar por atributos completamente diferentes você precisa de GSI, que permite definir uma nova PK.

**Opção C:** "Quando deseja armazenar grandes volumes de dados fora da tabela"
- ❌ LSI não armazena dados 'fora' da tabela! É um índice local que referencia a mesma partição da tabela principal.

**Opção D:** "Quando precisa melhorar a velocidade de escrita"
- ❌ LSI não melhora velocidade de escrita. Na verdade, compartilha a mesma capacidade de throughput da tabela principal.

**+100 XP**
</details>

---

### 💎 Q5 (150 XP): Atualizações Assíncronas do GSI

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 5/7                         ┃
┃  💎 Recompensa: 150 XP                  ┃
┃  Dificuldade: ⭐⭐⭐⭐ Expert          ┃
┃  ⏱️ Tempo: 1min 30s                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Objetivo:** Entender o modelo de consistência dos GSIs

**📖 Contexto:**

Zelda está testando o sistema de funcionários. Ela faz o seguinte teste:

```python
# 1. Atualiza status do employee na tabela
table.update_item(
    Key={'PK': 'EMPLOYEE#650e8400-e29b-41d4-a716-446655440010', 'SK': 'SUMMARY'},
    UpdateExpression='SET #status = :status',
    ExpressionAttributeNames={'#status': 'status'},
    ExpressionAttributeValues={':status': 'inactive'}
)
print("✅ Employee marcado como inativo na tabela principal!")

# 2. Imediatamente busca no GSI por status
response = table.query(
    IndexName='StatusIndex',
    KeyConditionExpression=Key('status').eq('active')
)
print(f"Employees ativos: {len(response['Items'])}")
# 🤔 A Zelda AINDA aparece como ativa no GSI! Por quê?
```

**❓ Como funciona a atualização dos GSIs quando um item da tabela principal muda?**

- [ ] A) Os GSIs são atualizados instantaneamente e de forma síncrona
- [ ] B) Os GSIs nunca são atualizados automaticamente
- [ ] C) Os GSIs são atualizados de forma assíncrona, podendo ter pequeno atraso
- [ ] D) O desenvolvedor precisa atualizar o GSI manualmente

**💡 Dica:** Pense na replicação: rápida, mas não imediata.

<details>
<summary>💡 Ver Resposta</summary>

**✅ Resposta: C) Os GSIs são atualizados de forma assíncrona, podendo ter pequeno atraso**

**Motivos:**
- ✅ **Eventual Consistency** é o modelo padrão para GSIs
- ✅ Atualizações se propagam em **milissegundos** (geralmente < 100ms)
- ✅ Isso permite **alta performance** nas escritas
- ✅ É um **trade-off consciente** para escalar horizontalmente

**Linha do Tempo da Atualização:**

```
t=0ms    ┃ UpdateItem na tabela principal
         ┃ ✅ Item atualizado: status = "inactive"
         ┃
t=5ms    ┃ Query no GSI
         ┃ ⚠️  GSI ainda mostra: status = "active"
         ┃ (propagação não chegou ainda!)
         ┃
t=50ms   ┃ DynamoDB propaga para GSI
         ┃ ✅ GSI atualizado: status = "inactive"
         ┃
t=100ms  ┃ Nova Query no GSI
         ┃ ✅ Agora retorna dados corretos!
```

**Impacto Real:**

```python
# ❌ PROBLEMA: Read-after-write pode retornar dado antigo
def marcar_inativo_e_verificar(employee_id):
    # 1. Atualiza na tabela
    table.update_item(
        Key={'PK': f'EMPLOYEE#{employee_id}', 'SK': 'SUMMARY'},
        UpdateExpression='SET #status = :inactive',
        ExpressionAttributeNames={'#status': 'status'},
        ExpressionAttributeValues={':inactive': 'inactive'}
    )
    
    # 2. IMEDIATAMENTE verifica no GSI
    response = table.query(
        IndexName='StatusIndex',
        KeyConditionExpression=Key('status').eq('inactive')
    )
    
    # ⚠️  Employee pode NÃO aparecer ainda!
    # Propagação leva alguns milissegundos
    
# ✅ SOLUÇÃO: Read from table principal ou aguardar
def marcar_inativo_e_verificar_correto(employee_id):
    # 1. Atualiza
    table.update_item(...)
    
    # 2a. Ler da TABELA PRINCIPAL (sempre consistente)
    response = table.get_item(
        Key={'PK': f'EMPLOYEE#{employee_id}', 'SK': 'SUMMARY'}
    )
    # ✅ Sempre retorna dado atualizado
    
    # OU
    
    # 2b. Aguardar propagação (se precisar usar GSI)
    import time
    time.sleep(0.1)  # 100ms é mais que suficiente
    response = table.query(IndexName='StatusIndex', ...)
```

**Quando isso importa:**
- 🔥 **Critical:** Sistemas financeiros (saldo não pode estar desatualizado!)
- ⚠️  **Cuidado:** Read-after-write imediato
- ✅ **OK:** Listagens, dashboards, relatórios

**❌ Por que as outras estão erradas:**

**Opção A:** "Os GSIs são atualizados instantaneamente e de forma síncrona"
- ❌ Não é síncrono! Isso seria muito lento e caro, prejudicando a performance de escrita da tabela.

**Opção B:** "Os GSIs nunca são atualizados automaticamente"
- ❌ GSI é atualizado automaticamente pelo DynamoDB. Você não controla quando isso acontece.

**Opção D:** "O desenvolvedor precisa atualizar o GSI manualmente"
- ❌ A atualização não é manual. O DynamoDB gerencia automaticamente a propagação das mudanças para os GSIs.

**Performance Típica:**
- ⚡ p50: **10-30ms** de propagação
- ⚡ p99: **50-100ms** de propagação  
- 💀 Casos extremos: pode chegar a **1 segundo**

**+150 XP**
</details>

---

### 💎 Q6 (150 XP): Eventual Consistency em GSIs

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 6/7                         ┃
┃  💎 Recompensa: 150 XP                  ┃
┃  Dificuldade: ⭐⭐⭐⭐ Expert          ┃
┃  ⏱️ Tempo: 1min 30s                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Objetivo:** Aplicar o conceito de eventual consistency em cenários reais

**📖 Contexto:**

Link está desenvolvendo uma funcionalidade crítica: **processar contribuição de funcionário**.

O fluxo é:
1. Employee faz contribuição de R$ 500
2. System atualiza saldo na tabela → `balance = 10.500`
3. Imediatamente redireciona para tela que busca saldo via GSI
4. 😱 Tela mostra `balance = 10.000` (saldo ANTIGO!)

Link está recebendo reclamações: "O sistema está com bug! Meu dinheiro sumiu!"

**❓ O que pode acontecer ao consultar um GSI logo após atualizar um item na tabela principal?**

- [ ] A) A consulta sempre retorna dados duplicados
- [ ] B) Pode haver um pequeno atraso antes que o índice reflita a alteração
- [ ] C) O GSI pode ser apagado automaticamente
- [ ] D) A tabela principal fica bloqueada até o GSI ser sincronizado

**💡 Dica:** Lembre-se: eventual consistency.

<details>
<summary>💡 Ver Resposta</summary>

**✅ Resposta: B) Pode haver um pequeno atraso antes que o índice reflita a alteração**

**Motivos:**
- ✅ **Eventual consistency** significa que o GSI **eventualmente** estará atualizado
- ✅ O delay é normalmente **< 100ms**, mas pode variar
- ✅ Isso é **by design**, não é um bug
- ✅ Você precisa **projetar a aplicação** considerando isso

**O Problema de Link:**

```python
# ❌ CÓDIGO COM PROBLEMA
def processar_contribuicao(employee_id, valor):
    # 1. Atualiza saldo na tabela
    table.update_item(
        Key={'PK': f'CERTIFICATE#{employee_id}', 'SK': 'BALANCE#2024-12'},
        UpdateExpression='SET balance = balance + :valor',
        ExpressionAttributeValues={':valor': valor}
    )
    # ✅ Tabela principal: balance = 10.500
    
    # 2. Redireciona para tela de confirmação
    return redirect('/dashboard')  # Chama frontend

# Frontend faz query no GSI (PROBLEMA!)
def get_dashboard_data(employee_id):
    response = table.query(
        IndexName='CertificateBalanceIndex',
        KeyConditionExpression=Key('certificate_id').eq(employee_id)
    )
    # ⚠️  GSI ainda não propagou: balance = 10.000 (antigo!)
    # 😱 Usuário vê saldo ERRADO!
```

**✅ SOLUÇÕES:**

**Solução 1: Ler da tabela principal (mais confiável)**
```python
def get_dashboard_data(employee_id):
    # Não usa GSI, usa GetItem direto na tabela
    response = table.get_item(
        Key={'PK': f'CERTIFICATE#{employee_id}', 'SK': 'BALANCE#2024-12'}
    )
    # ✅ Sempre retorna dado atualizado (strongly consistent)
```

**Solução 2: Retornar dado na resposta (evita round-trip)**
```python
def processar_contribuicao(employee_id, valor):
    response = table.update_item(
        Key={'PK': f'CERTIFICATE#{employee_id}', 'SK': 'BALANCE#2024-12'},
        UpdateExpression='SET balance = balance + :valor',
        ExpressionAttributeValues={':valor': valor},
        ReturnValues='ALL_NEW'  # ⭐ Retorna item atualizado!
    )
    
    novo_saldo = response['Attributes']['balance']
    
    return {
        'balance': novo_saldo,  # ✅ Passa o dado correto para o frontend
        'timestamp': datetime.now()
    }
```

**Solução 3: Cache no frontend (UX melhor)**
```javascript
// Frontend atualiza otimistically
function processContribution(employeeId, amount) {
    // 1. Atualiza UI imediatamente (optimistic update)
    const currentBalance = getBalance();
    setBalance(currentBalance + amount);  // ✅ UX instantânea!
    
    // 2. Chama API
    await api.post('/contribution', { employeeId, amount });
    
    // 3. Recarrega depois (GSI já propagou)
    setTimeout(() => refreshDashboard(), 200);  // 200ms é seguro
}
```

**Solução 4: Usar LSI ao invés de GSI (se possível)**
```python
# LSI permite strongly consistent reads!
response = table.query(
    IndexName='LocalBalanceIndex',  # LSI, não GSI
    KeyConditionExpression=Key('PK').eq(f'CERTIFICATE#{id}'),
    ConsistentRead=True  # ✅ Leitura consistente!
)
```

**Quando NÃO é problema:**
- ✅ Listagens gerais (pequeno atraso é aceitável)
- ✅ Dashboards agregados
- ✅ Relatórios não-críticos
- ✅ Pesquisas em logs

**Quando É problema crítico:**
- 🔥 Saldos financeiros
- 🔥 Status de pagamento
- 🔥 Dados sensíveis que aparecem imediatamente após update

**❌ Por que as outras estão erradas:**

**Opção A:** "A consulta sempre retorna dados duplicados"
- ❌ A consulta não retorna dados duplicados! Ela retorna o dado antigo (antes da atualização) até que a propagação seja concluída.

**Opção C:** "O GSI pode ser apagado automaticamente"
- ❌ GSI nunca é apagado automaticamente! Ele permanece sincronizado com a tabela através de eventual consistency.

**Opção D:** "A tabela principal fica bloqueada até o GSI ser sincronizado"
- ❌ A tabela principal não fica bloqueada! As escritas são assíncronas e não aguardam a sincronização do GSI.

**+150 XP**
</details>

---

### 💎 Q7 (150 XP): Importância da Partition Key (BOSS!)

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 7/7 - BOSS FINAL!           ┃
┃  💎 Recompensa: 150 XP                  ┃
┃  Dificuldade: ⭐⭐⭐⭐⭐ Boss          ┃
┃  ⏱️ Tempo: 1min 30s                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Objetivo:** Dominar o conceito de cardinality e hot partitions

**📖 Contexto:**

Zelda criou um GSI para buscar funcionários por status:

```
GSI "StatusIndex":
  PK: status (values: "active" | "inactive")
  SK: employee_id
```

A Aurora Labs tem 50.000 funcionários:
- 45.000 ativos (`status = "active"`)
- 5.000 inativos (`status = "inactive"`)

Após 1 mês em produção:
- ❌ Queries em `status = "active"` estão **lentas** (200ms+)
- ❌ Recebendo erros `ProvisionedThroughputExceededException`
- ✅ Queries em `status = "inactive"` estão **rápidas** (5ms)

O arquiteto senior alertou: **"Você criou uma HOT PARTITION! 🔥"**

**❓ Por que é importante escolher bem a Partition Key de um GSI?**

- [ ] A) Porque ela define a ordem de inserção dos dados
- [ ] B) Porque uma PK com baixa cardinalidade pode criar hotspots e reduzir performance
- [ ] C) Porque ela impede o uso de Sort Keys
- [ ] D) Porque a PK não pode ser modificada depois

**💡 Dica:** Pense no impacto de ter muitos itens com a mesma PK.

<details>
<summary>💡 Ver Resposta</summary>

**✅ Resposta: B) Porque uma PK com baixa cardinalidade pode criar hotspots e reduzir performance**

**Motivos:**
- ✅ **Alta cardinalidade** distribui dados em múltiplas partições
- ✅ **Baixa cardinalidade** concentra tudo em poucas partições (HOT!)
- ✅ **Hot partition** limita throughput (3.000 RCU / 1.000 WCU por partição física)
- ✅ DynamoDB **não pode escalar** horizontalmente se todos os dados estão em 1 partição

**O Problema de Zelda:**

```
❌ DESIGN RUIM - Baixa Cardinalidade
┌─────────────────────────────────────────┐
│ GSI "StatusIndex"                       │
├─────────────────────────────────────────┤
│ PK: "active"  → 45.000 items  🔥🔥🔥    │  ← HOT PARTITION!
│ PK: "inactive" → 5.000 items  ✅        │
└─────────────────────────────────────────┘

Resultado:
- Partição "active" recebe 90% das queries
- Throughput limitado a 3.000 RCU (por partição física)
- Throttling constante! ProvisionedThroughputExceededException
```

**Como identificar baixa cardinalidade:**

| Atributo | Valores Distintos | Cardinalidade | Adequado para PK? |
|----------|------------------|---------------|-------------------|
| `employee_id` | 50.000 | Alta ✅ | ✅ Excelente |
| `email` | 50.000 | Alta ✅ | ✅ Excelente |
| `cpf` | 50.000 | Alta ✅ | ✅ Excelente |
| `department` | 20 | Média ⚠️ | ⚠️  Cuidado |
| `status` | 2 | Baixa ❌ | ❌ Péssimo |
| `company` | 5 | Baixa ❌ | ❌ Péssimo |
| `is_active` (boolean) | 2 | Baixa ❌ | ❌ Péssimo |

**✅ SOLUÇÃO: Composite PK (aumentar cardinalidade)**

**Opção 1: Adicionar timestamp à PK**
```
GSI "StatusDateIndex":
  PK: status#YYYY-MM  (ex: "active#2024-12")
  SK: employee_id

Resultado:
- "active#2024-12" → 3.750 items (por mês)
- "active#2024-11" → 3.750 items
- ... 12 partições ao invés de 1! ✅
```

**Opção 2: Adicionar department à PK**
```
GSI "StatusDeptIndex":
  PK: status#department  (ex: "active#engineering")
  SK: employee_id

Resultado:
- "active#engineering" → 10.000 items
- "active#marketing" → 8.000 items
- "active#sales" → 12.000 items
- ... 20+ partições ao invés de 1! ✅
```

**Opção 3: Sharding manual (advanced)**
```python
import hashlib

def get_shard(employee_id, num_shards=10):
    hash_value = int(hashlib.md5(employee_id.encode()).hexdigest(), 16)
    return hash_value % num_shards

# Criar PK com shard
shard = get_shard(employee_id)
pk = f"active#{shard}"  # "active#0" até "active#9"

# Resultado: 10 partições ao invés de 1!
```

**Opção 4: Usar Sparse Index (se aplicável)**
```
GSI "ActiveOnlyIndex":
  PK: active_since  (apenas employees ativos TEM esse campo!)
  SK: employee_id

Resultado:
- Só indexa 45.000 items (ao invés de 50.000)
- PK é uma DATA (alta cardinalidade!)
- Economia de storage: 10%
```

**Métricas de Sucesso:**

```
Antes (status como PK):
┌─────────────────────────────────────────┐
│ Partition "active": 45.000 items        │
│ Throughput: 3.000 RCU max  💀           │
│ Latência p99: 250ms  🐌                 │
│ Custo: $50/mês (throttling constante)   │
└─────────────────────────────────────────┘

Depois (status#month como PK):
┌─────────────────────────────────────────┐
│ 12 partições: ~3.750 items cada         │
│ Throughput: 36.000 RCU total  ⚡⚡⚡      │
│ Latência p99: 8ms  ⚡                    │
│ Custo: $12/mês (sem throttling)  💰     │
└─────────────────────────────────────────┘

Melhoria: 12× throughput, 30× mais rápido, 4× mais barato!
```

**Regra de Ouro:**
- **Target:** 1.000-10.000 items por PK value
- **Alerta:** > 100.000 items por PK value
- **Crítico:** > 1.000.000 items por PK value

**❌ Por que as outras estão erradas:**

**Opção A:** "Porque ela define a ordem de inserção dos dados"
- ❌ PK não define ordem de inserção dos dados! A Sort Key (SK) é quem define a ordenação dos itens.

**Opção C:** "Porque ela impede o uso de Sort Keys"
- ❌ PK não impede o uso de Sort Keys! GSI pode ter tanto PK quanto SK.

**Opção D:** "Porque a PK não pode ser modificada depois"
- ❌ PK pode ser modificada recriando o GSI, mas é uma operação cara e demorada, não uma impossibilidade técnica.

**+150 XP (BOSS DEFEATED! 👑)**
</details>

---

### 💎 Q8 (200 XP): Query em GSI HIERARCHY

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ DESAFIO 8/8                         ┃
┃  💎 Recompensa: 200 XP                  ┃
┃  Dificuldade: ⭐⭐⭐⭐ Expert          ┃
┃  ⏱️ Tempo: 2min                         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**🎯 Objetivo:** Dominar queries em GSI com hierarquias complexas

**📖 Contexto:**

Na Aurora Benefits, temos um índice global chamado **HIERARCHY** que organiza as relações entre grupos, contratos e employees:

```
GSI "HIERARCHY":
  Partition Key (entity): tipo da entidade (EMPLOYEE, CONTRACT, GROUP)
  Sort Key (HIERARCHYSK): formato "group_id#contract_id"
```

**Exemplo de dados no GSI:**
```
entity: EMPLOYEE
HIERARCHYSK: GROUP-001#CONTRACT-ABC-123  → Employee da Zelda

entity: EMPLOYEE  
HIERARCHYSK: GROUP-001#CONTRACT-XYZ-456  → Employee do Link

entity: EMPLOYEE
HIERARCHYSK: GROUP-002#CONTRACT-ABC-123  → Outro employee
```

Link quer listar **todos os employees** que pertencem ao seu contrato específico `CONTRACT-ABC-123`.

**❓ Qual query está correta para buscar todos os employees de um contrato?**

- [ ] A) Query no HIERARCHY: entity = EMPLOYEE e begins_with(HIERARCHYSK, "contract#id")
- [ ] B) Query no HIERARCHY: entity = EMPLOYEE e HIERARCHYSK = "group_id#contract_id"
- [ ] C) Query direta na tabela: PK = EMPLOYEE e SK iniciando com contract#id
- [ ] D) Query no GSI1: GSI1PK = EMPLOYEE#id

**💡 Dica:** Pense em como a hierarquia está estruturada no HIERARCHYSK.

<details>
<summary>💡 Ver Resposta</summary>

**✅ Resposta: B) Query no HIERARCHY: entity = EMPLOYEE e HIERARCHYSK = "group_id#contract_id"**

**Motivos:**
- ✅ **Usa o índice correto** (HIERARCHY) com a partition key apropriada (`entity = EMPLOYEE`)
- ✅ **Formato correto do HIERARCHYSK** segue o padrão `group_id#contract_id`
- ✅ **Query eficiente** busca exatamente os employees do grupo e contrato especificados
- ✅ **Usa igualdade exata** quando você conhece tanto o grupo quanto o contrato

**Exemplo prático:**
```python
response = dynamodb.query(
    IndexName='HIERARCHY',
    KeyConditionExpression='entity = :entity AND HIERARCHYSK = :hierarchy',
    ExpressionAttributeValues={
        ':entity': 'EMPLOYEE',
        ':hierarchy': 'GROUP-001#CONTRACT-ABC-123'
    }
)
# Retorna todos os employees do GROUP-001 no CONTRACT-ABC-123
```

**❌ Por que as outras estão erradas:**

**Opção A:** "entity = EMPLOYEE e begins_with(HIERARCHYSK, 'CONTRACT#id')"
- ❌ O formato do HIERARCHYSK é `group_id#contract_id`, NÃO começa com `CONTRACT#`! 
- ❌ O correto seria `begins_with(HIERARCHYSK, 'GROUP-001#')` para buscar por grupo, não por contrato.

**Opção C:** "Query direta na tabela: PK = EMPLOYEE e SK iniciando com CONTRACT#id"
- ❌ PK não é genérico como "EMPLOYEE", seria algo como `EMPLOYEE#uuid` específico.
- ❌ Você não pode fazer query com PK genérico no DynamoDB - precisa de um valor específico de PK.

**Opção D:** "Query no GSI1: GSI1PK = EMPLOYEE#id"
- ❌ Isso busca um employee ESPECÍFICO por ID, não todos os employees de um contrato!
- ❌ GSI1 tem estrutura diferente e não é otimizado para esse access pattern de hierarquia.

**💡 Observação Importante:**

Se você precisar buscar employees de um contrato **em múltiplos grupos**, esta solução só retorna de um grupo específico. Nesse caso, você precisaria:

1. **Fazer múltiplas queries** (uma por grupo conhecido)
2. **Redesenhar o GSI** para ter `contract_id` antes de `group_id` no SK
3. **Criar um GSI adicional** específico para esse access pattern

**+200 XP**
</details>

---

## 🎉 LAB 3 COMPLETO!

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ✨ CONQUISTA DESBLOQUEADA!                         ┃
┃                                                     ┃
┃  🗼 GSI Master                                       ┃
┃                                                     ┃
┃  Você dominou Global Secondary Indexes!             ┃
┃  Agora pode buscar por QUALQUER atributo! 🔓       ┃
┃                                                     ┃
┃  🎯 1.050 XP conquistados                           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 🎓 Conceitos Dominados

- ✅ **O que é GSI** - Índice global para queries alternativas
- ✅ **Para que serve GSI** - Novos access patterns sem alterar a tabela
- ✅ **GSI vs LSI** - Global vs Local, PK diferente vs PK igual
- ✅ **Quando usar LSI** - Ordenações alternativas na mesma partição
- ✅ **Atualizações assíncronas** - Eventual consistency e propagação
- ✅ **Consistency models** - Trade-offs entre consistência e performance
- ✅ **Hot partitions** - Cardinality, sharding, e design de PK

---

## 📊 Comparação Final

| Recurso | Tabela Principal | GSI | LSI |
|---------|-----------------|-----|-----|
| **PK** | Definida | Nova PK | Mesma PK |
| **SK** | Opcional | Nova SK | Nova SK |
| **Criar depois?** | N/A | ✅ Sim | ❌ Não |
| **Consistency** | Strong | Eventual | Strong (opcional) |
| **Limit 10GB/PK** | Sim | Não | Sim |
| **Throughput** | Próprio | Próprio | Compartilhado |
| **Uso** | Access pattern principal | Queries alternativas | Ordenações alternativas |

---

## 📚 Referências

- **AWS Docs:** [Global Secondary Indexes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html)
- **Best Practices:** [GSI Design](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-indexes-general.html)
- **Sharding Strategies:** [Distributing Workloads](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-sharding.html)

---

**⚡ XP Total:** 950  
**🎯 Badge:** 🗼 GSI Master  
**⏱️ Tempo:** ~30 minutos  
**🗺️ Status:** ✅ Completo!
