# Assets - Aurora DynamoDB Quest

**Data:** 27 de Novembro de 2025  
**Versão:** 1.0.0

---

## 📁 Estrutura

```
assets/
├── fonts/              # Fontes web (Rubik)
│   ├── rubik-v18-latin-regular.woff2
│   ├── rubik-v18-latin-500.woff2
│   └── rubik-v18-latin-700.woff2
├── images/             # Logos e imagens
│   └── logo-aurora.svg
└── icons/              # Ícones e sprites SVG
    ├── quest-icons.svg
    └── quest-icons-library.js
```

---

## 🔤 Fontes

### Rubik (Google Fonts)

**Localização:** `assets/fonts/`

**Variantes:**
- **Regular (400):** `rubik-v18-latin-regular.woff2`
- **Medium (500):** `rubik-v18-latin-500.woff2`
- **Bold (700):** `rubik-v18-latin-700.woff2`

**Uso no CSS:**
```css
@font-face {
  font-family: 'Rubik';
  font-style: normal;
  font-weight: 400;
  src: url('assets/fonts/rubik-v18-latin-regular.woff2') format('woff2');
}
```

**Características:**
- ✅ Formato WOFF2 (melhor compressão)
- ✅ Subset latino (menor tamanho)
- ✅ Self-hosted (sem requisições externas)
- ✅ Licença OFL (Open Font License)

**Performance:**
- `regular.woff2`: ~11KB
- `500.woff2`: ~11KB
- `700.woff2`: ~11KB
- **Total**: ~33KB

---

## 🖼️ Imagens

### Logo Aurora

**Arquivo:** `assets/images/logo-aurora.svg`

**Especificações:**
- Formato: SVG (vetorial)
- Cor: Neutro (adaptável)
- Uso: Header, tela inicial
- Dimensões: Responsivo

**Referência no HTML:**
```html
<img src="assets/images/logo-aurora.svg" alt="Aurora Labs" class="logo">
```

**Onde é usado:**
- Tela inicial (`#start-screen`)
- Header do quiz
- Feedback de conclusão

---

## 🎨 Ícones

### Quest Icons (SVG Sprite)

**Arquivo:** `assets/icons/quest-icons.svg`

**Conteúdo:**
- 18+ ícones customizados com gradientes Aurora Labs
- Ícones de status (success, error, warning)
- Ícones de capítulos (espada, mapa, cristal)
- Ícones de ações (timer, hint, stats)

**Ícones Disponíveis:**

#### Status
- ✅ `icon-success` - Check verde
- ❌ `icon-error` - X vermelho
- ⚠️ `icon-warning` - Alerta amarelo
- 💡 `icon-info` - Lâmpada azul

#### Capítulos
- ⚔️ `icon-sword` - Espada (combate)
- 🗺️ `icon-map` - Mapa (exploração)
- 🔮 `icon-crystal` - Cristal (magia)
- 🛡️ `icon-shield` - Escudo (defesa)
- 👑 `icon-crown` - Coroa (mestre)

#### Ações
- ⏱️ `icon-timer` - Relógio (tempo)
- 🤖 `icon-hint` - Robô (dica)
- 📊 `icon-stats` - Gráfico (estatísticas)
- 📝 `icon-code` - Código
- 🎯 `icon-target` - Alvo

#### Linguagens
- 🐍 `icon-python` - Python
- 🔷 `icon-go` - Go
- 📜 `icon-javascript` - JavaScript

**Uso via Object:**
```html
<div style="display: none;">
    <object type="image/svg+xml" data="assets/icons/quest-icons.svg" id="quest-icons-svg"></object>
</div>
```

**Uso via JavaScript:**
```javascript
import { Icons } from './js/icons.js';

// Renderizar ícone
element.innerHTML = Icons.get('timer') + ' 5:00';

// Ícone de status
statusIcon.innerHTML = Icons.getStatus('success');
```

### Quest Icons Library (JS)

**Arquivo:** `assets/icons/quest-icons-library.js`

**Função:**
- Biblioteca JavaScript para acessar ícones SVG
- Exports: `QuestIcons.get(name)`
- Fallback automático para emojis

**Uso:**
```javascript
import { QuestIcons } from './assets/icons/quest-icons-library.js';

const timerIcon = QuestIcons.get('timer');
```

---

## 📖 Como Adicionar Novos Assets

