# Módulos JavaScript - Aurora DynamoDB Quiz

**Status:** ✅ 10 módulos criados (83% do plano original)  
**Data:** 27 de Novembro de 2025

---

## 📚 Visão Geral

Este diretório contém módulos ES6 independentes que implementam a funcionalidade do quiz DynamoDB. A modularização foi feita para melhorar manutenibilidade, testabilidade e reusabilidade do código.

---

## 📁 Estrutura

```
js/
├── config.js           # Configurações e constantes
├── icons.js            # Sistema de ícones SVG
├── state.js            # Gerenciamento de estado global
├── levels.js           # Sistema de níveis e progressão
├── api.js              # Comunicação com backend
├── ui/
│   ├── screens.js      # Navegação entre telas
│   ├── feedback.js     # Sistema de feedback visual
│   └── notifications.js # Toast notifications
└── utils/
    ├── timer.js        # Cronômetro do quiz
    ├── validator.js    # Validação de respostas
    └── markdown.js     # Formatação markdown
```

---

## 🔧 Módulos Core

### 1. config.js

**Responsabilidade:** Configurações centralizadas e constantes do sistema.

**Exports:**
- `API_URL` - URL do backend (auto-detecta Docker/local)
- `QUEST_LEVELS` - Sistema de 5 níveis de progressão
- `MAX_QUESTIONS` - Número máximo de questões
- `HINT_XP_PENALTY` - Penalidade de XP por dica
- `TIMEOUT_DURATION` - Duração do timeout

**Exemplo:**
```javascript
import { API_URL, QUEST_LEVELS } from './config.js';

console.log(`API: ${API_URL}`);
console.log(`Níveis: ${QUEST_LEVELS.length}`);
```

---

### 2. icons.js

**Responsabilidade:** Gerenciamento de ícones SVG inline.

**Exports:**
- `SVG` - Objeto com 20+ definições de ícones SVG
- `Icons.get(name)` - Obtém ícone por nome lógico
- `Icons.getStatus(status)` - Ícones de status (success, error, warning)
- `Icons.getChapter(emoji)` - Ícones de capítulos

**Exemplo:**
```javascript
import { Icons } from './icons.js';

// Renderizar ícone de timer
element.innerHTML = Icons.get('timer') + ' 5:00';

// Ícone de status
statusIcon.innerHTML = Icons.getStatus('success');
```

**Benefícios:**
- ✅ Elimina duplicação de SVGs
- ✅ Centraliza identidade visual
- ✅ Fallback automático para emojis
- ✅ Fácil manutenção

---

### 3. state.js

**Responsabilidade:** Gerenciamento do estado global da aplicação.

**Exports:**
- `state` - Objeto de estado compartilhado
- `resetState()` - Reset para novo quiz
- `updateXP(amount)` - Atualiza XP do jogador
- `getCurrentLevel()` - Retorna nível atual

**Estrutura do Estado:**
```javascript
{
    sessionId: null,
    currentQuestion: null,
    currentQuestionIndex: 0,
    totalQuestions: 7,
    totalXP: 0,
    playerName: '',
    language: 'python',
    timer: null,
    timeRemaining: 0,
    startTime: null,
    hintsUsed: 0,
    answers: [],
    labsProgress: {},
    quizCompleted: false
}
```

**Exemplo:**
```javascript
import { state, resetState, updateXP } from './state.js';

// Atualizar XP
updateXP(50);

// Reset completo
resetState();
```

---

### 4. levels.js

**Responsabilidade:** Sistema de níveis e progressão do jogador.

**Exports:**
- `getLevelIcon(type, gradientId)` - Gera SVG de nível
- `getRank(xp)` - Obtém rank baseado no XP
- `updatePlayerLevel(xp)` - Atualiza badge visual
- `getCurrentLevelInfo(xp)` - Info detalhada do nível

**Níveis Disponíveis:**
1. **Escudeiro** (0-500 XP) - Bronze 🛡️
2. **Cartógrafo** (501-1000 XP) - Silver 🗺️
3. **Cavaleiro** (1001-1500 XP) - Gold ⚔️
4. **Oráculo** (1501-2000 XP) - Principal 🔮
5. **Grão-Mestre** (2001+ XP) - Legend 👑

