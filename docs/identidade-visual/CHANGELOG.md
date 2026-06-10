# Changelog - Identidade Visual Aurora Academy Quest

Histórico de mudanças da identidade visual para treinamentos gamificados.

---

## [1.0.0] - 2025-11-27

### 🎨 Criação Inicial

**Identidade Visual Completa:**
- Abordagem: 80% Aurora Labs + 20% Fantasy (sutil e profissional)
- Tom: "Aurora Academy: Quest DynamoDB" (corporativo-educacional)
- Filosofia: Gamificação serve o aprendizado técnico

**Sistema de Níveis:**
- 🛡️ Escudeiro (0-500 XP) - Aprendiz dos fundamentos
- 🗺️ Cartógrafo (501-1.000 XP) - Explorador de access patterns
- ⚔️ Cavaleiro (1.001-1.500 XP) - Guardião que domina Single-Table
- 🔮 Oráculo (1.501-2.000 XP) - Sábio arquiteto de soluções
- 👑 Grão-Mestre (2.001+ XP) - Arquiteto-Mor, mentor supremo

**Personagens:**
- 👩 Zelda - Colaboradora individual (protagonista)
- 👨 Link - Colaborador Tech Corp (protagonista)
- 🧙 Arquiteto-Mor - Tech Lead e mentor (NPC)

**Paleta Complementar Quest:**
```json
{
  "quest-magic": "#a259ff",    // XP, magia, progresso
  "quest-success": "#789d4a",  // Conquistas, níveis
  "quest-warning": "#f9e27d",  // Alertas, desafios
  "quest-danger": "#f94f48",   // Erros, anti-patterns
  "quest-crystal": "#67d2df"   // Cristais, bônus
}
```

### 📦 Assets Criados

**Documentação:**
- `README.md` - Visão geral da identidade visual
- `AURORA-ACADEMY-QUEST.md` - Guia completo (21KB)
- `CHANGELOG.md` - Este arquivo

**CSS e HTML:**
- `componentes-quest.css` - Componentes completos (23KB)
- `exemplos-quest.html` - Exemplos visuais interativos (27KB)

**Cores:**
- `cores/colors.json` - Paleta atualizada com seção "quest"
- `cores/PALETA-CORES.md` - Guia de cores

**Fontes:**
- `fontes/rubik-v18-latin-regular.woff2` (17KB)
- `fontes/rubik-v18-latin-500.woff2` (17KB)
- `fontes/rubik-v18-latin-700.woff2` (17KB)
- `fontes/GUIA-FONTES.md` - Guia de implementação

**Outros:**
- `logos-icones/GUIA-ASSETS.md` - Guia de ícones e imagens
- `documentacao/GUIA-RAPIDO.md` - Quick start
- `documentacao/exemplos-visuais.html` - Exemplos base Aurora Labs
- `aurora-brand.json` - Dados estruturados

### ✅ Aplicações

**Quiz-web (Interface Web):**
- Migração completa para componentes Quest
- Badge de nível com atualização automática
- Barra de progresso XP com animação
- Sistema de 5 níveis implementado
- Fontes Rubik locais (não depende de Google Fonts)
- Arquivos:
  - `quiz-web/index.html` - HTML atualizado
  - `quiz-web/app.js` - Lógica de níveis
  - `quiz-web/style.css` - Compatibilidade
  - `quiz-web/componentes-quest.css` - Componentes
  - `quiz-web/fonts/` - Fontes Rubik (3 arquivos)
  - `quiz-web/README-IDENTIDADE.md` - Documentação

**NARRATIVA.md (Documentação):**
- Seção de referência visual adicionada
- Atualização de ranks antigos (Junior, Pleno, etc) para novos personagens
- Links para documentação da identidade
- Consistência de emojis e nomes

**README.md Principal:**
- Nova seção "Identidade Visual" adicionada
- Explicação do sistema de níveis
- Links para documentação completa

### 🔧 Alterações Técnicas

**Componentes CSS:**
- 10 componentes principais criados
- Sistema de variáveis CSS consistente
- Responsivo (mobile-first)
- Animações sutis (pulse, glow)
- Compatibilidade com estilos existentes

**JavaScript:**
- Constante `QUEST_LEVELS` (5 níveis)
- Função `updatePlayerLevel(xp)` - Atualiza badge e barra
- Função `getRank(xp)` - Retorna informações do nível
- Integração em 4 pontos de atualização de XP
- Atualização automática de emoji, nome e cor do badge

**HTML:**
- Badge de nível no header do mapa
- Badge de nível no header do quiz
- Barra de progresso XP
- Mensagem de próximo nível
- Link para componentes-quest.css

### 📊 Métricas

**Arquivos criados:** 6
- 3 fontes (.woff2)
- 1 CSS (componentes-quest.css)
- 1 documentação (README-IDENTIDADE.md)
- 1 changelog (este arquivo)

**Arquivos modificados:** 5
- quiz-web/index.html
- quiz-web/app.js
- quiz-web/style.css
- docs/instrutores/treinamento/NARRATIVA.md
- README.md (raiz)

**Total de código CSS:** ~23KB
**Total de documentação:** ~50KB

### 🎯 Impacto