### Adicionar Nova Fonte

1. **Baixar fonte** (formato WOFF2 recomendado)
2. **Colocar em** `assets/fonts/`
3. **Adicionar @font-face** em `componentes-quest.css`:
```css
@font-face {
  font-family: 'NovaFonte';
  font-weight: 400;
  src: url('assets/fonts/nova-fonte-regular.woff2') format('woff2');
}
```
4. **Atualizar variável CSS** se necessário:
```css
:root {
  --quest-font-family: 'NovaFonte', 'Rubik', sans-serif;
}
```

### Adicionar Nova Imagem

1. **Otimizar imagem** (TinyPNG, SVGO para SVG)
2. **Colocar em** `assets/images/`
3. **Usar no HTML/CSS**:
```html
<img src="assets/images/nova-imagem.svg" alt="Descrição">
```

### Adicionar Novo Ícone SVG

#### Opção 1: Adicionar ao Sprite
1. **Editar** `assets/icons/quest-icons.svg`
2. **Adicionar símbolo**:
```svg
<symbol id="icon-novo" viewBox="0 0 32 32">
  <path d="..." fill="currentColor"/>
</symbol>
```

#### Opção 2: Adicionar ao JS Library
1. **Editar** `js/icons.js`
2. **Adicionar ao objeto SVG**:
```javascript
export const SVG = {
  // ...
  novo: `<svg viewBox="0 0 32 32">...</svg>`
};
```

---

## 🔧 Manutenção

### Atualizar Fontes

```bash
# Baixar nova versão da Google Fonts
# URL: https://google-webfonts-helper.herokuapp.com/fonts/rubik

# Substituir arquivos em assets/fonts/
mv ~/Downloads/rubik-*.woff2 assets/fonts/
```

### Otimizar SVGs

```bash
# Instalar SVGO
npm install -g svgo

# Otimizar todos os SVGs
svgo assets/icons/*.svg assets/images/*.svg
```

### Verificar Tamanho Total

```bash
# Listar tamanho de cada asset
du -h assets/*/* | sort -h

# Tamanho total da pasta assets
du -sh assets/
```

---

## 📊 Performance

### Tamanhos Atuais

| Tipo | Arquivos | Tamanho Total | Otimizado? |
|------|----------|---------------|------------|
| **Fontes** | 3 | ~33KB | ✅ WOFF2 |
| **Imagens** | 1 | ~5KB | ✅ SVG |
| **Ícones** | 2 | ~15KB | ✅ Minified |
| **TOTAL** | 6 | **~53KB** | ✅ |

### Boas Práticas Aplicadas

- ✅ Fontes em WOFF2 (melhor compressão)
- ✅ SVGs minificados
- ✅ Self-hosted (sem CDN externo)
- ✅ Lazy loading possível
- ✅ Sprites SVG (reduz requisições)
- ✅ Sem imagens raster pesadas

---

## 🌐 Compatibilidade

### Formatos Suportados

| Formato | Navegadores | Fallback |
|---------|-------------|----------|
| **WOFF2** | Chrome 36+, Firefox 39+, Safari 10+ | WOFF |
| **SVG** | Todos os modernos | PNG/JPG |

### Testes Recomendados

- Chrome (desktop/mobile)
- Firefox
- Safari (macOS/iOS)
- Edge

---

## 📝 Changelog

### [1.0.0] - 2025-11-27

#### Adicionado
- Estrutura organizada em `assets/`
- 3 variantes da fonte Rubik (WOFF2)
- Logo Aurora original (SVG)
- 18+ ícones customizados Quest
- Quest icons library (JS)
- Documentação completa

#### Migrado
- `fonts/` → `assets/fonts/`
- `logo-aurora.svg` → `assets/images/`
- `quest-icons.svg` → `assets/icons/`
- `quest-icons-library.js` → `assets/icons/`

#### Atualizado
- Referências em `componentes-quest.css`
- Referências em `index.html`

---

## 🔗 Referências

- [Google Fonts - Rubik](https://fonts.google.com/specimen/Rubik)
- [WOFF2 Compression](https://www.w3.org/TR/WOFF2/)
- [SVG Optimization](https://github.com/svg/svgo)
- [Web Font Best Practices](https://web.dev/font-best-practices/)

---

**Última atualização:** 2025-11-27  
**Mantido por:** Aurora Labs Team  
**Versão:** 1.0.0

