# 🖼️ Guia de Assets Visuais da Aurora Labs

Documentação completa dos assets visuais disponíveis no Aurora Labs Design System.

---

## 📦 Estrutura de Assets

### Localização no Design System

```
aurora-labs-design/
├── src/core/images/svg/          # SVG Sprites
│   ├── actions.svg                # Ações (editar, deletar, add, etc)
│   ├── alerts.svg                 # Alertas e notificações
│   ├── arrows.svg                 # Setas e direções
│   ├── brands.svg                 # Logos de marcas ⭐
│   ├── editor.svg                 # Ferramentas de edição
│   ├── emojis.svg                 # Emojis
│   ├── files.svg                  # Tipos de arquivo
│   ├── illustrations.svg          # Ilustrações ⭐
│   ├── loaders.svg                # Animações de loading
│   ├── money.svg                  # Ícones financeiros ⭐
│   └── navigation.svg             # Navegação
│
└── static/                         # Imagens e Banners
    ├── banner-blue-money.jpg
    ├── banner-blue-phone.jpg
    ├── banner-gray-disabled.jpg
    ├── banner-yellow-money.jpg    ⭐
    └── banner-yellow-time.jpg
```

---

## 🎨 SVG Sprites

### Como Usar SVG Sprites

#### 1. Importar o Sprite

```javascript
// React
import { ReactComponent as MoneyIcon } from 'aurora-labs-design/src/core/images/svg/money.svg'

// Ou via sprite sheet
<svg>
  <use xlinkHref="#icon-name" />
</svg>
```

#### 2. HTML Puro

```html
<!-- Referência externa -->
<svg class="icon">
  <use xlink:href="path/to/sprite.svg#icon-name"></use>
</svg>

<!-- Inline -->
<svg class="icon" width="24" height="24">
  <!-- conteúdo do SVG -->
</svg>
```

---

## 💰 Ícones Financeiros (money.svg)

**Uso:** Transações, valores, investimentos, benefícios

### Ícones Disponíveis

- `money-coin` - Moeda/dinheiro
- `money-bill` - Nota de dinheiro
- `money-piggy-bank` - Porquinho (poupança)
- `money-wallet` - Carteira
- `money-chart-up` - Gráfico crescendo (investimentos)
- `money-chart-down` - Gráfico caindo
- `money-transfer` - Transferência
- `money-exchange` - Câmbio
- `money-calculator` - Calculadora financeira
- `money-receipt` - Recibo/nota fiscal

### Exemplo de Uso

```html
<!-- Card de saldo -->
<div class="balance-card">
  <svg class="icon-money" width="32" height="32">
    <use xlink:href="money.svg#money-piggy-bank"></use>
  </svg>
  <h3>Saldo Total</h3>
  <p class="amount">R$ 50.000,00</p>
</div>
```

```css
.icon-money {
  fill: #002740; /* navy-40 */
}

.icon-money:hover {
  fill: #336b8c; /* navy-20 */
}
```

---

## 🎯 Ícones de Ação (actions.svg)

**Uso:** Botões, controles, interações

### Ícones Disponíveis

- `action-edit` - Editar (lápis)
- `action-delete` - Deletar (lixeira)
- `action-add` - Adicionar (plus)
- `action-remove` - Remover (minus)
- `action-save` - Salvar (disco/check)
- `action-cancel` - Cancelar (X)
- `action-search` - Buscar (lupa)
- `action-filter` - Filtrar (funil)
- `action-download` - Download
- `action-upload` - Upload
- `action-print` - Imprimir
- `action-share` - Compartilhar
- `action-copy` - Copiar
- `action-paste` - Colar

### Exemplo

```jsx
// React Component
import { IconButton } from 'aurora-labs-design'

<IconButton 
  icon="action-edit" 
  onClick={handleEdit}
  label="Editar"
/>

<IconButton 
  icon="action-delete" 
  variant="danger"
  onClick={handleDelete}
  label="Excluir"
/>
```

---

## 🚨 Ícones de Alerta (alerts.svg)

**Uso:** Notificações, mensagens, feedbacks

### Ícones Disponíveis

- `alert-success` - Sucesso (check em círculo)
- `alert-error` - Erro (X em círculo)
- `alert-warning` - Aviso (! em triângulo)
- `alert-info` - Informação (i em círculo)
- `alert-notification` - Notificação (sino)
- `alert-bell` - Campainha
- `alert-badge` - Badge de notificação

### Exemplo

```html
<!-- Toast de sucesso -->
<div class="toast toast--success">
  <svg class="toast__icon" width="24" height="24">
    <use xlink:href="alerts.svg#alert-success"></use>
  </svg>
  <p>Operação realizada com sucesso!</p>
</div>

<!-- Toast de erro -->
<div class="toast toast--error">
  <svg class="toast__icon" width="24" height="24">
    <use xlink:href="alerts.svg#alert-error"></use>
  </svg>
  <p>Erro ao processar a solicitação.</p>
</div>
```

```css
.toast__icon {
  flex-shrink: 0;
  margin-right: 12px;
}

.toast--success .toast__icon {
  fill: #789d4a; /* green-20 */
}

.toast--error .toast__icon {
  fill: #f94f48; /* red-20 */
}

.toast--warning .toast__icon {
  fill: #ddc35f; /* yellow-20 */
}

.toast--info .toast__icon {
  fill: #3c70c1; /* blue-20 */
}
```