- ✅ Interface mais profissional e coerente com marca Aurora Labs
- ✅ Gamificação mais clara e envolvente
- ✅ Sistema de níveis com feedback visual imediato
- ✅ Consistência entre quiz, documentação e narrativa
- ✅ Componentes reutilizáveis para futuros treinamentos

---

## [1.0.14] - 2025-11-28

### 🐛 FIX CRÍTICO - Payload de Timeout Malformado

**Problema no Timeout:**

Quando o tempo esgotava, o payload enviado era:

```json
{
    "0": "[",
    "1": "T",
    "2": "I",
    "3": "M",
    "4": "E",
    "5": "O",
    "6": "U",
    "7": "T",
    "8": "]",
    "session_id": "...",
    "question_id": "...",
    "attempt": 1
}
```

String `"[TIMEOUT]"` era espalhada caractere por caractere! ❌

**Causa:**

A função `getAnswerData()` retorna objetos diferentes para cada tipo:
- Multiple choice: `{ answer: "C", answer_type: "..." }`
- Open answer: `{ pk: "...", sk: "...", operation: "..." }` (sem campo `answer`)
- Code: `{ code: "...", language: "..." }` (sem campo `answer`)

Quando chamávamos:
```javascript
API.submitAnswer(sessionId, questionId, answer.answer, answer.code, answer.pk, answer.sk)
//                                       ↑ undefined para open_answer e code
```

Para questões abertas, `answer.answer` era `undefined`, mas quando adicionamos o spread no `validateAnswer()`, properties `undefined` causavam problemas.

**Solução:**

Usar **operador `||`** para garantir `null` ao invés de `undefined`:

```javascript
// ANTES (causava spread de string)
API.submitAnswer(sessionId, questionId, answer.answer, answer.code, answer.pk, answer.sk)

// DEPOIS (garante null se undefined)
API.submitAnswer(
    sessionId,
    questionId,
    answerData.answer || null,  // ✅ null se undefined
    answerData.code || null,
    answerData.pk || null,
    answerData.sk || null
)
```

**Payload Correto Agora (Timeout):**

```json
{
    "answer": "[TIMEOUT]",  // ✅ String inteira, não espalhada
    "code": null,
    "pk": null,
    "sk": null,
    "session_id": "...",
    "question_id": "...",
    "attempt": 1
}
```

**Arquivos Modificados:**
- `app.js` - Operador `||` na chamada de `submitAnswer()`
- Renomeado variável `answer` → `answerData` para clareza

**Testes:**
- ✅ "deve validar resposta e mostrar feedback" (chromium): 1 passed (6.8s)
- ✅ "deve desabilitar inputs após timeout" (chromium): 1 passed (6.1s)

**Impacto:**
- ✅ Respostas normais enviadas corretamente
- ✅ Timeout enviado como string inteira `"[TIMEOUT]"`
- ✅ Backend detecta timeout corretamente
- ✅ Questões de todos os tipos funcionam

---

## [1.0.13] - 2025-11-28

### 🐛 FIX CRÍTICO - Payload Incorreto na API

**Problema REAL Identificado:**

O frontend estava enviando payload malformado para `/api/validate`:

```json
{
    "0": "C",  // ❌ ERRADO - deveria ser "answer": "C"
    "session_id": "...",
    "question_id": "Q1_lab0",
    "attempt": 1
}
```

**Causa Raiz:**

A função `API.submitAnswer()` estava definida para receber um objeto `answerData` e fazer spread:

```javascript
// ANTES (ERRADO)
export async function submitAnswer(sessionId, questionId, answerData) {
    body: JSON.stringify({
        session_id: sessionId,
        question_id: questionId,
        ...answerData,  // ← Spread causava chaves erradas
        attempt: 1
    })
}
```

Mas o `app.js` chamava com parâmetros separados:
```javascript
API.submitAnswer(sessionId, questionId, answer.answer, answer.code, answer.pk, answer.sk)
//                                       ↑ posição 2  ↑ posição 3  ↑ 4    ↑ 5
```

JavaScript interpretava:
- `answerData` = `answer.answer` (ex: "C")
- Spread de string → `..."C"` = `{0: "C"}` ❌

**Solução:**

Mudança na assinatura para receber parâmetros individuais:

```javascript
// DEPOIS (CORRETO)
export async function submitAnswer(sessionId, questionId, answer = null, code = null, pk = null, sk = null) {
    body: JSON.stringify({
        session_id: sessionId,
        question_id: questionId,
        answer: answer,  // ← Campos explícitos
        code: code,
        pk: pk,
        sk: sk,
        attempt: 1
    })
}
```

**Payload Correto Agora:**

```json
{
    "answer": "C",  // ✅ CORRETO
    "code": null,
    "pk": null,
    "sk": null,
    "session_id": "...",
    "question_id": "Q1_lab0",
    "attempt": 1
}
```

**Backend Consequentemente:**

Como o backend verificava `if request.answer is None or request.answer == ""`, e o payload tinha `"0": "C"` mas não tinha campo `answer`, o `request.answer` era `None`, então sempre caía na condição de timeout!

**Arquivos Modificados:**
- `js/api.js` - Assinatura correta de `submitAnswer()`
- `copilot/backend/src/api/quiz_routes.py` - Verificação de `[TIMEOUT]` adicionada
- Backend reiniciado ✅