**Exemplo:**
```javascript
import { updatePlayerLevel, getRank } from './levels.js';

// Atualizar badge visual
updatePlayerLevel(1250);

// Obter rank
const rank = getRank(1250);
console.log(rank.name); // "Cavaleiro"
```

---

### 5. api.js

**Responsabilidade:** Centraliza todas as chamadas HTTP ao backend.

**Exports:**
- `startQuizSession(playerName, language, lab)` - Inicia sessão
- `fetchNextQuestion(index)` - Busca próxima questão
- `validateAnswer(sessionId, questionId, answerData)` - Valida resposta
- `requestHint(sessionId, questionId)` - Solicita dica
- `fetchQuizResult(sessionId)` - Busca resultado final
- `exportQuizResult(sessionId)` - Exporta resultado (Blob)
- `healthCheck()` - Verifica saúde da API

**Features:**
- ✅ Timeout automático (30s)
- ✅ Error handling centralizado
- ✅ AbortController para cancelamento
- ✅ Suporte a JSON e Blob

**Exemplo:**
```javascript
import * as API from './api.js';

// Iniciar quiz
const session = await API.startQuizSession('João', 'python', 'lab1');

// Validar resposta
const result = await API.validateAnswer(
    session.session_id,
    question.id,
    { answer: 'A' }
);
```

---

## 🎨 Módulos UI

### 6. ui/screens.js

**Responsabilidade:** Navegação entre telas (start, questMap, quiz, result).

**Exports:**
- `screens` - Objeto com referências às telas
- `showScreen(name)` - Mostra tela específica
- `hideAllScreens()` - Oculta todas as telas
- `exitToStart()` - Retorna à inicial
- `returnToQuestMap()` - Retorna ao mapa
- `goToQuiz()` - Vai para o quiz
- `goToResult()` - Vai para resultado
- `getCurrentScreen()` - Retorna tela atual
- `isScreenVisible(name)` - Verifica visibilidade
- `transitionToScreen(name, animation)` - Transição animada

**Exemplo:**
```javascript
import { showScreen, getCurrentScreen } from './ui/screens.js';

// Navegar
showScreen('questMap');

// Verificar tela atual
console.log(getCurrentScreen()); // "questMap"
```

---

### 7. ui/feedback.js

**Responsabilidade:** Sistema de feedback visual (loading, confirmação, resultados).

**Exports:**
- `showFeedback(result)` - Mostra feedback da resposta
- `hideFeedback()` - Oculta feedback
- `showLoading(show, message)` - Overlay de carregamento
- `hideLoading()` - Oculta loading
- `showConfirm(title, message)` - Modal de confirmação (Promise)
- `showSuccess(message, duration)` - Feedback de sucesso
- `showError(message, duration)` - Feedback de erro

**Exemplo:**
```javascript
import { showLoading, showFeedback, showConfirm } from './ui/feedback.js';

// Loading
showLoading(true, 'Validando...');

// Feedback
showFeedback({
    correct: true,
    feedback: 'Resposta correta! Ótimo trabalho.',
    execution_time_ms: 12.5,
    items_scanned: 3
});

// Confirmação
const confirmed = await showConfirm(
    'Usar dica?',
    'Custará 10 XP. Deseja continuar?'
);
```

---

### 8. ui/notifications.js

**Responsabilidade:** Toast notifications para feedback rápido.

**Exports:**
- `showNotification(message, type, duration)` - Toast notification
- `hideNotification()` - Oculta notification
- `showSuccess(message, duration)` - Notification de sucesso
- `showError(message, duration)` - Notification de erro
- `showWarning(message, duration)` - Notification de aviso
- `showInfo(message, duration)` - Notification informativa

**Tipos Disponíveis:**
- `success` ✅
- `error` ❌
- `warning` ⚠️
- `info` 💡
- `timeout` ⏰
- `hint` 🤖

