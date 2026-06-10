# 📚 GUIA DE ESTRUTURA DO PROJETO

**Versão:** 2.0 (Reorganizado em 19/11/2024)  
**Objetivo:** Explicar a organização de **TODOS** os arquivos do projeto

---

## 🎯 ORGANIZAÇÃO POR PÚBLICO-ALVO

O projeto está organizado em **materiais de participantes**, **labs** e **referências visuais/técnicas**:

```
docs/
├── participantes/        # 👥 Quem FAZ o lab + quiz
├── identidade-visual/    # 🎨 Identidade e componentes visuais
└── meta/                 # 🗺️ Mapa de arquivos
```

---

## 📁 ESTRUTURA COMPLETA

### Raiz do Projeto
```
dynamodb-lab/
├── README.md                    # 🏠 Porta de entrada (simplificado!)
├── Makefile                     # Comandos rápidos
├── docker-compose.yml           # Infraestrutura Docker
└── .gitignore                   # Git
```

---

## 📚 docs/ - Documentação

### docs/README.md
**Propósito:** Índice principal da documentação  
**Conteúdo:** Links para participantes e instrutores

---

### 👥 docs/participantes/ (Quem FAZ)

| Arquivo | Conteúdo | Quando Usar |
|---------|----------|-------------|
| **README.md** | Guia de início rápido | Primeiro contato |
| **INSTALACAO.md** | Setup completo do ambiente | Antes do lab |
| **FAQ.md** | Troubleshooting | Quando travar |

**Público:**
- Devs fazendo o treinamento
- Quem vai fazer o lab e o quiz

**Fluxo típico:**
```
1. README.md
   ↓
2. INSTALACAO.md (setup)
   ↓
3. labs/lab1/DESAFIOS.md (fazer lab)
   ↓
4. quiz-web/ (fazer quiz)
```

---

### 👨‍🏫 Materiais para instrutores

Não há uma pasta `docs/instrutores/` neste workspace. Para conduzir ou revisar o treinamento, use:

- `README.md` para visão geral.
- `labs/lab1/DESAFIOS.md`, `labs/lab2/DESAFIOS.md` e `labs/lab3/DESAFIOS.md` para conteúdo.
- `docs/participantes/INSTALACAO.md` e `docs/participantes/FAQ.md` para suporte aos participantes.
- `quiz-web/` para a experiência gamificada.

---

### 🗺️ docs/meta/ (Metadocumentação)

| Arquivo | Conteúdo | Quando Usar |
|---------|----------|-------------|
| **GUIA-ARQUIVOS.md** | Este arquivo! Mapa completo | Entender estrutura |
| **CONTRIBUINDO.md** | *em breve* | Contribuir |

**Público:** Mantenedores do projeto

---

## 🧪 labs/ - Conteúdo dos Labs

### labs/lab1/

```
labs/lab1/
├── README.md                    # Instruções do lab
├── DESAFIOS.md                  # 15 desafios (conteúdo principal!)
├── metadata.json                # Metadados usados pelo quiz
│
├── scripts/                     # Setup do DynamoDB
│   ├── setup-lab1.sh
│   ├── CONSULTAS.md
│   └── data/
```

**Responsabilidade:**
- **DESAFIOS.md:** Conteúdo do lab (perguntas SEM gabaritos)
- **scripts/:** Criar tabela e popular dados

**⚠️ Importante:** Gabaritos do quiz ficam nos schemas de validação do backend/copilot quando aplicável.

**Usado por:**
- Participantes (fazer lab)
- Instrutores (ministrar)

---

### labs/lab2/
**Status:** Implementado  
**Conteúdo:** Single Table Design, access patterns e queries avançadas

---

## 🤖 copilot/ - Sistema de Validação IA

### Reorganização ⭐

**ANTES:**
```
copilot/                      # Backend
labs/lab1/copilot/            # Validação Lab 1 (separado!)
```

**DEPOIS:**
```
copilot/
├── backend/                  # Backend do quiz
└── lab1/                     # Validação Lab 1
```

**Benefício:** Toda lógica de IA em um lugar!

---

### copilot/backend/ (Backend do Quiz)

```
copilot/backend/
├── README.md                    # Doc completa
├── BACKEND-README.md            # Doc técnica
├── QUICKSTART-BACKEND.md        # Como rodar (5min)
├── INTEGRACAO-LAB.md            # Integração com labs
│
├── src/
│   ├── main.py                  # FastAPI app
│   ├── api/                     # Endpoints REST
│   ├── models/                  # Pydantic schemas
│   ├── storage/                 # SQLite
│   ├── validators/              # OpenAI + DynamoDB
│   └── quiz/                    # Sistema de pontos
│
├── data/                        # SQLite database
├── requirements.txt
└── ...
```

**Responsabilidade:** Backend do quiz gamificado

**Stack:**
- FastAPI + Python 3.11+
- OpenAI (validação semântica)
- DynamoDB Local (execução real)
- SQLite (persistence)

**Usado por:**
- Instrutores (implementação)
- Quiz web (frontend)

---

### copilot/lab1/ (Validação Lab 1)

```
copilot/lab1/
├── README.md                    # Instruções para Copilot/IA
├── validation-schema.json       # 🔒 Gabaritos Lab 1
├── expected-results.yaml        # Resultados esperados
├── test_queries.py              # Testes automatizados
└── SUMMARY.md                   # Sumário
```