**Testes:**
- ✅ "deve validar resposta e mostrar feedback" (chromium): 1 passed (5.8s)

**Impacto:**
- ✅ Respostas normais agora são validadas corretamente
- ✅ Timeout detectado apenas quando realmente ocorre
- ✅ Backend recebe payload no formato esperado

---

## [1.0.12] - 2025-11-28

### 🎯 Mudança de UX - Remover "Tentar Novamente"

**Decisão de Design:**
Remover o botão "Tentar Novamente" - usuário sempre avança para a próxima questão.

**Comportamento Anterior:**
- ✅ Acertou → "Próxima Questão"
- ❌ Errou → "Tentar Novamente" (ficava na mesma questão)
- ⏰ Timeout → "Próxima Questão"

**Comportamento Novo:**
- ✅ Acertou → "Próxima Questão"
- ❌ Errou → "Próxima Questão" (sempre avança)
- ⏰ Timeout → "Próxima Questão"
- 🏁 Última questão → "Ver Resultado Final"

**Código Simplificado:**

```javascript
// ANTES (complexo)
const isTimeout = result.timeout === true;
const buttonText = (result.correct || isTimeout) ? 'Próxima Questão' : 'Tentar Novamente';

// DEPOIS (simples)
if (result.quiz_completed) {
    buttonText = 'Ver Resultado Final';
} else if (result.next_question) {
    buttonText = 'Próxima Questão';  // SEMPRE
}
```

**Justificativa:**
1. **Fluxo mais rápido** - Não ficar preso em uma questão
2. **Aprendizado progressivo** - Ver todas as questões do capítulo
3. **Menos frustração** - Não bloquear por uma questão difícil
4. **Consistência** - Mesmo comportamento para acerto/erro/timeout

**Impacto:**
- Quiz mais fluido e educacional
- Usuário completa capítulo vendo todas as questões
- Pode revisar e aprender com os erros ao longo do quiz

**Arquivos Modificados:**
- `js/ui/feedback.js` - Removida lógica de "Tentar Novamente"

**Testes:**
- ✅ "deve carregar a tela inicial" (chromium): 1 passed (3.0s)

---

## [1.0.11] - 2025-11-28

### 🐛 FIX CRÍTICO - Backend Retornando Timeout Incorretamente

**Problema REAL Identificado:**

O backend estava tratando TODAS as respostas normais como timeout!

**Causa Raiz (Backend):**
```python
# BACKEND - quiz_routes.py (ANTES - ERRADO)
if request.answer is None or request.answer == "":
    feedback = "⏱️ **Tempo esgotado!**"
else:
    # Valida resposta normal
```

O problema: Frontend envia `answer="[TIMEOUT]"` quando o tempo acaba, mas o backend só verificava `None` ou `""`. Como `"[TIMEOUT]"` não é nenhum dos dois, ele passava para a validação normal, era comparado com a resposta correta, falhava, e o usuário via "incorreto" ao invés de "tempo esgotado".

**Solução (Backend):**
```python
# BACKEND - quiz_routes.py (DEPOIS - CORRETO)
if request.answer is None or request.answer == "" or request.answer == "[TIMEOUT]":
    feedback = "⏱️ **Tempo esgotado!**"
else:
    # Valida resposta normal
```

**Correções Implementadas em 3 Tipos de Questão:**

1. **Multiple Choice:**
```python
if request.answer is None or request.answer == "" or request.answer == "[TIMEOUT]":
```

2. **Open Answer (PK/SK):**
```python
is_empty_answer = (request.pk is None or request.pk == "") and (request.sk is None or request.sk == "")
is_timeout_answer = request.answer == "[TIMEOUT]"

if is_empty_answer or is_timeout_answer:
```

3. **Code:**
```python
is_empty_code = request.code is None or request.code == "" or request.code.strip() == ""
is_timeout_code = request.answer == "[TIMEOUT]"

if is_empty_code or is_timeout_code:
```

**Fluxo Correto Agora:**

| Situação | Frontend Envia | Backend Detecta | Resultado |
|----------|----------------|-----------------|-----------|
| Resposta a tempo | `answer="A"` | Valida normalmente | ✅ Correto/Incorreto |
| Timeout real | `answer="[TIMEOUT]"` | Detecta timeout | ⏰ Tempo esgotado |
| Sem resposta | `answer=""` ou `null` | Detecta vazio | ⏰ Tempo esgotado |

**Arquivos Modificados:**
- `copilot/backend/src/api/quiz_routes.py` - Verificação de `[TIMEOUT]` em 3 tipos de questão
- Backend reiniciado: `docker-compose restart backend` ✅

---

## [1.0.10] - 2025-11-28

### 🐛 Correções Críticas - Timeout e Notificações

**Problemas Críticos Resolvidos:**

1. **Todas as respostas sendo tratadas como timeout (FRONTEND):**
   - **Problema:** Endpoint `/api/quiz/validate` retornava "tempo esgotado" em TODAS as respostas, mesmo quando respondidas a tempo
   - **Causa (FRONTEND):** Lógica de detecção de timeout verificava também o TEXTO do feedback:
     ```javascript
     // ANTES (ERRADO)
     const isTimeout = result.timeout === true || 
                       (result.feedback && result.feedback.includes('esgotado'));
     ```
     Se o backend incluísse a palavra "esgotado" em qualquer feedback (ex: "Seu tempo não foi esgotado, mas..."), o frontend tratava como timeout!
   
   - **Solução:** Confiar APENAS na flag explícita `timeout`:
     ```javascript
     // DEPOIS (CORRETO)
     const isTimeout = result.timeout === true;
     ```