**Exemplo:**
```javascript
import { showNotification, showSuccess } from './ui/notifications.js';

// Notification genérica
showNotification('Quiz iniciado!', 'info', 3000);

// Success
showSuccess('Resposta salva!', 2000);
```

---

## 🛠️ Módulos Utils

### 9. utils/timer.js

**Responsabilidade:** Gerenciamento do cronômetro do quiz.

**Exports:**
- `startTimer(seconds, onTimeout)` - Inicia cronômetro
- `stopTimer()` - Para cronômetro
- `updateTimerDisplay()` - Atualiza display
- `getElapsedTime()` - Tempo decorrido
- `getRemainingTime()` - Tempo restante
- `addTime(seconds)` - Adiciona tempo (bônus)
- `removeTime(seconds)` - Remove tempo (penalidade)
- `pauseTimer()` - Pausa
- `resumeTimer()` - Retoma
- `isTimerActive()` - Verifica se está ativo

**Features:**
- ✅ Alerta visual aos 30s (vermelho)
- ✅ Alerta crítico aos 10s (pulsante)
- ✅ Previne múltiplos timers simultâneos
- ✅ Callback quando tempo esgota

**Exemplo:**
```javascript
import { startTimer, stopTimer, addTime } from './utils/timer.js';

// Iniciar timer de 3 minutos
startTimer(180, () => {
    console.log('Tempo esgotado!');
    handleTimeout();
});

// Bônus de 30 segundos
addTime(30);

// Parar
stopTimer();
```

---

### 10. utils/validator.js

**Responsabilidade:** Validação de respostas do usuário.

**Exports:**
- `disableAnswerInputs()` - Desabilita todos os inputs
- `enableAnswerInputs()` - Habilita todos os inputs
- `getAnswerFromUI(question)` - Obtém resposta da interface
- `isAnswerValid(answerData, question)` - Valida se está preenchida
- `clearAnswerInputs()` - Limpa todos os inputs
- `isValidDynamoDBKey(key)` - Valida formato de chave DynamoDB
- `sanitizeInput(input)` - Sanitiza entrada

**Tipos de Questão Suportados:**
- `multiple_choice` - Radio buttons
- `open_ended` - Textarea
- `code` - Editor de código
- `key_design` - Inputs PK/SK

**Exemplo:**
```javascript
import { getAnswerFromUI, isAnswerValid, disableAnswerInputs } from './utils/validator.js';

// Obter resposta
const answer = getAnswerFromUI(currentQuestion);

// Validar
if (isAnswerValid(answer, currentQuestion)) {
    // Desabilitar inputs
    disableAnswerInputs();
    
    // Enviar para validação
    await validateAnswer(answer);
}
```

---

### 11. utils/markdown.js

**Responsabilidade:** Formatação de texto markdown para HTML.

**Exports:**
- `formatMarkdown(text)` - Converte markdown para HTML
- `stripHTML(html)` - Remove tags HTML
- `truncateHTML(html, maxLength, suffix)` - Trunca mantendo HTML válido
- `nl2br(text)` - Converte \n em <br>
- `html2markdown(html)` - Converte HTML para markdown (básico)

**Suporte Markdown:**
- **Bold**: `**texto**` → `<strong>texto</strong>`
- **Code Inline**: `` `código` `` → `<code>código</code>`
- **Code Block**: ` ```código``` ` → `<pre><code>código</code></pre>`
- **Bullets**: `• item` → `<ul><li>item</li></ul>`
- **Links**: `[texto](url)` → `<a href="url">texto</a>`
- **Line Breaks**: `\n\n` → `<br>`

**Features:**
- ✅ Proteção contra injeção (escape HTML)
- ✅ Preserva código sem formatar
- ✅ Links abrem em nova aba (`target="_blank"`)

**Exemplo:**
```javascript
import { formatMarkdown } from './utils/markdown.js';

const markdown = `
**Resposta Incorreta**

A chave \`USER#123\` não é ideal porque:
• Dificulta queries
• Não escala bem

\`\`\`
PK = "USER#123"
SK = "METADATA"
\`\`\`
`;