---

## 🧭 Ícones de Navegação (navigation.svg)

**Uso:** Menus, setas, direções

### Ícones Disponíveis

- `nav-home` - Home (casa)
- `nav-dashboard` - Dashboard (grid)
- `nav-menu` - Menu (hamburguer)
- `nav-close` - Fechar (X)
- `nav-user` - Usuário (perfil)
- `nav-settings` - Configurações (engrenagem)
- `nav-help` - Ajuda (?)
- `nav-logout` - Sair (porta)
- `nav-chevron-left` - Seta esquerda
- `nav-chevron-right` - Seta direita
- `nav-chevron-up` - Seta cima
- `nav-chevron-down` - Seta baixo

---

## 📁 Ícones de Arquivo (files.svg)

**Uso:** Upload, download, tipos de documento

### Ícones Disponíveis

- `file-pdf` - PDF
- `file-doc` - Word/Doc
- `file-xls` - Excel/Planilha
- `file-image` - Imagem
- `file-video` - Vídeo
- `file-audio` - Áudio
- `file-zip` - Arquivo compactado
- `file-generic` - Arquivo genérico

---

## 🖼️ Banners

### Disponíveis em `/static/`

#### Banner Blue Money (`banner-blue-money.jpg`)
**Uso:** Seções de investimento, benefícios, produtos financeiros

- **Dimensões recomendadas**: 1200x400px
- **Tema**: Azul (navy) com elementos de dinheiro
- **Contexto**: Seções principais, headers, landing pages

#### Banner Yellow Money (`banner-yellow-money.jpg`) ⭐
**Uso:** CTAs, promoções, destaques importantes

- **Dimensões recomendadas**: 1200x400px
- **Tema**: Amarelo com elementos financeiros
- **Contexto**: Call-to-actions, campanhas, promoções

#### Banner Blue Phone (`banner-blue-phone.jpg`)
**Uso:** Seções de aplicativo, mobile first, tecnologia

- **Dimensões recomendadas**: 1200x400px
- **Tema**: Azul com smartphone
- **Contexto**: Download de app, features mobile

#### Banner Yellow Time (`banner-yellow-time.jpg`)
**Uso:** Prazos, tempo, urgência, contagem regressiva

- **Dimensões recomendadas**: 1200x400px
- **Tema**: Amarelo com relógio
- **Contexto**: Ofertas por tempo limitado, deadlines

#### Banner Gray Disabled (`banner-gray-disabled.jpg`)
**Uso:** Estados inativos, manutenção, bloqueios

- **Dimensões recomendadas**: 1200x400px
- **Tema**: Cinza neutro
- **Contexto**: Páginas de erro, manutenção, indisponibilidade

### Implementação de Banners

```html
<!-- Hero com banner -->
<section class="hero" style="background-image: url('static/banner-blue-money.jpg')">
  <div class="hero__content">
    <h1>Invista no seu futuro</h1>
    <p>Benef?cios corporativos com as melhores taxas do mercado</p>
    <button class="btn-primary">Simular agora</button>
  </div>
</section>
```

```css
.hero {
  background-size: cover;
  background-position: center;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to right,
    rgba(0, 39, 64, 0.9),
    rgba(0, 39, 64, 0.3)
  );
}

.hero__content {
  position: relative;
  z-index: 1;
  color: #ffffff;
}
```

---

## 🎨 Estilos para Ícones

### Tamanhos Padrão

```css
/* Extra pequeno */
.icon--xs {
  width: 16px;
  height: 16px;
}

/* Pequeno */
.icon--sm {
  width: 20px;
  height: 20px;
}

/* Médio (padrão) */
.icon--md {
  width: 24px;
  height: 24px;
}

/* Grande */
.icon--lg {
  width: 32px;
  height: 32px;
}

/* Extra grande */
.icon--xl {
  width: 48px;
  height: 48px;
}
```

### Cores de Ícones

```css
/* Ícone primário */
.icon--primary {
  fill: #253746; /* neutral-40 */
}

/* Ícone secundário */
.icon--secondary {
  fill: #546c7e; /* neutral-30 */
}

/* Ícone brand */
.icon--brand {
  fill: #002740; /* navy-40 */
}

/* Ícone inativo */
.icon--disabled {
  fill: #abbdc8; /* neutral-20 */
  opacity: 0.5;
}

/* Ícones em fundo escuro */
.icon--inverse {
  fill: #ffffff;
}
```

---

## 🔧 Otimização de Assets

### SVG

- ✅ Remover metadados desnecessários
- ✅ Minimizar com SVGO
- ✅ Usar viewBox para responsividade
- ✅ Agrupar em sprites quando possível

### Imagens (JPG/PNG)

- ✅ Comprimir com ferramentas como TinyPNG
- ✅ Servir em múltiplos tamanhos (responsive)
- ✅ Usar WebP quando possível
- ✅ Lazy loading para imagens abaixo da dobra

---

## 📚 Recursos

- **Sprite Generator**: Para criar sprites customizados
- **SVGO**: Para otimizar SVGs
- **TinyPNG**: Para comprimir imagens

---

## 🔗 Arquivos Relacionados

- `../../README.md` - Documentação completa
- `../cores/PALETA-CORES.md` - Cores para ícones
- `../fontes/GUIA-FONTES.md` - Tipografia