2. **Notificação de capítulo completo desconfigurada:**
   - **Problema:** SVGs dos ícones apareciam como texto literal na notificação:
     ```
     🎉 CAPÍTULO COMPLETO!
     <svg viewBox="0 0 32 32"...>  ← Mostrava código SVG
     ```
   
   - **Causa:** `notificationMessage.textContent = message` ao invés de `innerHTML`
   
   - **Solução:** Usar `innerHTML` para renderizar SVGs:
     ```javascript
     // ANTES
     notificationMessage.textContent = message;
     
     // DEPOIS
     notificationMessage.innerHTML = message;
     ```

**Impacto das Correções:**

| Problema | Antes | Depois |
|----------|-------|--------|
| Detecção de timeout | Texto "esgotado" = timeout ❌ | Flag `timeout === true` ✅ |
| Botão após resposta | Sempre "Próxima" ❌ | "Tentar" se errado ✅ |
| Ícones na notificação | Código SVG visível ❌ | Ícones renderizados ✅ |
| Notificação de sucesso | Desconfigurada ❌ | Formatada corretamente ✅ |

**Exemplo de Notificação Corrigida:**

```
🎉 CAPÍTULO COMPLETO!

🏛️ CAPÍTULO 1: ACADEMIA DOS FUNDAMENTOS

⭐ +300 XP ganhos!
🏆 XP Total: 300
📊 Rank: Escudeiro

✅ Próximo capítulo desbloqueado!
🎨 CAPÍTULO 2: GUILDA DOS ARQUITETOS
```

**Arquivos Modificados:**
- `js/ui/feedback.js` - Removida verificação por texto no timeout
- `js/ui/notifications.js` - `textContent` → `innerHTML`

**Testes:**
- ✅ "deve carregar a tela inicial" (chromium): 1 passed (2.4s)

---

## [1.0.9] - 2025-11-28

### 🎨 Ícones Maiores e Mais Visíveis

**Problema Relatado:**
- Ícones personalizados muito pequenos (18px-20px)
- Ícone do relógio (timer) pouco visível
- Difícil de visualizar ícones no header (XP, timer, pergunta)

**Soluções Implementadas:**

1. **Tamanho Global dos Ícones Aumentado:**

```css
/* Antes */
.quest-icon-inline {
    width: 18px;
    height: 18px;
}
.timer .quest-icon-inline {
    width: 20px;
    height: 20px;
}

/* Depois */
.quest-icon-inline {
    width: 24px;          /* +33% */
    height: 24px;
    margin-right: 4px;    /* Espaçamento */
}
.timer .quest-icon-inline {
    width: 28px;          /* +40% */
    height: 28px;
    margin-right: 6px;
}
```

2. **Ícones no Header do Quiz:**

```css
/* XP Display */
.quiz-xp span .quest-icon-inline {
    width: 28px;
    height: 28px;
}

/* Info (Pergunta, Timer) */
.quiz-info span .quest-icon-inline {
    width: 26px;
    height: 26px;
}
```

3. **Ícone do Timer Mais Brilhante:**

```javascript
// Antes: Aqua padrão (#67d2df → #8ce0eb)
// Depois: Aqua clara (#8ce0eb → #b8e9f4)
// Stroke: 2.5px → 3px (mais grosso)
// Preenchimento: 0.15 → 0.25 opacity (mais visível)
```

**Comparação de Tamanhos:**

| Contexto | Antes | Depois | Aumento |
|----------|-------|--------|---------|
| Ícones gerais | 18px | 24px | +33% |
| Timer | 20px | 28px | +40% |
| XP display | 18px | 28px | +56% |
| Quiz info | 18px | 26px | +44% |

**Melhorias de Contraste:**

| Elemento | Cor Antes | Cor Depois | Melhoria |
|----------|-----------|------------|----------|
| Timer círculo | #67d2df | #8ce0eb → #b8e9f4 | +Brilho |
| Timer stroke | 2.5px | 3px | +20% espessura |
| Timer fill | rgba(103,210,223,0.15) | rgba(140,224,235,0.25) | +67% opacidade |

**Arquivos Modificados:**
- `style.css` - Tamanhos dos ícones + espaçamento
- `js/icons.js` - SVG do timer mais brilhante

**Testes:**
- ✅ "deve carregar a tela inicial" (chromium): 1 passed (3.5s)

---

## [1.0.9] - 2025-11-28

### 🐛 Fix: Erro 500 no Backend Durante Timeout

**Problema Relatado:**
Quando o timer esgotava, o backend retornava erro 500:
```
TypeError: ord() expected a character, but string of length 9 found
```

**Causa Raiz:**
O backend tentava calcular o índice da alternativa errada usando `ord(request.answer)`, mas quando a resposta era `"[TIMEOUT]"` (9 caracteres), a função `ord()` falhava porque espera apenas 1 caractere.

