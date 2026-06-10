# ⚡ Guia Rápido de Identidade Visual da Aurora Labs

Referência rápida para desenvolvedores implementarem a identidade visual da Aurora Labs.

---

## 🎨 Cores Essenciais

### Para Copiar e Colar

```css
/* Cores Principais da Marca */
--navy-40: #002740;          /* Cor primária */
--aqua-20: #67d2df;           /* Cor secundária */
--yellow-10: #f9e27d;         /* Destaque/CTA */

/* Cores Semânticas */
--success: #789d4a;           /* Verde - Sucesso */
--error: #f94f48;             /* Vermelho - Erro */
--warning: #ddc35f;           /* Amarelo - Aviso */
--info: #3c70c1;              /* Azul - Info */

/* Cores Neutras */
--white: #ffffff;             /* Branco */
--gray-light: #e1e9ec;        /* Cinza claro */
--gray: #abbdc8;              /* Cinza */
--gray-dark: #546c7e;         /* Cinza escuro */
--black: #253746;             /* Preto */
```

---

## 🖋️ Tipografia Essencial

### Implementação Rápida

```css
/* Font Family */
* {
  font-family: 'Rubik', -apple-system, BlinkMacSystemFont, 
               'Segoe UI', sans-serif;
}

/* Títulos */
h1 { font-size: 48px; font-weight: 700; color: #253746; }
h2 { font-size: 36px; font-weight: 700; color: #253746; }
h3 { font-size: 28px; font-weight: 700; color: #253746; }

/* Texto */
p { font-size: 16px; font-weight: 400; color: #546c7e; }
small { font-size: 14px; font-weight: 400; color: #abbdc8; }
```

---

## 🎯 Componentes Comuns

### Botão Primário

```html
<button class="btn btn--primary">
  Investir agora
</button>
```

```css
.btn--primary {
  background: #002740; /* navy-40 */
  color: #ffffff;
  font-family: 'Rubik', sans-serif;
  font-weight: 700;
  font-size: 16px;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(.72,.04,.16,.97);
}

.btn--primary:hover {
  background: #124666; /* navy-30 */
}

.btn--primary:active {
  background: #336b8c; /* navy-20 */
}
```

### Botão Secundário

```css
.btn--secondary {
  background: #ffffff;
  color: #002740; /* navy-40 */
  font-family: 'Rubik', sans-serif;
  font-weight: 700;
  font-size: 16px;
  padding: 12px 24px;
  border-radius: 8px;
  border: 2px solid #002740;
  cursor: pointer;
}

.btn--secondary:hover {
  background: #e6f7ff; /* navy-0 */
}
```

### Botão CTA (Call-to-Action)

```css
.btn--cta {
  background: #f9e27d; /* yellow-10 */
  color: #002740; /* navy-40 */
  font-family: 'Rubik', sans-serif;
  font-weight: 700;
  font-size: 16px;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.btn--cta:hover {
  background: #ddc35f; /* yellow-20 */
}
```

---

## 🏷️ Cards

```html
<div class="card">
  <h3 class="card__title">Título do Card</h3>
  <p class="card__description">Descrição do conteúdo...</p>
  <button class="btn btn--primary">Ação</button>
</div>
```

```css
.card {
  background: #ffffff;
  border: 1px solid #e1e9ec; /* neutral-10 */
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card__title {
  font-family: 'Rubik', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: #253746; /* neutral-40 */
  margin-bottom: 8px;
}

.card__description {
  font-family: 'Rubik', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #546c7e; /* neutral-30 */
  margin-bottom: 16px;
}
```

---

## 📢 Alerts/Toasts

### Sucesso

```html
<div class="alert alert--success">
  <svg class="alert__icon"><!-- ícone --></svg>
  <p>Operação realizada com sucesso!</p>
</div>
```

```css
.alert {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  font-family: 'Rubik', sans-serif;
  font-size: 14px;
}

.alert--success {
  background: #e8ebc0; /* green-0 */
  border-left: 4px solid #789d4a; /* green-20 */
  color: #357320; /* green-40 */
}

.alert--error {
  background: #ffe6e6; /* red-0 */
  border-left: 4px solid #f94f48; /* red-20 */
  color: #82110f; /* red-40 */
}

.alert--warning {
  background: #fff7e6; /* yellow-0 */
  border-left: 4px solid #ddc35f; /* yellow-20 */
  color: #886B1D; /* yellow-40 */
}

.alert--info {
  background: #bedef3; /* blue-0 */
  border-left: 4px solid #3c70c1; /* blue-20 */
  color: #163694; /* blue-40 */
}

.alert__icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
  flex-shrink: 0;
}
```

