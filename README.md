# Aurora Labs Academy — DynamoDB Quest

![Python](https://img.shields.io/badge/python-3.11+-blue) ![Node](https://img.shields.io/badge/node-18+-green) ![License](https://img.shields.io/badge/license-MIT-lightgrey) ![Backend tests](https://img.shields.io/badge/backend%20tests-passing-brightgreen) ![Frontend tests](https://img.shields.io/badge/frontend%20tests-passing-brightgreen)

> **Master DynamoDB and solve the scaling challenge.**
> A gamified quest platform for learning Amazon DynamoDB access patterns, single-table design, and query modeling — built under deadline with AI agent orchestration.

---

## Why DynamoDB Is Hard

Most developers learn databases relationally — normalize your data, join what you need, index what you query. DynamoDB throws that model away entirely.

In DynamoDB, **the data model is the architecture**. You design your table around your access patterns before you write a single item. Get that wrong and you end up with expensive scans, broken pagination, or queries that simply can't be expressed. There's no `JOIN` to save you later.

Aurora Labs Academy teaches this by putting you in the middle of a quest. Zelda and Link need a home page that loads instantly at scale. You're the engineer who has to figure out how to model the data to make that possible — through hands-on challenges, real DynamoDB Local queries, and in-character feedback.

---

## Background

In December 2025, I was challenged to build and teach a DynamoDB workshop for the entire engineering team at a Brazilian fintech — with almost no prior DynamoDB experience, a few weeks to deliver, and without dropping my normal sprint work. I used Claude to structure a prioritized study plan, then built this platform from scratch while running 3–4 Cursor windows in parallel — one building the RPG game, the others handling regular delivery tasks across other repositories, each with 1–2 agents running simultaneously. At one point my Mac started crashing from the processing load. The course shipped on time, received high engagement, and was well-rated by developers and leadership.

---

## What You Get

- **36 challenges** across 3 progressive labs
- **~125 minutes** of structured hands-on learning
- **Quest-themed UX** — XP, progression, leaderboard, and in-character feedback from the Aurora Labs universe
- **Bilingual** — full English and Portuguese content; switch language at the start screen
- **DynamoDB Local** for real query practice with no AWS costs
- **ChatGPT API integration** for open-ended AI-graded feedback (disabled by default — see [Configuration](#configuration))
- **Runs fully local** — Windows without Docker or macOS/Linux with Docker

---

## How the Quest Works

1. Open `http://localhost:17080`
2. Enter your adventurer name, select a lab, coding language, and content language
3. Answer challenges about DynamoDB concepts — earn XP for correct answers
4. Get immediate feedback, hints, and in-character responses from the Aurora Labs universe
5. Complete the quest to see your final score and leaderboard ranking

Each lab also includes hands-on DynamoDB Local exercises where you create and seed a real table and run guided queries — not just theory, but actual access pattern work. See [Hands-on Lab Practice](#hands-on-lab-practice).

The default flow (`QUIZ_MODE=closed`) requires no API keys. To enable open-ended questions with AI-graded answers and in-character Aurora Labs feedback, set `QUIZ_MODE=open` and provide an `OPENAI_API_KEY`.

---

## Lab Catalog

| Lab | Title | Challenges | XP | Estimated Time |
|-----|-------|----------:|---:|---------------:|
| Lab 1 | Foundations Academy | 15 | 1,500 | 45 min |
| Lab 2 | Single Table Design | 13 | 1,870 | 50 min |
| Lab 3 | GSI Tower | 8 | 1,050 | 30 min |
| **Total** | | **36** | **4,420** | **~125 min** |

---

## Architecture

```
Browser
  │
  │ HTTP
  ▼
quiz-web                  static frontend      → port 17080
  │
  │ /api/quiz/*
  ▼
FastAPI backend           validation + sessions → port 17091
  │
  ├── SQLite              session, result, and leaderboard storage
  ├── Validation schemas  copilot/lab1|lab2|lab3
  │
  ▼
DynamoDB Local            hands-on lab exercises → port 17000
```

---

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Python | 3.11+ | Required for backend |
| Node.js / npm | 18+ | Required for frontend tests only |
| Docker + Compose | Any recent | macOS/Linux path only |
| Java (JRE) | 21 | Windows path — auto-downloaded by setup script into `.tools/` |
| AWS CLI | Any recent | Optional, for manual DynamoDB Local commands |

---

## Quick Start

### macOS / Linux — Docker

```bash
# First-time setup
make setup

# Start the stack
make start

# Stop
make stop

# Reset Docker environment (destructive)
make reset && make setup
```

### Windows — No Docker Required

```powershell
# First-time setup
powershell -ExecutionPolicy Bypass -File scripts\setup-windows.ps1 -Action setup

# Start services
powershell -ExecutionPolicy Bypass -File scripts\setup-windows.ps1 -Action start

# Stop services
powershell -ExecutionPolicy Bypass -File scripts\setup-windows.ps1 -Action stop

# Run backend tests
powershell -ExecutionPolicy Bypass -File scripts\setup-windows.ps1 -Action test
```

The Windows setup script auto-downloads a portable JRE and DynamoDB Local into `.tools/` on first run. No Docker Desktop or WSL required.

Once running, open **http://localhost:17080** and begin your quest.

---

## Service URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:17080 |
| Backend API | http://localhost:17091 |
| API docs (Swagger) | http://localhost:17091/docs |
| DynamoDB Local | http://localhost:17000 |
| Backend health | http://localhost:17091/health |

---

## Configuration

The default configuration runs the closed quiz flow — multiple-choice validation only, no API keys required.

| Variable | Default | Purpose |
|----------|---------|---------|
| `QUIZ_MODE` | `closed` | `closed` = multiple-choice only. `open` = enables AI-graded answers via ChatGPT API. |
| `DYNAMODB_EXECUTION_ENABLED` | `false` | Enables user-submitted code execution against DynamoDB Local. |
| `OPENAI_API_KEY` | empty | Required only when `QUIZ_MODE=open` for in-character Aurora Labs feedback. |
| `TABLE_NAME` | `aurora-benefits` | DynamoDB table used by hands-on exercises (named after the internal product this course was built for). |
| `CORS_ORIGINS` | local origins | Comma-separated list of allowed frontend origins. |

**For internal production training deployments:**

```env
QUIZ_MODE=closed
DYNAMODB_EXECUTION_ENABLED=false
OPENAI_API_KEY=
CORS_ORIGINS=https://your-internal-training-domain.example
```

Put HTTPS in front via Nginx, Traefik, or your standard ingress. Apply rate limiting at the proxy layer on `/api/quiz/start`, `/api/quiz/validate`, and `/api/quiz/results`.

---

## API Reference

Full interactive docs available at `http://localhost:17091/docs` once the stack is running.

<details>
<summary>Core endpoints with examples</summary>

### Start a session

```bash
POST /api/quiz/start

curl -X POST http://localhost:17091/api/quiz/start \
  -H "Content-Type: application/json" \
  -d '{"player_name": "Zelda", "language": "python", "lab": "lab1", "content_language": "en"}'
```

`content_language` accepts `"en"` (default) or `"pt-BR"`. Controls the language of question content, options, hints, and feedback.

### Validate an answer

```bash
POST /api/quiz/validate

curl -X POST http://localhost:17091/api/quiz/validate \
  -H "Content-Type: application/json" \
  -d '{"session_id": "SESSION_ID", "question_id": "Q1_lab1", "answer": "B"}'
```

### Request a hint

```bash
POST /api/quiz/hint

curl -X POST http://localhost:17091/api/quiz/hint \
  -H "Content-Type: application/json" \
  -d '{"session_id": "SESSION_ID", "question_id": "Q1_lab1"}'
```

### Get results

```bash
GET /api/quiz/results/{session_id}

curl http://localhost:17091/api/quiz/results/SESSION_ID
```

### Health check

```bash
GET /health

curl http://localhost:17091/health
```

</details>

---

## Hands-on Lab Practice

The closed quiz validates multiple-choice answers. For hands-on DynamoDB query practice, use the lab scripts to create and seed the local `aurora-benefits` table.

### macOS / Linux

```bash
make lab-setup LAB=lab2
make lab-query LAB=lab2
```

### Windows

```powershell
copilot\backend\.venv\Scripts\python.exe labs\lab2\scripts\create-table.py
copilot\backend\.venv\Scripts\python.exe labs\lab2\scripts\seed-data.py
copilot\backend\.venv\Scripts\python.exe labs\lab2\scripts\queries.py
```

---

## Running Tests

### Backend

```bash
# With Docker
make backend-test-docker

# Windows local
powershell -ExecutionPolicy Bypass -File scripts\setup-windows.ps1 -Action test
```

### Frontend

```bash
cd quiz-web
npm install
npm run test:unit:fast
npm run test:e2e:fast

# If Playwright browsers are missing
npx playwright install
```

---

## Operations

### Leaderboard and Session Data

Quiz sessions, scores, and leaderboard data are stored in SQLite at `copilot/backend/data/quiz.db`.

**Backup:**

```bash
cp copilot/backend/data/quiz.db copilot/backend/data/quiz.db.backup
```

**Restore (with services stopped):**

```bash
# Docker
docker-compose stop backend
cp copilot/backend/data/quiz.db.backup copilot/backend/data/quiz.db
docker-compose start backend

# Windows local
powershell -ExecutionPolicy Bypass -File scripts\setup-windows.ps1 -Action stop
Copy-Item copilot\backend\data\quiz.db.backup copilot\backend\data\quiz.db -Force
powershell -ExecutionPolicy Bypass -File scripts\setup-windows.ps1 -Action start
```

Docker Compose includes log rotation (10MB max, 3 files) for all main services.

---

## Repository Structure

```
.
├── copilot/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── api/          # Quiz routes and request handling
│   │   │   ├── models/       # Pydantic schemas
│   │   │   ├── quiz/         # Question repository and session logic
│   │   │   ├── storage/      # SQLite session and leaderboard storage
│   │   │   └── validators/   # Hybrid validator + DynamoDB executor
│   │   ├── tests/            # pytest suite
│   │   ├── data/             # SQLite database (gitignored)
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   ├── lab1/                 # Validation schemas for Lab 1
│   ├── lab2/                 # Validation schemas for Lab 2
│   └── lab3/                 # Validation schemas for Lab 3
├── labs/
│   ├── lab1/                 # Lab content, metadata, seed scripts
│   ├── lab2/
│   └── lab3/
├── quiz-web/
│   ├── js/                   # ES modules (quiz logic, routing, UI)
│   ├── tests/                # Unit (Vitest) + E2E (Playwright)
│   ├── index.html
│   ├── style.css
│   └── Dockerfile
├── scripts/
│   ├── setup.sh              # macOS/Linux setup and validation
│   └── setup-windows.ps1    # Windows setup — no Docker required
├── docker-compose.yml
└── Makefile
```

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| PowerShell blocks script execution | Default execution policy | Run with `-ExecutionPolicy Bypass` as shown in Quick Start |
| Docker not recognized on Windows | Docker Desktop / WSL not installed | Use the Windows no-Docker path — `setup-windows.ps1` handles everything |
| Port already in use | Previous session still running | Run `stop` action first, then `start` |
| Backend health check fails | Service not started or crashed | `curl http://localhost:17091/health`; check `docker-compose logs -f backend` |
| No questions available | Missing validation schema | Confirm `copilot/lab1\|lab2\|lab3/validation-schema.json` exists, then restart backend |
| Playwright browsers missing | First run or cache cleared | `cd quiz-web && npx playwright install` |
| DynamoDB Local not connecting | Wrong endpoint config | Windows local: `http://localhost:17000`; Docker backend: `http://dynamodb-local:8000` |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Static HTML, CSS, ES Modules |
| Backend | Python, FastAPI |
| Storage | SQLite (sessions + leaderboard), DynamoDB Local (lab exercises) |
| Testing | pytest (backend), Playwright + Vitest (frontend) |
| Infrastructure | Docker Compose, Makefile, PowerShell |
| AI feedback (optional) | OpenAI ChatGPT API (`QUIZ_MODE=open` only) |

---

## Contributing and Adapting

This project was built as an internal training tool and is open for adaptation. To extend it:

- **New labs** — add a folder under `labs/` and a corresponding validation schema under `copilot/labN/validation-schema.json`. Follow the existing lab structure for metadata and seed scripts.
- **New question types** — extend `src/validators/hybrid_validator.py` and the relevant Pydantic schema models.
- **UI and quest narrative** — the frontend is plain HTML/CSS/ES Modules with no build step. Edit `quiz-web/index.html` and `quiz-web/js/` directly.
- **New Aurora Labs lore** — question flavour text and in-character feedback live in the lab content files under `labs/`.

---

## License

MIT — see [LICENSE](./LICENSE).

---

If Aurora Labs Academy helped you think differently about DynamoDB, consider starring the repo ⭐