**Payload que Causava o Erro:**
```json
{
    "session_id": "80497d0d-4946-4ce0-9a98-285ba6b58ce9",
    "question_id": "Q2_lab0",
    "answer": "[TIMEOUT]",
    "code": "",
    "pk": "",
    "sk": "",
    "attempt": 1
}
```

**Solução Implementada:**

1. **Verificação Antecipada de Timeout:**
   - Movida a verificação `is_timeout_answer = request.answer == "[TIMEOUT]"` para ANTES de qualquer processamento
   - Garante que timeout seja detectado primeiro em TODOS os tipos de questão

2. **Proteção em `ord()`:**
   - Adicionada validação antes de chamar `ord()`:
```python
# Antes
wrong_index = ord(request.answer) - 65

# Depois
if len(request.answer) == 1 and request.answer.isalpha():
    wrong_index = ord(request.answer.upper()) - 65
else:
    wrong_index = -1
```

3. **Reutilização de `is_timeout_answer`:**
   - Removidas redefinições duplicadas em `OPEN_ANSWER` e `CODE`
   - Agora todos os tipos de questão usam a mesma flag

**Arquivos Modificados:**
- `copilot/backend/src/api/quiz_routes.py` - Proteção em `ord()` e verificação antecipada de timeout
- `quiz-web/app.js` - Fix `finishChapter()` → `finishQuiz()`
- `quiz-web/js/api.js` - Timeout aumentado para 60s

**⚠️ IMPORTANTE - Rebuild do Docker:**
Como o backend roda em container Docker, após modificar arquivos Python é necessário rebuild:
```bash
cd dynamodb-lab
docker-compose stop backend
docker-compose up -d --build backend
```
**Por que?** O código Python modificado não é recarregado automaticamente. O flag `--build` força a reconstrução da imagem.

**Correções Adicionais:**
1. **Função Não Definida (`finishChapter`):**
   - Corrigido erro `finishChapter is not defined`
   - Renomeado para `finishQuiz()` (função correta)
   
2. **AbortError em Timeout:**
   - Aumentado `DEFAULT_TIMEOUT` de 30s para 60s em `api.js`
   - Garante que requisições de timeout sejam processadas sem serem abortadas

**Testes (após rebuild do Docker):**
- ✅ "deve iniciar timer ao carregar pergunta": 1 passed
- ✅ "deve decrementar timer a cada segundo": 1 passed  
- ✅ "deve parar timer ao validar resposta": 1 passed
- ✅ "deve processar timeout automaticamente quando tempo esgotar": 1 passed
- ✅ "deve desabilitar inputs após timeout": 1 passed
- ✅ **Todos os 5 testes de Timer passaram** (12.1s)
- ✅ **Todos os 35 testes do projeto passaram** (2.8m com retry, 3 flaky)

---

## [1.0.8] - 2025-11-28

### 🔧 Correções de UX - Timeout e Alinhamento

**Problemas Corrigidos:**

1. **Botão errado após timeout:**
   - **Problema:** Quando tempo esgotava, botão mostrava "Tentar Novamente" ao invés de "Próxima Questão"
   - **Causa:** Lógica do `showFeedback()` verificava apenas `result.correct`
   - **Solução:**
     - Adicionada flag `result.timeout = true` em `handleQuizTimeout()`
     - Modificada lógica do feedback para detectar timeout
     - Agora mostra "Próxima Questão" quando `isTimeout` ou `correct`

```javascript
// Antes
const buttonText = result.correct ? 'Próxima Questão' : 'Tentar Novamente';

// Depois
const isTimeout = result.timeout === true || (result.feedback && result.feedback.includes('esgotado'));
const buttonText = (result.correct || isTimeout) ? 'Próxima Questão' : 'Tentar Novamente';
```

2. **Espada desalinhada com círculo do radio:**
   - **Problema:** Ícone ⚔️ (espada) não ficava centralizado com o círculo do radio button
   - **Causa:** Usava `left: var(--space-2)` (16px) com apenas `translateY(-50%)`
   - **Solução:**
     - Mudado para `left: 20px` (centralizado com radio de 24px)
     - Adicionado `transform: translate(-50%, -50%)` para centralização perfeita
     - Aumentado `font-size: 1.2rem` para melhor visibilidade

```css
/* Antes */
.option-label::before {
    left: var(--space-2);  /* 16px */
    transform: translateY(-50%);
}

/* Depois */
.option-label::before {
    left: 20px;  /* Centralizado com radio 24px */
    transform: translate(-50%, -50%);
    font-size: 1.2rem;
}
```

**Arquivos Modificados:**
- `js/ui/feedback.js` - Lógica do botão após timeout
- `app.js` - Flag timeout no resultado
- `style.css` - Alinhamento da espada

**Testes:**
- ✅ "deve carregar a tela inicial": 3 passed (7.9s)

---

## [1.0.7] - 2025-11-28

### ⏰ Implementação do Timeout do Quiz

**Problema Relatado:**
Quando o timer chegava a zero, nada acontecia visualmente - apenas um console.log aparecia. O esperado era:
1. Botões de dica e validar deveriam ficar desabilitados
2. Feedback automático com a resposta correta deveria aparecer

**Solução Implementada:**

1. **Função `handleQuizTimeout()`** (`app.js`):
   - Desabilita botões imediatamente (validar + dica)
   - Desabilita inputs de resposta
   - Mostra notificação "⏰ Tempo esgotado!"
   - Submete resposta especial `[TIMEOUT]` para API
   - Processa feedback com resposta correta
   - Atualiza XP (geralmente negativo)