---

## 📝 Formulários

```html
<div class="form-group">
  <label class="form-label">Nome completo</label>
  <input type="text" class="form-input" placeholder="Digite seu nome">
  <small class="form-helper">Informe seu nome completo</small>
</div>
```

```css
.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-family: 'Rubik', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #253746; /* neutral-40 */
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  font-family: 'Rubik', sans-serif;
  font-size: 16px;
  color: #546c7e; /* neutral-30 */
  padding: 12px 16px;
  border: 1px solid #abbdc8; /* neutral-20 */
  border-radius: 8px;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3c70c1; /* blue-20 */
  box-shadow: 0 0 0 3px rgba(60, 112, 193, 0.1);
}

.form-input::placeholder {
  color: #abbdc8; /* neutral-20 */
}

.form-helper {
  display: block;
  font-family: 'Rubik', sans-serif;
  font-size: 12px;
  color: #abbdc8; /* neutral-20 */
  margin-top: 4px;
}

.form-input--error {
  border-color: #f94f48; /* red-20 */
}

.form-helper--error {
  color: #f94f48; /* red-20 */
}
```

---

## 🔗 Links

```css
a {
  font-family: 'Rubik', sans-serif;
  color: #3c70c1; /* blue-20 */
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: #2354b4; /* blue-30 */
  text-decoration: underline;
}

a:visited {
  color: #491385; /* purple-40 */
}
```

---

## 📐 Espaçamentos Rápidos

```css
/* Sistema baseado em 8px */
.m-1 { margin: 8px; }
.m-2 { margin: 16px; }
.m-3 { margin: 24px; }
.m-4 { margin: 32px; }

.p-1 { padding: 8px; }
.p-2 { padding: 16px; }
.p-3 { padding: 24px; }
.p-4 { padding: 32px; }

.gap-1 { gap: 8px; }
.gap-2 { gap: 16px; }
.gap-3 { gap: 24px; }
```

---

## 🎨 Classes Utilitárias

```css
/* Backgrounds */
.bg-navy { background-color: #002740; }
.bg-aqua { background-color: #67d2df; }
.bg-yellow { background-color: #f9e27d; }
.bg-white { background-color: #ffffff; }
.bg-gray-light { background-color: #e1e9ec; }

/* Textos */
.text-navy { color: #002740; }
.text-gray-dark { color: #253746; }
.text-gray { color: #546c7e; }
.text-gray-light { color: #abbdc8; }
.text-white { color: #ffffff; }

.text-success { color: #789d4a; }
.text-error { color: #f94f48; }
.text-warning { color: #ddc35f; }
.text-info { color: #3c70c1; }

/* Pesos de fonte */
.font-regular { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-bold { font-weight: 700; }

/* Tamanhos */
.text-xs { font-size: 12px; }
.text-sm { font-size: 14px; }
.text-base { font-size: 16px; }
.text-lg { font-size: 20px; }
.text-xl { font-size: 24px; }
.text-2xl { font-size: 32px; }
.text-3xl { font-size: 48px; }

/* Border radius */
.rounded-sm { border-radius: 4px; }
.rounded { border-radius: 8px; }
.rounded-lg { border-radius: 12px; }
.rounded-full { border-radius: 9999px; }

/* Sombras */
.shadow-sm { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08); }
.shadow { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }
.shadow-lg { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12); }
```

---

## 🚀 Quick Start

### 1. Adicionar Fontes

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet">
```

### 2. CSS Base

```css
:root {
  --navy-40: #002740;
  --aqua-20: #67d2df;
  --yellow-10: #f9e27d;
  --white: #ffffff;
  --gray-dark: #253746;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Rubik', sans-serif;
  font-size: 16px;
  color: #546c7e;
  background-color: #ffffff;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
```

---

## 📚 Documentação Completa

- [README Principal](../README.md)
- [Paleta de Cores](../cores/PALETA-CORES.md)
- [Guia de Fontes](../fontes/GUIA-FONTES.md)
- [Assets Visuais](../logos-icones/GUIA-ASSETS.md)
- [JSON Estruturado](../aurora-brand.json)

---

## 🔗 Links Úteis

- **Design System**: https://auroralabs.example/design-system/
- **Design File**: refer?ncia fict?cia da Aurora Labs
- **Contato**: Aurora Design System

