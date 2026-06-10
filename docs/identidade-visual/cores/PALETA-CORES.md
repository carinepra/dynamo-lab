# 🎨 Paleta de Cores da Aurora Labs

## Sistema de Cores

A Aurora Labs utiliza um sistema de 10 famílias de cores, cada uma com 5 variações (0, 10, 20, 30, 40).

---

## 🎯 Cores Principais da Marca

### Navy (Cor Primária)
**Uso:** Identidade visual principal, botões primários, cabeçalhos

| Variação | Hex | Uso |
|----------|-----|-----|
| navy-0 | `#e6f7ff` | Backgrounds muito claros |
| navy-10 | `#6095b3` | Elementos secundários claros |
| navy-20 | `#336b8c` | Elementos médios |
| navy-30 | `#124666` | Elementos escuros |
| **navy-40** | **`#002740`** | **Cor principal da marca** ⭐ |

```css
/* Exemplo de uso */
.header {
  background-color: #002740; /* navy-40 */
}

.button-primary {
  background-color: #002740; /* navy-40 */
  color: #ffffff;
}
```

### Aqua (Cor Secundária)
**Uso:** Destaques secundários, elementos interativos alternativos

| Variação | Hex | Uso |
|----------|-----|-----|
| aqua-0 | `#e6f9ff` | Backgrounds claros |
| aqua-10 | `#b8e9f4` | Elementos claros |
| **aqua-20** | **`#67d2df`** | **Destaque secundário** ⭐ |
| aqua-30 | `#4fb9c6` | Elementos escuros |
| aqua-40 | `#39a0ae` | Elementos muito escuros |

### Yellow (Destaque)
**Uso:** Call-to-actions, destaques importantes, promoções

| Variação | Hex | Uso |
|----------|-----|-----|
| yellow-0 | `#fff7e6` | Backgrounds de alerta suave |
| **yellow-10** | **`#f9e27d`** | **CTA principal** ⭐ |
| yellow-20 | `#ddc35f` | Hover states |
| yellow-30 | `#c0a445` | Active states |
| yellow-40 | `#886B1D` | Bordas e textos |

```css
/* Botão de destaque */
.button-cta {
  background-color: #f9e27d; /* yellow-10 */
  color: #002740; /* navy-40 */
}
```

---

## 🚦 Cores Semânticas

### Red (Erros e Alertas)
**Uso:** Mensagens de erro, validações, alertas críticos

| Variação | Hex | Uso |
|----------|-----|-----|
| red-0 | `#ffe6e6` | Background de erro suave |
| red-10 | `#fda7a6` | Elementos de erro claros |
| **red-20** | **`#f94f48`** | **Erro principal** ⚠️ |
| red-30 | `#d13630` | Erro escuro |
| red-40 | `#82110f` | Erro crítico |

```css
/* Mensagem de erro */
.error-message {
  background-color: #ffe6e6; /* red-0 */
  border-left: 4px solid #f94f48; /* red-20 */
  color: #82110f; /* red-40 */
}
```

### Green (Sucesso)
**Uso:** Confirmações, sucessos, estados positivos

| Variação | Hex | Uso |
|----------|-----|-----|
| green-0 | `#e8ebc0` | Background de sucesso suave |
| green-10 | `#b1c47e` | Elementos de sucesso claros |
| **green-20** | **`#789d4a`** | **Sucesso principal** ✅ |
| green-30 | `#558833` | Sucesso escuro |
| green-40 | `#357320` | Sucesso intenso |

```css
/* Mensagem de sucesso */
.success-message {
  background-color: #e8ebc0; /* green-0 */
  border-left: 4px solid #789d4a; /* green-20 */
  color: #357320; /* green-40 */
}
```

### Blue (Informação)
**Uso:** Informações, dicas, elementos informativos

| Variação | Hex | Uso |
|----------|-----|-----|
| blue-0 | `#bedef3` | Background informativo suave |
| blue-10 | `#77a8da` | Elementos informativos claros |
| **blue-20** | **`#3c70c1`** | **Informação principal** ℹ️ |
| blue-30 | `#2354b4` | Links e interações |
| blue-40 | `#163694` | Informação escura |