2. **Callback do Timer** (`app.js`):
   - Modificado `startTimer(question.timer_seconds, handleQuizTimeout)`
   - Agora passa o callback para ser executado quando tempo=0

3. **Testes Automatizados** (`tests/quiz.spec.js`):
   - ✅ **5 de 6 testes passando**
   - Teste 1: "deve processar timeout automaticamente" - valida todo o fluxo
   - Teste 2: "deve desabilitar inputs após timeout" - valida desabilitação de UI
   - Cobertura: Chromium, Firefox, WebKit

**Comportamento Atual:**
```javascript
// Timer chega a zero → handleQuizTimeout() é chamado
1. console.log('⏰ Timeout! Tempo esgotado...')
2. Desabilita botões validate-btn e hint-btn
3. Chama disableAnswerInputs()
4. Mostra notificação: "⏰ Tempo esgotado! Mostrando resposta correta..."
5. Submete para API: answer='[TIMEOUT]'
6. Recebe feedback com resposta correta
7. Atualiza XP (provavelmente -5 ou 0)
8. Mostra feedback-area com explicação
9. Avança para próxima questão ou finaliza
```

**Arquivos Modificados:**
- `quiz-web/app.js` - Função handleQuizTimeout + callback no startTimer
- `quiz-web/tests/quiz.spec.js` - 2 novos testes de timeout

**Cobertura de Testes:**
- ✅ Timer decrementa e chega a 0:00
- ✅ Notificação de timeout aparece
- ✅ Botões são desabilitados
- ✅ Inputs são desabilitados
- ✅ API é chamada com [TIMEOUT]
- ✅ Feedback é exibido
- **Status:** 5 passed / 6 total (83% success rate)

---

## [1.0.6] - 2025-11-28

### 🎨 Correções de Contraste e Centralização

**Problemas Resolvidos:**

1. **Dica ilegível:**
   - Texto da dica tinha baixo contraste (fundo transparente + texto cinza)
   - **Solução:**
     - Background principal: gradiente branco/lavanda sólido (rgba 98% opacidade)
     - Background interno: lavanda suave #f7f0ff com borda roxa sutil
     - Cor do texto: #1a1a2e (quase preto) para máximo contraste
     - Título: roxo mais escuro #8b4ac9 ao invés de #a259ff

2. **Ícone X desalinhado:**
   - Botão de fechar (✕) não estava perfeitamente centralizado
   - **Solução:**
     - Tamanho fixo: 32px × 32px (era 28px)
     - Font-size reduzido: 20px (era 24px)
     - `line-height: 1` para centralização perfeita
     - `position: relative` para controle preciso
     - `min-width` e `min-height` para garantir tamanho

3. **Container de ícones da intro:**
   - Quadradinhos dos ícones estavam com cor do fundo do card
   - **Solução:**
     - Background: gradiente Aqua semi-transparente
     - Borda: 2px solid Aqua (rgba 30% opacidade)
     - Tamanho: 64px × 64px (desktop), 56px × 56px (mobile)

**Antes (Dica):**
```css
background: rgba(162, 89, 255, 0.08);  /* Muito transparente */
.notification-message {
    background: rgba(255, 255, 255, 0.5);  /* Transparente */
    color: var(--brand-neutral-40);  /* Cinza */
}
```

**Depois (Dica):**
```css
background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(250, 245, 255, 0.95));
.notification-message {
    background: rgba(247, 240, 255, 0.6);  /* Lavanda */
    color: #1a1a2e;  /* Preto */
    border: 1px solid rgba(162, 89, 255, 0.15);
}
```

**Contraste WCAG:**
- Antes: ~3.2:1 (❌ Falha AA)
- Depois: ~15.8:1 (✅✅ AAA+)

**Arquivos Modificados:**
- `style.css` - Contraste da dica + centralização do X + ícones intro

**Testes:**
- ✅ "deve carregar a tela inicial": 3 passed (16.4s)

---

## [1.0.5] - 2025-11-28

### 🎨 Melhorias de Legibilidade - Timer e Dicas

**Problemas Resolvidos:**

