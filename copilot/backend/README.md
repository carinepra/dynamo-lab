# ⚔️ DynamoDB Quest - Backend API

**Backend FastAPI** para quiz gamificado. Em produção interna, roda em `QUIZ_MODE=closed`: apenas questões fechadas (`multiple_choice`) com gabarito determinístico, sem OpenAI obrigatória e sem execução de código do usuário.

## Produção Interna

Configuração padrão recomendada:

```bash
QUIZ_MODE=closed
DYNAMODB_EXECUTION_ENABLED=false
OPENAI_API_KEY=
CORS_ORIGINS=http://localhost:17080
```

Validação backend sem depender de Python instalado no host:

```bash
make backend-test-docker
```

Sem `make`, rode o equivalente a partir da raiz do projeto:

```bash
docker compose build backend
docker compose run --rm --no-deps -v ./copilot/backend/tests:/app/tests:ro backend sh -c "python -m py_compile src/quiz/question_repository.py src/validators/hybrid_validator.py src/validators/dynamodb_executor.py src/api/quiz_routes.py src/models/schemas.py tests/test_question_repository.py tests/test_hybrid_validator.py && python -m pytest --tb=short"
```

Operação:

```bash
# Subir stack
docker-compose up -d

# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Health checks
curl http://localhost:17091/health
curl http://localhost:17080/
```

Backup e restore do SQLite:

```bash
# Backup
cp copilot/backend/data/quiz.db copilot/backend/data/quiz.db.backup

# Restore com containers parados
docker-compose stop backend
cp copilot/backend/data/quiz.db.backup copilot/backend/data/quiz.db
docker-compose start backend
```

Para domínio interno real, coloque HTTPS e rate limit em um proxy reverso na frente do Compose. Aplique limite especialmente em `/api/quiz/start`, `/api/quiz/validate` e `/api/quiz/results`.

## ⚠️ PRÉ-REQUISITO IMPORTANTE

Este backend **NÃO CRIA** a tabela DynamoDB. Ele se conecta a uma tabela **JÁ EXISTENTE** criada pelo Lab1.

**ANTES de rodar o quiz, você DEVE:**

```bash
# 1. Subir DynamoDB Local
cd labs/lab1
docker-compose up -d dynamodb-local

# 2. Criar tabela aurora-benefits
cd scripts
./create-table.sh

# 3. Popular com 61 items (Zelda + Link)
./seed-data.sh

# ✅ Agora SIM pode rodar o backend!
```

**O quiz valida se você sabe CONSULTAR esses dados existentes.**

---

## 📦 Arquitetura

```
copilot/
├── src/
│   ├── main.py                          # FastAPI app + CORS
│   ├── api/
│   │   └── quiz_routes.py              # Endpoints REST
│   ├── models/
│   │   └── schemas.py                  # Pydantic models
│   ├── storage/
│   │   └── database.py                 # SQLite persistence
│   ├── validators/
│   │   ├── openai_validator.py         # Validação semântica (GPT-4)
│   │   ├── dynamodb_executor.py        # Execução real no DynamoDB
│   │   └── hybrid_validator.py         # Combina OpenAI + DynamoDB
│   └── quiz/
│       ├── question_repository.py      # Gerencia questões
│       └── score_calculator.py         # Sistema de XP e ranks
├── data/
│   ├── quiz.db                         # SQLite (criado automaticamente)
│   └── questions.yaml                  # Questões (opcional)
└── requirements.txt
```

---

## 🚀 Quickstart Local

### 1. Instalar Dependências

```bash
cd copilot
pip install -r requirements.txt
```

### 2. Configurar modo de quiz

```bash
export QUIZ_MODE=closed
```

Ou crie arquivo `.env`:
```
QUIZ_MODE=closed
OPENAI_API_KEY=
```

### 3. Rodar Backend

```bash
cd copilot
python -m src.main
```

Ou com uvicorn:
```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8080
```

**Servidor rodando em:** `http://localhost:8080`

---

## 🔗 Endpoints

### 📊 Health Check
```bash
GET /health
GET /
```

### 🎮 Quiz API

#### 1. **Iniciar Quiz**
```bash
POST /api/quiz/start
Content-Type: application/json

{
  "player_name": "João Silva",
  "language": "python"  # ou "go", "javascript"
}

# Response:
{
  "session_id": "uuid",
  "first_question": {...},
  "total_questions": 7
}
```

#### 2. **Validar Resposta**

**Múltipla Escolha:**
```bash
POST /api/quiz/validate

{
  "session_id": "uuid",
  "question_id": "q1_pk_sk_concept",
  "answer": "PK agrupa dados relacionados, SK ordena dentro do grupo"
}
```

**Questão Aberta (PK/SK):**
```bash
POST /api/quiz/validate

{
  "session_id": "uuid",
  "question_id": "q2_build_pk_sk",
  "pk": "USER#zelda#123",
  "sk": "CONTRIB#"
}
```

**Código Python:**
```bash
POST /api/quiz/validate

{
  "session_id": "uuid",
  "question_id": "q3_last_balance_python",
  "code": "response = table.query(...)"
}
```