**Responsabilidade:** Validação automática dos 17 desafios

**⚠️ Arquivos Secretos:**
- `validation-schema.json` - Gabaritos completos
- `expected-results.yaml` - Resultados das queries

**Usado por:**
- Copilot/IA (validar respostas)
- Backend (copilot/backend/src/validators/)
- Instrutores (consultar gabaritos)

**❌ NÃO ACESSAR durante o lab!** (participantes)

---

### copilot/lab2/
**Status:** *Em breve*  
**Conteúdo:** Validação Lab 2 (GSI)

---

## 🌐 quiz-web/ - Frontend

```
quiz-web/
├── README.md                    # Doc completa
├── QUICKSTART.md                # Como rodar
│
├── index.html                   # 3 telas (início/quiz/resultado)
├── style.css                    # Design moderno
├── app.js                       # Lógica do quiz
├── demo.html                    # Demo standalone
│
├── Dockerfile                   # Container nginx
└── nginx.conf
```

**Responsabilidade:** Interface web do quiz

**Stack:**
- HTML5 + Vanilla JS
- CSS moderno (gradientes, animações)
- Nginx (produção)

**Usado por:**
- Participantes (fazer quiz)
- Instrutores (implementação)

---

## 📦 code/ - Exemplos Reutilizáveis

```
code/
├── python/                      # Exemplos Python
└── go/                          # Exemplos Go
```

**Responsabilidade:** Código exemplo reutilizável

**Conteúdo:**
- Conexão com DynamoDB Local
- CRUD operations
- Query patterns

---

## 🛠️ scripts/ - Scripts Auxiliares

```
scripts/
└── check-health.sh              # Health check do ambiente
```

**Responsabilidade:** Utilitários gerais

---

## 🐳 docker/ - Infraestrutura

```
docker/                          # Configs Docker adicionais (se houver)
docker-compose.yml               # Raiz (DynamoDB Local + quiz)
```

---

## 🔄 FLUXO DE INFORMAÇÃO

### Como os Arquivos se Relacionam

```
README.md (raiz)
       ↓
docs/README.md
       ↓
docs/participantes/INSTALACAO.md
       ↓
labs/lab1, labs/lab2, labs/lab3
       ↓
quiz-web/
       ↓
copilot/backend/
```

---

## 📊 MAPA POR PÚBLICO

### 👥 Participante

**Caminho:**
```
1. README.md (raiz)
2. docs/participantes/INSTALACAO.md
3. labs/lab1/DESAFIOS.md
4. labs/lab2/DESAFIOS.md
5. labs/lab3/DESAFIOS.md
6. quiz-web/ (quiz gamificado)
```

**Arquivos usados:**
- ✅ docs/participantes/*
- ✅ labs/*
- ✅ quiz-web/

---

### 👨‍🏫 Instrutor ou mantenedor

**Caminho:**
```
1. README.md (raiz)
2. docs/README.md
3. docs/participantes/INSTALACAO.md
4. labs/*/DESAFIOS.md
5. quiz-web/
6. copilot/backend/
```

**Arquivos usados:**
- ✅ docs/participantes/*
- ✅ labs/*
- ✅ quiz-web/*
- ✅ copilot/backend/*

---

## 🎯 REGRAS DE AUTORIDADE

### Sobre Conteúdo dos Labs:
```
1º labs/*/DESAFIOS.md        (conteúdo pedagógico)
2º labs/*/metadata.json      (card exibido no quiz)
3º copilot/backend/          (validação/API)
```

### Sobre Setup:
```
1º README.md
2º docs/participantes/INSTALACAO.md
3º Makefile
```

### Sobre Arquitetura Técnica:
```
1º copilot/backend/README.md
2º quiz-web/README.md
3º docker-compose.yml
```

---

## 📝 CONVENÇÕES

### Quando atualizar cada arquivo:

**labs/*/DESAFIOS.md:**
- ✅ Adicionar/remover desafios
- ✅ Melhorar dicas
- ✅ Corrigir erros pedagógicos

**labs/*/metadata.json:**
- ✅ Sincronizar quantidade, XP e duração com DESAFIOS.md
- ✅ Ajustar card exibido no quiz

---

## 📚 PARA NOVOS MEMBROS

**Leia nesta ordem:**

1. **README.md (raiz)** (5min)
   └─ Visão geral do projeto

2. **docs/README.md** (2min)
   └─ Índice da documentação

3. **Escolha seu caminho:**

   **Se vai FAZER o lab:**
   - docs/participantes/INSTALACAO.md
   - labs/lab1/DESAFIOS.md

   **Se vai MINISTRAR:**
   - README.md
   - docs/README.md
   - labs/*/DESAFIOS.md

   **Se vai IMPLEMENTAR:**
   - copilot/backend/README.md
   - quiz-web/README.md
   - Makefile

---

## 🎓 ÚLTIMA PALAVRA

**Princípio Fundamental:**

> Cada arquivo tem **UM** propósito claro e **UMA** audiência.  
> Documentação organizada por **PÚBLICO-ALVO** é mais fácil de navegar.

**Dúvidas sobre estrutura?** Releia este guia! 📖

---

**Versão:** 2.0  
**Última atualização:** 19 de Novembro de 2024  
**Próxima revisão:** Após criação do Lab 2
