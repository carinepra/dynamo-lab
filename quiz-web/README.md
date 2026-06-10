# ⚔️ Aurora DynamoDB Quest - Frontend

Interface gamificada para aprender DynamoDB Single-Table.

## 📁 Estrutura Modular (v1.1.0)

```
quiz-web/
├── index.html              # Interface principal (1292 linhas)
├── app.js                  # Lógica do quiz (1813 linhas)
├── style.css               # Estilos completos (2686 linhas)
├── componentes-quest.css   # Componentes gamificados Aurora Academy
├── clear-cache.html        # Helper para limpar cache do navegador
│
├── 📚 Documentação
│   ├── README.md           # Este arquivo
│   ├── CHANGELOG.md        # Histórico completo (v1.0.0 + v1.1.0)
│   └── README-IDENTIDADE.md # Identidade visual
│
├── 🔧 Módulos JavaScript (11 módulos, 1.550+ linhas)
│   ├── README.md           # 📖 Guia completo dos módulos (550+ linhas)
│   ├── config.js           # ⚙️ Configurações e constantes
│   ├── icons.js            # 🎨 Sistema de ícones SVG (20+ ícones)
│   ├── state.js            # 💾 Gerenciamento de estado global
│   ├── levels.js           # 📊 Sistema de 5 níveis (Escudeiro → Grão-Mestre)
│   ├── api.js              # 🌐 Comunicação backend (7 endpoints)
│   ├── ui/
│   │   ├── screens.js      # 📺 Navegação entre 4 telas
│   │   ├── feedback.js     # 💬 Sistema de feedback visual
│   │   └── notifications.js # 🔔 Toast notifications
│   └── utils/
│       ├── timer.js        # ⏱️ Cronômetro com alertas
│       ├── validator.js    # ✅ Validação de respostas
│       └── markdown.js     # 📝 Formatação markdown → HTML
│
├── 🎨 Assets (6 arquivos, ~53KB otimizados)
│   ├── README.md           # 📖 Guia dos assets (250+ linhas)
│   ├── fonts/              # 3 fontes Rubik WOFF2 (~33KB)
│   │   ├── rubik-v18-latin-regular.woff2
│   │   ├── rubik-v18-latin-500.woff2
│   │   └── rubik-v18-latin-700.woff2
│   ├── images/             # Logos e imagens (~5KB)
│   │   └── logo-aurora.svg
│   └── icons/              # Ícones SVG (~15KB)
│       ├── quest-icons.svg
│       └── quest-icons-library.js
│
├── 🐳 Deploy
│   ├── Dockerfile          # Container nginx para produção
│   └── nginx.conf          # Configuração do servidor web
│
├── 📦 Dependências
│   ├── package.json        # Playwright para testes E2E
│   ├── package-lock.json
│   └── playwright.config.js
│
└── 🧪 Tests
    └── tests/
        └── quiz.spec.js    # 42 testes E2E (Playwright)
```

**✅ Melhorias v1.1.0:**
- ✅ **11 módulos ES6** criados (código 10x mais organizado)
- ✅ **Assets reorganizados** em estrutura profissional
- ✅ **99.2% de redução** no tamanho (59MB → 469KB)
- ✅ **1.600+ linhas** de documentação criadas
- ✅ Base sólida para testes unitários
- ✅ APIs bem definidas e documentadas

**📝 Observações:**
- `node_modules/`, `test-results/` e `playwright-report/` estão no .gitignore
- Documentação de debug temporária foi removida e consolidada no CHANGELOG
- Pasta `testing/` foi removida, informações consolidadas neste README
- Fontes, logos e ícones agora em `assets/` (organizado por tipo)

## 🚀 Como Rodar

### Opção 1: Docker (Recomendado)

```bash
# Build da imagem
docker build -t quiz-web .

# Rodar container
docker run -d -p 3002:80 quiz-web

# Acessar
open http://localhost:3002
```

### Opção 2: Docker Compose

