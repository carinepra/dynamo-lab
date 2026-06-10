# 🖋️ Guia de Tipografia da Aurora Labs

## Fonte Oficial: Rubik

A Aurora Labs utiliza a fonte **Rubik** como tipografia principal em todo o ecossistema de produtos.

---

## 📦 Pesos Disponíveis

### Regular (400)
**Uso:** Corpo de texto, parágrafos, descrições

```css
font-family: 'Rubik', sans-serif;
font-weight: 400;
```

**Exemplos:**
- Textos de formulários
- Descrições de produtos
- Conteúdo geral
- Legendas

### Medium (500)
**Uso:** Subtítulos, destaques secundários, labels importantes

```css
font-family: 'Rubik', sans-serif;
font-weight: 500;
```

**Exemplos:**
- Labels de campos
- Subtítulos de seções
- Botões secundários
- Navegação

### Bold (700)
**Uso:** Títulos principais, CTAs, elementos de destaque

```css
font-family: 'Rubik', sans-serif;
font-weight: 700;
```

**Exemplos:**
- Títulos H1, H2, H3
- Botões primários
- Números importantes
- Destaques visuais

---

## 📐 Hierarquia Tipográfica

### Desktop

```css
/* H1 - Título Principal */
h1 {
  font-family: 'Rubik', sans-serif;
  font-weight: 700;
  font-size: 48px;
  line-height: 56px;
  letter-spacing: -0.5px;
}

/* H2 - Título Secundário */
h2 {
  font-family: 'Rubik', sans-serif;
  font-weight: 700;
  font-size: 36px;
  line-height: 44px;
  letter-spacing: -0.25px;
}

/* H3 - Subtítulo */
h3 {
  font-family: 'Rubik', sans-serif;
  font-weight: 700;
  font-size: 28px;
  line-height: 36px;
  letter-spacing: 0px;
}

/* H4 - Título Pequeno */
h4 {
  font-family: 'Rubik', sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  letter-spacing: 0px;
}

/* Body - Texto Principal */
body, p {
  font-family: 'Rubik', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0px;
}

/* Small - Texto Pequeno */
small, .caption {
  font-family: 'Rubik', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0px;
}

/* Label - Rótulos */
label {
  font-family: 'Rubik', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.15px;
  text-transform: uppercase;
}
```

### Mobile

```css
/* H1 Mobile */
@media (max-width: 768px) {
  h1 {
    font-size: 32px;
    line-height: 40px;
  }
}

/* H2 Mobile */
@media (max-width: 768px) {
  h2 {
    font-size: 24px;
    line-height: 32px;
  }
}

/* H3 Mobile */
@media (max-width: 768px) {
  h3 {
    font-size: 20px;
    line-height: 28px;
  }
}

/* Body Mobile */
@media (max-width: 768px) {
  body, p {
    font-size: 14px;
    line-height: 20px;
  }
}
```

---

## 🎨 Combinações com Cores

### Textos sobre fundo claro

```css
/* Título principal */
.heading-primary {
  font-family: 'Rubik', sans-serif;
  font-weight: 700;
  color: #253746; /* neutral-40 */
}

/* Texto corpo */
.body-text {
  font-family: 'Rubik', sans-serif;
  font-weight: 400;
  color: #546c7e; /* neutral-30 */
}

/* Texto secundário */
.secondary-text {
  font-family: 'Rubik', sans-serif;
  font-weight: 400;
  color: #abbdc8; /* neutral-20 */
}
```

### Textos sobre fundo escuro (navy-40)

```css
/* Título em fundo escuro */
.heading-inverse {
  font-family: 'Rubik', sans-serif;
  font-weight: 700;
  color: #ffffff; /* neutral-0 */
}

/* Corpo em fundo escuro */
.body-inverse {
  font-family: 'Rubik', sans-serif;
  font-weight: 400;
  color: #e1e9ec; /* neutral-10 */
}
```

### Textos de destaque

```css
/* Link/interação */
.link-text {
  font-family: 'Rubik', sans-serif;
  font-weight: 500;
  color: #3c70c1; /* blue-20 */
  text-decoration: underline;
}

/* Erro */
.error-text {
  font-family: 'Rubik', sans-serif;
  font-weight: 500;
  color: #f94f48; /* red-20 */
}

/* Sucesso */
.success-text {
  font-family: 'Rubik', sans-serif;
  font-weight: 500;
  color: #789d4a; /* green-20 */
}
```