const html = formatMarkdown(markdown);
element.innerHTML = html;
```

---

## 🔗 Dependências Entre Módulos

```
config.js (base)
   ↓
├─ icons.js (isolado)
├─ state.js (depende: config)
├─ levels.js (depende: config, state)
└─ api.js (depende: config)

ui/screens.js (isolado)
ui/feedback.js (depende: icons, markdown)
ui/notifications.js (depende: icons)

utils/timer.js (depende: state, icons)
utils/validator.js (isolado)
utils/markdown.js (isolado)
```

---

## 📖 Como Usar

### Importação Básica

```javascript
// Importar módulo completo
import * as API from './js/api.js';
await API.startQuizSession('João', 'python', 'lab1');

// Importar funções específicas
import { showScreen, getCurrentScreen } from './js/ui/screens.js';
showScreen('quiz');
```

### Exemplo Completo

```javascript
// Importar dependências
import { API_URL, QUEST_LEVELS } from './js/config.js';
import { state, resetState } from './js/state.js';
import { updatePlayerLevel } from './js/levels.js';
import * as API from './js/api.js';
import { showScreen } from './js/ui/screens.js';
import { showLoading, showFeedback } from './js/ui/feedback.js';
import { showNotification } from './js/ui/notifications.js';
import { startTimer } from './js/utils/timer.js';
import { getAnswerFromUI, disableAnswerInputs } from './js/utils/validator.js';

// Iniciar quiz
async function startQuiz() {
    showLoading(true, 'Iniciando...');
    
    const session = await API.startQuizSession(
        state.playerName,
        state.language,
        'lab1'
    );
    
    state.sessionId = session.session_id;
    showScreen('quiz');
    startTimer(180);
    showLoading(false);
}

// Validar resposta
async function validate() {
    const answer = getAnswerFromUI(state.currentQuestion);
    disableAnswerInputs();
    
    showLoading(true, 'Validando...');
    const result = await API.validateAnswer(
        state.sessionId,
        state.currentQuestion.id,
        answer
    );
    showLoading(false);
    
    state.totalXP += result.xp_earned;
    updatePlayerLevel(state.totalXP);
    
    showFeedback(result);
    showNotification(
        result.correct ? 'Correto!' : 'Incorreto',
        result.correct ? 'success' : 'error'
    );
}
```

---

## ✅ Benefícios da Modularização

### Manutenibilidade
- ✅ Código organizado por responsabilidade
- ✅ Fácil localizar e corrigir bugs
- ✅ Alterações isoladas não quebram outros módulos

### Testabilidade
- ✅ Cada módulo pode ser testado isoladamente
- ✅ Mocks facilitados (imports ES6)
- ✅ Cobertura de testes mais precisa

### Reusabilidade
- ✅ Funções podem ser reutilizadas em outros projetos
- ✅ Import seletivo (tree-shaking)
- ✅ Documentação clara de APIs

### Performance
- ✅ Lazy loading possível
- ✅ Bundles menores (com webpack/rollup)
- ✅ Cache mais eficiente

---

## 🚀 Próximos Passos

### Curto Prazo
1. ✅ Criar módulo `ui/quiz.js` (renderização de questões)
2. ✅ Refatorar `app.js` como entry point
3. ✅ Atualizar `index.html` com `type="module"`
4. ✅ Testar integração de todos os módulos

### Médio Prazo
1. Adicionar testes unitários (Jest/Vitest)
2. Implementar code splitting
3. Adicionar TypeScript definitions
4. Criar build process (Vite/esbuild)

---

## 📝 Convenções

### Nomeação
- **Arquivos**: `kebab-case.js`
- **Funções**: `camelCase()`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Classes**: `PascalCase`

### Documentação
- JSDoc para funções públicas
- Comentários explicativos para lógica complexa
- README para cada módulo major

### Imports
- Sempre usar `.js` na extensão
- Imports relativos para módulos locais
- Ordem: core → ui → utils

---

**Criado em:** 2025-11-27  
**Versão:** 1.0.0  
**Status:** ✅ Modularização 83% completa (10/12 módulos)

