# Identidade Visual Quest - Quiz Web

Documentação da aplicação da identidade visual **Aurora Academy: Quest DynamoDB** no quiz-web.

## Estrutura de Arquivos

```
quiz-web/
├── componentes-quest.css     # Componentes base (badges, XP bar, etc)
├── style.css                  # Estilos específicos do quiz
├── fonts/                     # Fontes Rubik (400, 500, 700)
│   ├── rubik-v18-latin-regular.woff2
│   ├── rubik-v18-latin-500.woff2
│   └── rubik-v18-latin-700.woff2
├── index.html                 # HTML com componentes Quest
├── app.js                     # JavaScript com sistema de níveis
└── README-IDENTIDADE.md      # Este arquivo
```

## Sistema de Níveis Implementado

### Constante QUEST_LEVELS

Definida em `app.js`:

```javascript
const QUEST_LEVELS = [
  { min: 0, max: 500, name: 'Escudeiro', emoji: '🛡️', badge: 'bronze', description: 'Aprendiz' },
  { min: 501, max: 1000, name: 'Cartógrafo', emoji: '🗺️', badge: 'silver', description: 'Explorador' },
  { min: 1001, max: 1500, name: 'Cavaleiro', emoji: '⚔️', badge: 'gold', description: 'Guardião' },
  { min: 1501, max: 2000, name: 'Oráculo', emoji: '🔮', badge: 'principal', description: 'Sábio' },
  { min: 2001, max: 9999, name: 'Grão-Mestre', emoji: '👑', badge: 'legend', description: 'Arquiteto-Mor' }
];
```

### Funções Principais

#### `updatePlayerLevel(xp)`

Atualiza todos os elementos visuais de nível:
- Badge de nível (`#player-badge`)
- Badge no quiz (`#player-badge-quiz`)
- Barra de progresso XP (`#xp-bar-fill`)
- Mensagem de próximo nível (`#xp-next-message`)

**Onde é chamada:**
- `updatePlayerStats()` - Ao atualizar estatísticas gerais
- Após validar resposta (ganho de XP)
- Após pedir ajuda (perda de XP)
- Após timeout de questão
- Ao carregar nova questão

#### `getRank(xp)`

Retorna informações do nível baseado no XP:
```javascript
{
  name: string,  // Ex: "Escudeiro"
  icon: string,  // Ex: "🛡️"
  class: string  // Ex: "bronze"
}
```

## Componentes HTML Implementados

### Badge de Nível (Mapa da Quest)

```html
<div class="quest-level-badge quest-level-bronze" id="player-badge">
  <span class="quest-level-emoji">🛡️</span>
  <span class="quest-level-name">Escudeiro</span>
  <span class="quest-level-xp">
    <span id="total-xp-display">0</span> / 500 XP
  </span>
</div>
```

**Classes de variação:**
- `quest-level-bronze` - Escudeiro
- `quest-level-silver` - Cartógrafo
- `quest-level-gold` - Cavaleiro
- `quest-level-principal` - Oráculo
- `quest-level-legend` - Grão-Mestre

### Barra de Progresso XP

```html
<div class="quest-xp-bar">
  <div class="quest-xp-bar-header">
    <span class="quest-xp-current">
      <span id="xp-current-display">0</span> XP
    </span>
    <span class="quest-xp-target">/ 2.900 XP</span>
    <span class="quest-xp-next" id="xp-next-message">
      Faltam 500 XP para Cartógrafo!
    </span>
  </div>
  <div class="quest-xp-bar-track">
    <div class="quest-xp-bar-fill" id="xp-bar-fill" style="width: 0%"></div>
  </div>
</div>
```

### Badge no Quiz (Header)

```html
<div class="quest-level-badge quest-level-bronze" id="player-badge-quiz">
  <span class="quest-level-emoji">🛡️</span>
  <span class="quest-level-name">Escudeiro</span>
  <span class="quest-level-xp">
    <span id="xp-quiz-display">0</span> XP
  </span>
</div>
```

## Mapeamento de Classes

### Classes Antigas → Novas

| Elemento | Antes | Depois |
|----------|-------|--------|
| Badge de nível | Custom CSS | `quest-level-badge` + variação |
| Display de XP | `.player-xp` | Dentro de `quest-level-badge` |
| Display de rank | `.player-rank` | Substituído por badge visual |
| Barra de XP | Não existia | `quest-xp-bar` (novo) |

### Ranks Antigos → Novos

| Antes | Depois | Emoji | Classe |
|-------|--------|-------|--------|
| Junior | Escudeiro | 🛡️ | `bronze` |
| Pleno | Cartógrafo | 🗺️ | `silver` |
| Senior | Cavaleiro | ⚔️ | `gold` |
| Principal | Oráculo | 🔮 | `principal` |
| LEGEND | Grão-Mestre | 👑 | `legend` |

## Variáveis CSS Disponíveis

Definidas em `componentes-quest.css`:

### Cores Quest
```css
--quest-magic: #a259ff;      /* XP, magia, progresso */
--quest-success: #789d4a;    /* Conquistas, níveis */
--quest-warning: #f9e27d;    /* Alertas, desafios */
--quest-danger: #f94f48;     /* Erros, falhas */
--quest-crystal: #67d2df;    /* Bônus, poder */
```

### Badges de Nível
```css
--badge-bronze: #c0a445;     /* Escudeiro */
--badge-silver: #abbdc8;     /* Cartógrafo */
--badge-gold: #f9e27d;       /* Cavaleiro */
--badge-legend: #a259ff;     /* Grão-Mestre */
```

### Espaçamentos
```css
--space-1: 8px;
--space-2: 16px;
--space-3: 24px;
--space-4: 32px;
```

## Como Adicionar Novos Componentes

### 1. Usar Componentes Existentes

Todos os componentes documentados em [`docs/identidade-visual/AURORA-ACADEMY-QUEST.md`](../docs/identidade-visual/AURORA-ACADEMY-QUEST.md) estão disponíveis:

- `quest-mission-card` - Cards de missão
- `quest-dialogue-box` - Caixas de diálogo
- `quest-concept-box` - Boxes de conceito
- `quest-alert` - Alertas com ícones
- `quest-comparison-table` - Tabelas de comparação

### 2. Exemplo: Adicionar Card de Missão

```html
<div class="quest-mission-card quest-mission-in-progress">
  <div class="quest-mission-header">
    <div class="quest-mission-number">Missão 3</div>
    <div class="quest-mission-difficulty">
      <span>⭐⭐⭐</span>
      <span>Avançada</span>
    </div>
  </div>
  
  <div class="quest-mission-content">
    <h3 class="quest-mission-title">Query Reversa</h3>
    <p class="quest-mission-desc">
      Use ScanIndexForward=false para buscar o último saldo.
    </p>
  </div>
  
  <div class="quest-mission-footer">
    <span class="quest-mission-xp">+500 XP</span>
    <button class="quest-mission-btn">Iniciar</button>
  </div>
</div>
```

## Testes Recomendados

### Testes Visuais
1. Abrir `index.html` no navegador
2. Verificar fontes Rubik carregando
3. Verificar badge de nível no header
4. Verificar barra de XP funcionando
5. Validar uma questão e ver XP aumentar
6. Verificar atualização de nível ao passar de faixa

### Testes Funcionais
```bash
cd quiz-web
npm test
```

### Validação de Integração
- [ ] Badge inicia como "Escudeiro" (0 XP)
- [ ] Barra de XP começa em 0%
- [ ] Ao ganhar XP, barra atualiza
- [ ] Ao atingir 501 XP, muda para "Cartógrafo"
- [ ] Emoji e cor do badge mudam corretamente
- [ ] Mensagem "Faltam X XP" atualiza

## Troubleshooting

### Fontes não carregam
- Verificar se arquivos `.woff2` estão em `quiz-web/fonts/`
- Verificar caminho em `componentes-quest.css`: `url('fonts/...')`

### Badge não atualiza
- Verificar se elementos têm IDs corretos:
  - `#player-badge` (mapa)
  - `#player-badge-quiz` (quiz)
  - `#xp-bar-fill` (barra)

### Estilos conflitantes
- `componentes-quest.css` deve vir ANTES de `style.css` no HTML
- Verificar se não há IDs/classes duplicadas

### XP não atualiza
- Verificar chamadas de `updatePlayerLevel(state.totalXP)` após:
  - Validar resposta
  - Pedir ajuda
  - Timeout
  - Carregar questão

## Documentação Completa

- **Identidade Visual**: [`docs/identidade-visual/AURORA-ACADEMY-QUEST.md`](../docs/identidade-visual/AURORA-ACADEMY-QUEST.md)
- **Exemplos Visuais**: [`docs/identidade-visual/exemplos-quest.html`](../docs/identidade-visual/exemplos-quest.html)
- **Paleta de Cores**: [`docs/identidade-visual/cores/colors.json`](../docs/identidade-visual/cores/colors.json)
- **Fontes**: [`docs/identidade-visual/fontes/`](../docs/identidade-visual/fontes/)

## Changelog

### [1.0.0] - 2025-11-27

**Implementado:**
- Sistema de níveis com 5 personagens (Escudeiro → Grão-Mestre)
- Badge de nível visual com emojis
- Barra de progresso XP
- Atualização automática de nível
- Mensagem de próximo nível
- Integração completa com quiz-web

**Arquivos modificados:**
- `index.html` - Componentes Quest
- `app.js` - Lógica de níveis
- `style.css` - Limpeza de duplicações

**Arquivos novos:**
- `componentes-quest.css` - Componentes base
- `fonts/` - Fontes Rubik
- `README-IDENTIDADE.md` - Esta documentação

---

**Última atualização**: Novembro 2025  
**Versão**: 1.0