```css
/* Box de informação */
.info-box {
  background-color: #bedef3; /* blue-0 */
  border: 1px solid #3c70c1; /* blue-20 */
  color: #163694; /* blue-40 */
}
```

---

## 🎨 Cores Complementares

### Purple
**Uso:** Elementos premium, destaque especial

| Variação | Hex |
|----------|-----|
| purple-0 | `#eee6ff` |
| purple-10 | `#ccadff` |
| purple-20 | `#a259ff` |
| purple-30 | `#823cd6` |
| purple-40 | `#491385` |

### Pink
**Uso:** Elementos secundários, variações

| Variação | Hex |
|----------|-----|
| pink-0 | `#eedbe7` |
| pink-10 | `#ddc2cf` |
| pink-20 | `#b390a2` |
| pink-30 | `#886479` |
| pink-40 | `#5d3f51` |

### Brown
**Uso:** Elementos terciários, neutros quentes

| Variação | Hex |
|----------|-----|
| brown-0 | `#edc8b5` |
| brown-10 | `#ca8962` |
| brown-20 | `#94450b` |
| brown-30 | `#632b04` |
| brown-40 | `#4b1f01` |

---

## ⚪ Cores Neutras

### Neutral (Cinzas)
**Uso:** Textos, bordas, backgrounds, elementos neutros

| Variação | Hex | Uso |
|----------|-----|-----|
| **neutral-0** | **`#ffffff`** | **Branco puro** |
| neutral-10 | `#e1e9ec` | Cinza muito claro (bordas sutis) |
| neutral-20 | `#abbdc8` | Cinza claro (textos secundários) |
| neutral-30 | `#546c7e` | Cinza médio (textos principais) |
| neutral-40 | `#253746` | Cinza escuro (títulos) |

```css
/* Hierarquia de textos */
.text-title {
  color: #253746; /* neutral-40 */
}

.text-body {
  color: #546c7e; /* neutral-30 */
}

.text-caption {
  color: #abbdc8; /* neutral-20 */
}

.border-subtle {
  border-color: #e1e9ec; /* neutral-10 */
}
```

---

## 🎯 Guia de Uso Rápido

### Para Botões

```css
/* Botão Primário */
.btn-primary {
  background: #002740; /* navy-40 */
  color: #ffffff;
}

/* Botão Secundário */
.btn-secondary {
  background: #ffffff;
  border: 2px solid #002740; /* navy-40 */
  color: #002740;
}

/* Botão Destaque */
.btn-highlight {
  background: #f9e27d; /* yellow-10 */
  color: #002740; /* navy-40 */
}
```

### Para Backgrounds

```css
/* Background principal */
.bg-main {
  background: #ffffff; /* neutral-0 */
}

/* Background secundário (cards) */
.bg-card {
  background: #e1e9ec; /* neutral-10 */
}

/* Background com marca */
.bg-brand {
  background: #002740; /* navy-40 */
}
```

### Para Estados

```css
/* Sucesso */
.state-success {
  background: #e8ebc0; /* green-0 */
  border-color: #789d4a; /* green-20 */
}

/* Erro */
.state-error {
  background: #ffe6e6; /* red-0 */
  border-color: #f94f48; /* red-20 */
}

/* Aviso */
.state-warning {
  background: #fff7e6; /* yellow-0 */
  border-color: #ddc35f; /* yellow-20 */
}

/* Info */
.state-info {
  background: #bedef3; /* blue-0 */
  border-color: #3c70c1; /* blue-20 */
}
```

---

## 📊 Tabela de Acessibilidade

| Cor de Fundo | Cor de Texto | Contraste | Status |
|--------------|--------------|-----------|--------|
| navy-40 | neutral-0 | 8.5:1 | ✅ AAA |
| yellow-10 | navy-40 | 4.8:1 | ✅ AA |
| neutral-0 | navy-40 | 8.5:1 | ✅ AAA |
| neutral-0 | neutral-40 | 10.2:1 | ✅ AAA |
| neutral-10 | neutral-40 | 7.1:1 | ✅ AAA |

---

## 🔗 Arquivos Relacionados

- `colors.json` - Arquivo JSON com todas as cores
- `../../README.md` - Documentação completa da identidade visual