---

## 💾 Implementação

### 1. Adicionar Arquivos de Fonte

Copie os arquivos `.woff2` para a pasta de fontes do seu projeto:

```
seu-projeto/
└── fonts/
    ├── rubik-v18-latin-regular.woff2
    ├── rubik-v18-latin-500.woff2
    └── rubik-v18-latin-700.woff2
```

### 2. Declarar @font-face

Adicione ao seu arquivo CSS principal:

```css
@font-face {
  font-family: 'Rubik';
  font-display: swap;
  font-weight: 400;
  src: url('../fonts/rubik-v18-latin-regular.woff2') format('woff2'),
       url('../fonts/rubik-v18-latin-regular.woff') format('woff');
}

@font-face {
  font-family: 'Rubik';
  font-display: swap;
  font-weight: 500;
  src: url('../fonts/rubik-v18-latin-500.woff2') format('woff2'),
       url('../fonts/rubik-v18-latin-500.woff') format('woff');
}

@font-face {
  font-family: 'Rubik';
  font-display: swap;
  font-weight: 700;
  src: url('../fonts/rubik-v18-latin-700.woff2') format('woff2'),
       url('../fonts/rubik-v18-latin-700.woff') format('woff');
}
```

### 3. Configurar Base

```css
* {
  font-family: 'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
               Roboto, Oxygen-Sans, Ubuntu, Cantarell, 
               'Helvetica Neue', sans-serif;
}

body {
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### 4. Preload (Opcional, mas recomendado)

Adicione no `<head>` do HTML para melhor performance:

```html
<link rel="preload" 
      href="fonts/rubik-v18-latin-regular.woff2" 
      as="font" 
      type="font/woff2" 
      crossorigin="anonymous">
      
<link rel="preload" 
      href="fonts/rubik-v18-latin-500.woff2" 
      as="font" 
      type="font/woff2" 
      crossorigin="anonymous">
      
<link rel="preload" 
      href="fonts/rubik-v18-latin-700.woff2" 
      as="font" 
      type="font/woff2" 
      crossorigin="anonymous">
```

---

## ✅ Checklist de Acessibilidade

- [ ] Contraste mínimo de 4.5:1 para textos normais
- [ ] Contraste mínimo de 3:1 para textos grandes (18px+)
- [ ] Tamanho mínimo de 14px para textos em mobile
- [ ] Tamanho mínimo de 16px para corpo de texto em desktop
- [ ] Line-height de pelo menos 1.5 para parágrafos
- [ ] Espaçamento entre parágrafos de pelo menos 2em

---

## 🎯 Exemplos Práticos

### Botão Primário

```css
.button-primary {
  font-family: 'Rubik', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  background-color: #002740; /* navy-40 */
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 8px;
}
```

### Card de Conteúdo

```css
.card-title {
  font-family: 'Rubik', sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: #253746; /* neutral-40 */
  margin-bottom: 8px;
}

.card-description {
  font-family: 'Rubik', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #546c7e; /* neutral-30 */
}

.card-meta {
  font-family: 'Rubik', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #abbdc8; /* neutral-20 */
}
```

### Formulário

```css
.form-label {
  font-family: 'Rubik', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #253746; /* neutral-40 */
  margin-bottom: 4px;
}

.form-input {
  font-family: 'Rubik', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #546c7e; /* neutral-30 */
}

.form-helper {
  font-family: 'Rubik', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #abbdc8; /* neutral-20 */
}
```

---

## 📚 Recursos

- **Google Fonts**: [Rubik on Google Fonts](https://fonts.google.com/specimen/Rubik)
- **Arquivo Original**: `/aurora-labs-design/src/fonts/`
- **Licença**: Open Font License
- **Idiomas Suportados**: Latin (extended)

---

## 🔗 Arquivos Relacionados

- `rubik-v18-latin-regular.woff2` - Fonte Regular
- `rubik-v18-latin-500.woff2` - Fonte Medium
- `rubik-v18-latin-700.woff2` - Fonte Bold
- `../../README.md` - Documentação completa