O frontend já está configurado no `docker-compose.yml` raiz:

```bash
cd ..
docker-compose up -d quiz-web

# Acessar
open http://localhost:3002
```

### Opção 3: Desenvolvimento Local

Para desenvolvimento rápido sem Docker:

```bash
# Usar Makefile (raiz do projeto)
cd ..
make frontend-start

# Ou usar Python diretamente
python3 -m http.server 3010

# Acessar
open http://localhost:3010
```

## 🔧 Usando os Módulos JavaScript (v1.1.0)

**Nova arquitetura modular!** O código foi organizado em **11 módulos ES6** independentes para melhor manutenibilidade e testabilidade.

### Módulos Disponíveis

| Módulo | Descrição | Linhas |
|--------|-----------|--------|
| `config.js` | ⚙️ Configurações e constantes | 30 |
| `icons.js` | 🎨 Sistema de ícones SVG (20+) | 100 |
| `state.js` | 💾 Gerenciamento de estado global | 50 |
| `levels.js` | 📊 Sistema de 5 níveis Quest | 150 |
| `api.js` | 🌐 Comunicação backend (7 endpoints) | 200 |
| `ui/screens.js` | 📺 Navegação entre telas | 180 |
| `ui/feedback.js` | 💬 Feedback visual | 200 |
| `ui/notifications.js` | 🔔 Toast notifications | 160 |
| `utils/timer.js` | ⏱️ Cronômetro com alertas | 180 |
| `utils/validator.js` | ✅ Validação de respostas | 170 |
| `utils/markdown.js` | 📝 Formatação markdown | 130 |
| **TOTAL** | **11 módulos** | **1.550** |

### Exemplo de Uso

```javascript
// Importar módulos
import { API_URL } from './js/config.js';
import { state, updateXP } from './js/state.js';
import * as API from './js/api.js';
import { showScreen } from './js/ui/screens.js';
import { showNotification } from './js/ui/notifications.js';
import { updatePlayerLevel } from './js/levels.js';

// Usar funções modulares
async function startQuiz() {
    const session = await API.startQuizSession('João', 'python', 'lab1');
    state.sessionId = session.session_id;
    showScreen('quiz');
    updatePlayerLevel(0);
    showNotification('Quiz iniciado!', 'success');
}
```

### Documentação Completa

📖 **[Leia js/README.md](js/README.md)** para documentação detalhada (550+ linhas) com:
- Descrição completa de cada módulo
- APIs exportadas
- Exemplos de uso
- Dependências entre módulos
- Guia de integração

## 🧪 Testes Automatizados

Este projeto possui **42 testes E2E** usando Playwright!

### Quick Start (30 segundos)

```bash
# 1. Setup (apenas uma vez)
cd testing
make setup

# 2. Inicia frontend (terminal 1)
cd ..
make frontend-start

# 3. Roda testes (terminal 2)
cd testing
make test
```

### Documentação Completa

📚 **[Veja a documentação completa dos testes](testing/README.md)**

Inclui:
- ✅ 42 testes E2E cobrindo todos os fluxos
- ✅ 5 bugs de usabilidade identificados
- ✅ Testes em Chrome, Firefox, Safari
- ✅ Testes mobile (iOS + Android)
- ✅ Interface visual para debug
- ✅ Relatórios com vídeos e screenshots

### Comandos Rápidos

```bash
cd testing

make test          # Roda todos os testes
make test-ui       # Interface visual (recomendado!)
make test-bugs     # Apenas bugs de usabilidade
make test-report   # Abre relatório HTML
make help          # Lista todos os comandos
```

## 🎨 Features

### Telas

1. **Start Screen** - Tela inicial
   - Input de nome
   - Seleção de linguagem (Python/Go/JS)
   - Sistema de pontuação

2. **Quiz Screen** - Quiz em andamento
   - Header com timer e XP
   - Área de pergunta
   - Área de resposta (varia por tipo)
   - Botões de ação (Ajuda, Validar)
   - Feedback após validação