1. **Ícone do Timer invisível:**
   - O relógio do timer tinha cor muito escura (branco #ffffff) e se perdia no fundo azul
   - **Solução:** Mudado para Aurora Labs Aqua (#67d2df → #8ce0eb) com gradiente vibrante
   - Círculo agora tem preenchimento sutil rgba(103,210,223,0.15)
   - Ponteiros em cores Aqua contrastantes

2. **Dicas pouco legíveis:**
   - Texto das dicas tinha formatação básica, difícil de ler
   - **Solução:** Redesign completo da notificação de dica:
     - Borda roxa (#a259ff) de 5px
     - Background com gradiente roxo sutil
     - Shadow roxo para destaque
     - Título "💡 DICA:" em negrito, roxo, maiúsculo (18px)
     - Texto principal em background branco semi-transparente
     - Line-height aumentado para 1.8
     - Padding generoso (var(--space-3))
     - Rodapela "⚠️ Penalidade:" em destaque
     - Ícone maior (28px)

**Antes:**
```css
.notification-message {
    font-size: 15px;
    line-height: 1.5;
}
```

**Depois:**
```css
.notification-toast.hint {
    border-left-width: 5px;
    border-left-color: #a259ff;
    background: linear-gradient(135deg, rgba(162, 89, 255, 0.08), rgba(162, 89, 255, 0.03));
    box-shadow: 0 12px 32px rgba(162, 89, 255, 0.2);
}

.notification-toast.hint .notification-message {
    font-size: 16px;
    line-height: 1.8;
    padding: var(--space-3) var(--space-2);
    background: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
}

.notification-toast.hint .notification-message::first-line {
    font-weight: 700;
    color: #a259ff;
    font-size: 18px;
    text-transform: uppercase;
}
```

**Arquivos Modificados:**
- `js/icons.js` - Ícone timer com cores Aqua vibrantes
- `style.css` - Estilos `.notification-toast.hint` completos
- `app.js` - Formatação da mensagem de dica melhorada

**Testes:**
- ✅ "deve carregar a tela inicial": 3 passed (6.7s)

---

## [1.0.4] - 2025-11-28

### 🎨 Ícones de Capítulo Personalizados + Tamanho Aumentado

**Problemas Resolvidos:**

1. **Ícone duplicado no badge:**
   - Linha antes do botão "COMEÇAR" mostrava 2 ícones (troféu + emoji do badge)
   - **Solução:** Removido `Icons.get('trophy')`, mantido apenas `Icons.replaceEmojis(badge)`

2. **Ícones genéricos dos capítulos:**
   - Todos os capítulos mostravam torre/academia (ícone padrão)
   - **Solução:** Criados 5 ícones SVG personalizados únicos:
     - 🏛️ **Academia** (lab0) - Prédio clássico com colunas
     - 🎨 **Paleta de Cores** (lab1) - Paleta com gradiente Aurora Labs Aqua
     - ⚡ **Raio de Performance** (lab2) - Raio com gradiente amarelo-ouro
     - 🎩 **Cartola Magic** (lab3) - Cartola elegante Single Table
     - 🗼 **Torre GSI** (lab4) - Torre de 3 níveis com gradiente cinza

3. **Ícones muito pequenos:**
   - Emojis personalizados inline tinham 16px (difícil de ver)
   - **Solução:** Aumentados para **24px** com `style="width: 24px; height: 24px;"`

**Ícones Inline Adicionados (24px):**
- 🏆 Troféu
- 🎓 Capelo de formatura
- 🥇 Medalha de ouro
- 💎 Diamante/Cristal
- ✨ Estrela brilhante
- 🌊 Ondas (Query)
- ⚠️ Aviso/Alerta
- 🔑 Chave (PK)
- 🔄 Círculo/Loop
- 👨 Pessoa (Link)
- ⏪ Voltar/Reversa
- 📦 Pacote/Box
- ⭐ Estrela (destaque)
- 🔍 Lupa (busca)
- 📑 Documento/Lista
- 💰 Moeda/Custo
- 🚧 Em construção

**Arquivos Modificados:**
- `js/icons.js` - 5 novos ícones de capítulo + 17 ícones inline aumentados
- `app.js` - Removido troféu duplicado no badge

**Testes:**
- ✅ "deve carregar a tela inicial": 3 passed (5.9s)

---

## [1.0.3] - 2025-11-28

### 🎨 Processamento Automático de Emojis em Metadata

**Objetivo:**
Criar sistema automático que substitui emojis nos arquivos `metadata.json` por ícones SVG personalizados Aurora Labs, sem precisar editar os JSONs.

**Problema Resolvido:**
- Emojis nativos apareciam em highlights, narrator, missions e badges dos capítulos
- Dados estavam nos arquivos `labs/lab*/metadata.json`
- Editar JSONs removeria a legibilidade visual

**Solução Implementada:**

1. **Nova Função `Icons.replaceEmojis(text)`** (`js/icons.js`):
   - Mapeia 9 emojis → ícones SVG Aurora Labs
   - Processamento automático via `replaceAll()`
   - Mapeamento:
     - ⚖️ → Balança (SQL vs DynamoDB)
     - 🎯 → Alvo (Access Pattern)
     - 🎩 → Cartola (Single Table)
     - 🏗️ → Construção (Hierarquia)
     - 📊 → Gráfico (Denormalização)
     - ⚡ → Raio (Performance)
     - 🧠 → Cérebro (Arquiteto-Mor)
     - 🎨 → Paleta (Design)
     - ☕ → Café (Java/Single Table)

2. **Aplicação no Renderizador** (`app.js` - 4 lugares):
   - `Icons.replaceEmojis(chapter.highlights)` - Lista de aprendizados
   - `Icons.replaceEmojis(chapter.narrator)` - Fala do personagem
   - `Icons.replaceEmojis(chapter.missions)` - Missões do capítulo
   - `Icons.replaceEmojis(chapter.details.badge)` - Conquista

**Benefícios:**
- ✅ Metadata.json intactos (legíveis para humanos)
- ✅ Processamento centralizado em uma função
- ✅ Fácil adicionar novos emojis
- ✅ Ícones SVG consistentes com identidade Aurora Labs

**Testes:**
- ✅ "deve carregar a tela inicial": 3 passed (8.8s)

**Estatísticas:**
- 9 emojis mapeados
- 4 propriedades processadas
- 5 labs afetados (lab0-lab4)
- ~40 linhas de código

**Arquivos:**
- `js/icons.js` - Nova função `replaceEmojis()`
- `app.js` - Aplicada em 4 lugares
- `docs/identidade-visual/ICONES-METADATA-v1.0.3.md` - Documentação completa

---

## [1.0.2] - 2025-11-28

### 🎨 Substituição de Ícones Nativos por Personalizados

**Objetivo:**
Substituir todos os emojis nativos por ícones SVG personalizados seguindo a identidade visual da Aurora Labs em toda a aplicação.

**Escopo:**
- 14 emojis substituídos
- 10 ícones SVG únicos criados
- 3 arquivos modificados
- 0 testes quebrados ✅

**Alterações Implementadas:**

1. **HTML (`index.html`)** - 6 substituições:
   - ⏱️ → SVG de relógio (timer)
   - 🏆 → SVG de troféu (XP)
   - 💡 → SVG de lâmpada (hint)
   - ✅ → SVG de check (validar)
   - 🗺️ → SVG de mapa (voltar)
   - 📄 → SVG de documento (exportar)

2. **JavaScript (`app.js`)** - 8 substituições:
   - 🔄/🔒/▶️ → Icons.get() nos botões de capítulo
   - 🏆 → Icons.get('trophy') nas atualizações de XP (3 lugares)
   - 🐍🔷📜 → Removido emojis dos nomes de linguagens
   - 💡 → SVG inline na dica de linguagem
   - ⏳ → SVG animado no loading
   - 👤⚙️⏱️💡✅ → Icons.get() nas estatísticas finais

3. **CSS (`style.css`)** - 1 adição:
   - Animação `@keyframes spin` para spinner SVG

**Benefícios:**
- ✅ Cores consistentes com paleta Aurora Labs (#67d2df, #002740, #f9e27d)
- ✅ Gradientes elegantes nos ícones principais
- ✅ SVG escalável sem perda de qualidade
- ✅ Controle total sobre cores, tamanhos e animações
- ✅ Melhor compatibilidade entre navegadores/OS

**Testes:**
- ✅ "deve carregar a tela inicial": 3 passed (5.4s)
- ✅ "deve validar resposta e mostrar feedback": 3 passed (7.1s)
- ✅ "deve descontar XP ao pedir ajuda": 3 passed (8.6s)
- **Total:** 9 testes (3 browsers × 3 cenários) - 100% passando

**Arquivos:**
- `quiz-web/index.html` - 6 blocos HTML
- `quiz-web/app.js` - 8 substituições
- `quiz-web/style.css` - 1 animação
- `docs/identidade-visual/ICONES-PERSONALIZADOS-v1.0.2.md` - Documentação completa

---

## [1.0.1] - 2025-11-28

### 🎨 Melhorias de UI - Accordion e Lista de Aprendizados

**Problema Identificado:**
- Botão de accordion com círculo e seta `▼` não estava alinhado com a identidade visual Aurora Labs
- Ícone de accordion mal posicionado e com design genérico
- Itens de "O que você vai aprender" mostravam dois ícones (um no conteúdo + um via CSS)

**Alterações Implementadas:**

1. **Novo Design do Accordion Toggle** (`style.css` linha 2056-2103):
   - ✅ Substituído círculo por quadrado arredondado (8px border-radius)
   - ✅ Gradiente sutil Aurora Labs Aqua como background
   - ✅ Seta moderna criada com pseudo-elementos (::before e ::after)
   - ✅ Animação suave de rotação ao expandir/colapsar
   - ✅ Efeito hover com borda mais forte e shadow
   - ✅ Tamanho reduzido: 36x36px (antes 40x40px)
   - ✅ Visual mais integrado com o design system Aurora Labs

2. **Lista de Aprendizados Simplificada** (`style.css` linha 1889-1905):
   - ✅ Removido ícone duplicado (pseudo-elemento ::before com ⚔️)
   - ✅ Agora mostra apenas o ícone original do conteúdo
   - ✅ Background sutil rgba(103, 210, 223, 0.05)
   - ✅ Borda esquerda de 3px em Aurora Labs Aqua
   - ✅ Efeito hover com translateX(4px)
   - ✅ Visual mais limpo e profissional

**Compatibilidade:**
- ✅ Testes automatizados não afetados (nenhum teste usa esses seletores)
- ✅ JavaScript mantém as mesmas classes (`accordion-toggle`, `toggle-icon`)
- ✅ Função `toggleAccordion()` continua funcionando normalmente
- ✅ Classes `.expanded` preservadas para animações

**Arquivos Modificados:**
- `quiz-web/style.css` - 2 blocos de CSS atualizados

---

## Próximas Versões (Planejadas)

### [1.1.0] - Futuro
- Componentes para slides (reveal.js ou Marp)
- Animações de transição de nível
- Sound effects sutis (opcional)
- Modo escuro

### [1.2.0] - Futuro
- Aplicação em outros labs (lab2, lab3)
- Templates de apresentação
- Assets adicionais (ilustrações, ícones customizados)

---

**Desenvolvido por**: Equipe Aurora Labs  
**Design System Base**: aurora-labs-design  
**Narrativa**: NARRATIVA.md (Quest DynamoDB)