**Response:**
```json
{
  "correct": true,
  "xp_earned": 300,
  "feedback": "✅ Perfeito! ...",
  "execution_time_ms": 12.5,
  "items_scanned": 1,
  "performance_bonus": 50,
  "next_question": {...} | null,
  "quiz_completed": false
}
```

#### 3. **Pedir Dica**
```bash
POST /api/quiz/hint

{
  "session_id": "uuid",
  "question_id": "q3_last_balance_python"
}

# Response:
{
  "hint": "💡 Use ScanIndexForward=False para ordem inversa...",
  "xp_penalty": 10
}
```

#### 4. **Ver Resultados**
```bash
GET /api/quiz/results/{session_id}

# Response:
{
  "session_id": "uuid",
  "player_name": "João Silva",
  "language": "python",
  "total_xp": 1480,
  "max_possible_xp": 1500,
  "percentage": 98.7,
  "rank": "💎 PRINCIPAL",
  "questions_correct": 7,
  "questions_total": 7,
  "total_time_seconds": 503,
  "hints_used": 1,
  "submissions": [...]
}
```

---

## 🧩 Validação Híbrida

```
┌─────────────────────────────────────────────────┐
│  1️⃣ OpenAI Validator                           │
│  • Análise semântica do código                 │
│  • Feedback educativo                          │
│  • Sugestões de melhoria                       │
└─────────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────────┐
│  2️⃣ DynamoDB Executor (Python apenas)          │
│  • Execução real no DynamoDB Local             │
│  • Métricas: tempo (ms), items scanned         │
│  • Validação de resultado                      │
└─────────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────────┐
│  3️⃣ Hybrid Validator                           │
│  • Combina resultados                          │
│  • Calcula bônus de performance                │
│  • Feedback final unificado                    │
└─────────────────────────────────────────────────┘
```

### Bônus de Performance

- **⚡ Execução ≤ 25ms:** +50 XP
- **⚡ Execução ≤ 50ms:** +25 XP
- **⚡ Execução > 50ms:** 0 XP

---

## 🎯 Sistema de XP e Ranks

### Ranks

| Rank | XP | Emoji | Descrição |
|------|-----|-------|-----------|
| **LENDA** | 1400-1500 (93%+) | ⚔️ | Domínio total do DynamoDB |
| **PRINCIPAL** | 1200-1399 (80%+) | 💎 | Excelente conhecimento |
| **SENIOR** | 1000-1199 (67%+) | 🏆 | Boa compreensão |
| **PLENO** | 700-999 (47%+) | ⭐ | Entendimento sólido |
| **JUNIOR** | 0-699 (< 47%) | 🌟 | Iniciante |

### Distribuição de XP

- **7 questões** = 1.500 XP máximo
- **Múltipla escolha:** 100-150 XP
- **Questões abertas:** 150-200 XP
- **Código prático:** 250-350 XP

### Penalidades

- **Hint usado:** -10 XP

---

## 🗄️ Banco de Dados (SQLite)

### Tabela: `sessions`
```sql
CREATE TABLE sessions (
    session_id TEXT PRIMARY KEY,
    player_name TEXT NOT NULL,
    language TEXT NOT NULL,
    started_at TEXT NOT NULL,
    completed_at TEXT,
    current_question_index INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    hints_used INTEGER DEFAULT 0
);
```

### Tabela: `submissions`
```sql
CREATE TABLE submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    question_id TEXT NOT NULL,
    submitted_code TEXT,
    submitted_answer TEXT,
    is_correct INTEGER NOT NULL,
    xp_earned INTEGER NOT NULL,
    execution_time_ms REAL,
    items_scanned INTEGER,
    feedback TEXT NOT NULL,
    submitted_at TEXT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id)
);
```

---

## 📚 Documentação Interativa

Com o servidor rodando:

- **Swagger UI:** http://localhost:8080/docs
- **ReDoc:** http://localhost:8080/redoc

---

## 🐛 Troubleshooting

### Erro: "OPENAI_API_KEY não configurada"
```bash
export OPENAI_API_KEY="<sua-chave-openai>"
```

### Erro: "DynamoDB connection refused"
```bash
# Certifique-se que DynamoDB Local está rodando
docker ps | grep dynamodb-local

# Se não estiver, suba:
cd labs/lab1
docker-compose up -d dynamodb-local
```

### Erro: "ModuleNotFoundError"
```bash
# Instale dependências
pip install -r requirements.txt

# Ou reinstale tudo
pip install --upgrade -r requirements.txt
```

---

## 🔧 Desenvolvimento

### Rodar com Reload Automático
```bash
uvicorn src.main:app --reload --port 8080
```

### Ver Logs Detalhados
```bash
uvicorn src.main:app --reload --log-level debug
```

### Testar Endpoints
```bash
# Health check
curl http://localhost:8080/health

# Iniciar quiz
curl -X POST http://localhost:8080/api/quiz/start \
  -H "Content-Type: application/json" \
  -d '{"player_name":"Test","language":"python"}'
```

---

## 📊 Próximos Passos

1. ✅ Backend funcionando
2. ⏳ Conectar frontend (port 3002/3003)
3. ⏳ Testar fluxo completo
4. ⏳ Adicionar mais questões no YAML
5. ⏳ Deploy em produção

---

**Criado com ❤️ pela Aurora Labs** 🚀