3. **Result Screen** - Resultado final
   - Estatísticas completas
   - Ranking (Legend/Principal/Senior/Pleno/Junior)
   - Conquistas desbloqueadas
   - Exportar resultado

### Tipos de Pergunta

- **Múltipla Escolha** (1-2): Radio buttons
- **Abertas PK/SK** (3-4): Inputs de texto + dropdown
- **Práticas Código** (5-7): Textarea com syntax hint

### Validação

- Conecta com backend em `http://localhost:8091/api/quiz`
- OpenAI valida semântica
- DynamoDB Local executa queries reais
- Feedback educativo instantâneo

## 🎯 API Endpoints (Backend)

```
POST   /api/quiz/start       - Iniciar quiz
GET    /api/quiz/question/:id - Carregar pergunta
POST   /api/quiz/validate    - Validar resposta
POST   /api/quiz/hint        - Pedir ajuda (-10 XP)
GET    /api/quiz/results/:id - Resultado final
POST   /api/quiz/export      - Exportar JSON
```

## 🎨 Design

- Gradiente roxo moderno
- Responsivo (mobile-first)
- Animações suaves (fade, bounce, shake)
- Loading overlay
- Timer com alerta visual
- Feedback colorido (verde/vermelho)

## 🔧 Configuração

### Alterar URL do Backend

Edite `app.js`, linha 4:

```javascript
const API_URL = 'http://localhost:8091/api/quiz';
```

### Alterar Porta

Edite `docker-compose.yml` ou use variável de ambiente:

```yaml
quiz-web:
  ports:
    - "${FRONTEND_PORT:-3002}:80"
```

## 🐛 Troubleshooting

### Backend não conecta

```bash
# Verificar se backend está rodando
curl http://localhost:8091/health

# Verificar CORS
# O backend deve ter:
# allow_origins=["http://localhost:3002"]
```

### Porta 3010 já em uso

```bash
# Mudar para porta 3011
python3 -m http.server 3011
```

### Alterações não aparecem

```bash
# Limpar cache do navegador
Cmd+Shift+R (Mac) ou Ctrl+Shift+R (Windows)

# Ou rebuild sem cache
docker build --no-cache -t quiz-web .
```

## 📊 Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Gradientes, animações, grid
- **Vanilla JavaScript** - Sem frameworks (simplicidade)
- **Fetch API** - Comunicação com backend
- **Nginx Alpine** - Servidor web leve (5MB)
- **Playwright** - Testes E2E automatizados

## 🎮 Experiência do Usuário

```
1. Dev acessa http://localhost:3010
2. Digita nome e escolhe linguagem
3. Clica "Começar Quest"
4. Responde 7 perguntas (múltipla, aberta, código)
5. Recebe feedback instantâneo com XP
6. Vê resultado final com rank
7. Tira print para compartilhar com instrutor
8. (Opcional) Exporta JSON
```

## 📝 Próximos Passos

- [x] Implementar frontend ✅
- [x] Criar testes automatizados ✅
- [ ] Implementar backend (FastAPI)
- [ ] Criar validador híbrido (OpenAI + DynamoDB)
- [ ] Adicionar 7 perguntas em YAML
- [ ] Testar fluxo completo
- [ ] Adicionar mais conquistas
- [ ] Suporte a dark mode
- [ ] PWA (funcionar offline)

## 🧪 Testes

Este projeto possui uma suite completa de testes automatizados!

**42 testes E2E** cobrindo:
- ✅ Todas as telas e fluxos
- ✅ Validações de entrada
- ✅ Timer e interações
- ✅ **5 bugs de usabilidade identificados**
- ✅ Responsividade mobile
- ✅ Cross-browser (Chrome, Firefox, Safari)

**[📚 Veja documentação completa dos testes](testing/README.md)**

---

**Baseado em:** PROJETO-QUIZ-GAMIFICADO.md - FASE 3 (Frontend Web)
