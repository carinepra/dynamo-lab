# 🎨 Identidade Visual da Aurora Labs

Documentação completa da identidade visual da Aurora Labs extraída do **Aurora Labs Design System** e do **Dashboard**.

## 📚 Fontes Oficiais

- **Design System**: [aurora-labs-design](https://auroralabs.example/design-system/)
- **Design File**: refer?ncia fict?cia da Aurora Labs
- **Canal interno**: Aurora Design System

---

## 🖋️ Tipografia

### Fonte Principal: **Rubik**

A Aurora Labs utiliza a fonte **Rubik** em três pesos:

- **Regular (400)** - Textos gerais
- **Medium (500)** - Títulos e destaques secundários
- **Bold (700)** - Títulos principais e CTAs

#### Arquivos de Fonte

Disponíveis em formato WOFF2 e WOFF:
- `rubik-v18-latin-regular.woff2`
- `rubik-v18-latin-500.woff2`
- `rubik-v18-latin-700.woff2`

#### Implementação CSS

```css
@font-face {
  font-family: 'Rubik';
  font-display: swap;
  font-weight: 400;
  src: url('fonts/rubik-v18-latin-regular.woff2') format('woff2');
}

@font-face {
  font-family: 'Rubik';
  font-display: swap;
  font-weight: 500;
  src: url('fonts/rubik-v18-latin-500.woff2') format('woff2');
}

@font-face {
  font-family: 'Rubik';
  font-display: swap;
  font-weight: 700;
  src: url('fonts/rubik-v18-latin-700.woff2') format('woff2');
}
```

---

## 🎨 Paleta de Cores

A Aurora Labs utiliza um sistema de cores com 10 famílias, cada uma com 5 variações (0, 10, 20, 30, 40):

### **Navy** (Cor Principal da Marca)
- `navy-0`: `#e6f7ff` - Muito claro
- `navy-10`: `#6095b3` - Claro
- `navy-20`: `#336b8c` - Médio
- `navy-30`: `#124666` - Escuro
- `navy-40`: `#002740` - Muito escuro ⭐ **Cor primária**

### **Aqua** (Cor Secundária)
- `aqua-0`: `#e6f9ff`
- `aqua-10`: `#b8e9f4`
- `aqua-20`: `#67d2df`
- `aqua-30`: `#4fb9c6`
- `aqua-40`: `#39a0ae`

### **Yellow** (Destaque)
- `yellow-0`: `#fff7e6`
- `yellow-10`: `#f9e27d` ⭐ **Destaque principal**
- `yellow-20`: `#ddc35f`
- `yellow-30`: `#c0a445`
- `yellow-40`: `#886B1D`

### **Red** (Alertas e Erros)
- `red-0`: `#ffe6e6`
- `red-10`: `#fda7a6`
- `red-20`: `#f94f48` ⭐ **Erro principal**
- `red-30`: `#d13630`
- `red-40`: `#82110f`

### **Green** (Sucesso)
- `green-0`: `#e8ebc0`
- `green-10`: `#b1c47e`
- `green-20`: `#789d4a` ⭐ **Sucesso principal**
- `green-30`: `#558833`
- `green-40`: `#357320`

### **Blue** (Informação)
- `blue-0`: `#bedef3`
- `blue-10`: `#77a8da`
- `blue-20`: `#3c70c1` ⭐ **Info principal**
- `blue-30`: `#2354b4`
- `blue-40`: `#163694`

### **Purple**
- `purple-0`: `#eee6ff`
- `purple-10`: `#ccadff`
- `purple-20`: `#a259ff`
- `purple-30`: `#823cd6`
- `purple-40`: `#491385`

### **Pink**
- `pink-0`: `#eedbe7`
- `pink-10`: `#ddc2cf`
- `pink-20`: `#b390a2`
- `pink-30`: `#886479`
- `pink-40`: `#5d3f51`

### **Brown**
- `brown-0`: `#edc8b5`
- `brown-10`: `#ca8962`
- `brown-20`: `#94450b`
- `brown-30`: `#632b04`
- `brown-40`: `#4b1f01`

### **Neutral** (Cinzas)
- `neutral-0`: `#ffffff` - Branco
- `neutral-10`: `#e1e9ec` - Cinza muito claro
- `neutral-20`: `#abbdc8` - Cinza claro
- `neutral-30`: `#546c7e` - Cinza médio
- `neutral-40`: `#253746` - Cinza escuro

---

## 🎯 Cores Semânticas

### Superfícies (Backgrounds)
- **Primary**: Fundo principal da aplicação
- **Secondary**: Fundo de cards e containers
- **Tertiary**: Fundo de elementos internos
- **Brand-01**: Navy escuro (`#002740`)
- **Brand-02**: Aqua (`#67d2df`)

### Texto
- **Headline**: Títulos principais (neutral-40)
- **Body**: Textos gerais (neutral-30)
- **Caption**: Textos pequenos (neutral-20)
- **Brand**: Textos em destaque (navy-40)
- **Interaction**: Links e elementos interativos (blue-20)

### Ícones
- **Primary**: Ícones principais (neutral-40)
- **Secondary**: Ícones secundários (neutral-30)
- **Brand**: Ícones da marca (navy-40)
- **Inactived**: Ícones desabilitados (neutral-20)

### Bordas
- **Primary**: Bordas padrão (neutral-20)
- **Secondary**: Bordas sutis (neutral-10)
- **Focused**: Bordas em foco (blue-20)
- **Brand-01**: Bordas da marca (navy-40)

### Botões
- **Primary**: Navy-40 (fundo) + White (texto)
- **Secondary**: White (fundo) + Navy-40 (borda/texto)
- **Ghost**: Transparente (fundo) + Navy-40 (texto)

---

## 🖼️ Assets Visuais

### Banners Disponíveis

Localizados em `/static/`:
- `banner-blue-money.jpg` - Banner azul com tema financeiro
- `banner-blue-phone.jpg` - Banner azul com celular
- `banner-gray-disabled.jpg` - Banner desabilitado/neutro
- `banner-yellow-money.jpg` - Banner amarelo com dinheiro ⭐
- `banner-yellow-time.jpg` - Banner amarelo com relógio

### Ícones SVG

Sprites SVG disponíveis em `/src/core/images/svg/`:
- `actions.svg` - Ações (editar, deletar, adicionar, etc)
- `alerts.svg` - Alertas e notificações
- `arrows.svg` - Setas e direções
- `brands.svg` - Logos de marcas ⭐
- `editor.svg` - Ferramentas de edição
- `emojis.svg` - Emojis
- `files.svg` - Tipos de arquivo
- `illustrations.svg` - Ilustrações ⭐
- `loaders.svg` - Animações de loading
- `money.svg` - Ícones financeiros ⭐
- `navigation.svg` - Navegação (menu, setas, etc)

---

## 📐 Espaçamentos

Sistema de espaçamento baseado em múltiplos de 8px:

```stylus
$space-1: 8px
$space-2: 16px
$space-3: 24px
$space-4: 32px
$space-5: 40px
$space-6: 48px
$space-7: 56px
$space-8: 64px
$space-9: 72px
$space-10: 80px
```

**Container Width**: 1366px  
**Column Gutter**: 24px

---

## 🎭 Animações

- **Ease**: `cubic-bezier(.72,.04,.16,.97)` - Transição padrão
- **Animation Time**: 3s - Tempo padrão de animação

---

## 📦 Como Usar no Projeto

### 1. Instalar o Design System

```bash
yarn add https://auroralabs.example/design-system/package#TAG-VERSAO
```

### 2. Importar Estilos

```stylus
// No seu arquivo .styl principal
@require "~aurora-labs-design/dist/styles.css"
```

### 3. Importar Fontes

Adicionar as fontes Rubik ao projeto seguindo o guia em `fontes/GUIA-IMPLEMENTACAO.md`

### 4. Usar Cores

```stylus
// Usando classes utilitárias
.bg--navy-40 { background-color: #002740; }
.txt--yellow-10 { color: #f9e27d; }

// Usando variáveis CSS
.meu-elemento {
  background-color: var(--surface-brand-01);
  color: var(--text-headline);
}
```

---

## 🎮 Aurora Academy: Quest DynamoDB

### Identidade Visual para Treinamentos Gamificados

Uma **sub-identidade visual** que mescla a identidade corporativa da Aurora Labs com elementos de gamificação para treinamentos técnicos.

#### 🎯 Abordagem: **Sutil e Profissional** (80% Aurora Labs + 20% Fantasy)

- **Tom**: Aurora Academy: Quest DynamoDB (corporativo-educacional)
- **Uso**: Material de treinamento DynamoDB (slides, docs, badges)
- **Elementos**: Sistema XP, Personagens, Locais, Itens temáticos

#### 🎨 Paleta Complementar Quest

Adiciona cores fantasy mantendo a base Aurora Labs:

| Cor Quest | Hex | Uso |
|-----------|-----|-----|
| `quest-magic` | `#a259ff` (purple-20) | Elementos mágicos, feitiços, XP |
| `quest-success` | `#789d4a` (green-20) | Conquistas, níveis, vitórias |
| `quest-warning` | `#f9e27d` (yellow-10) | Alertas importantes, desafios |
| `quest-danger` | `#f94f48` (red-20) | Erros, anti-patterns, perdas |
| `quest-crystal` | `#67d2df` (aqua-20) | Cristais, conhecimento, bônus |

#### 👥 Sistema de Personagens

**Protagonistas (Colaboradores da Aurora Labs):**
- 👩 **Zelda** - Colaboradora individual, exemplos simples
- 👨 **Link** - Colaborador Tech Corp, casos complexos

**NPCs e Mentores (Sistema de Níveis):**
- 🛡️ **Escudeiro** (0-500 XP) - Aprendiz
- 🗺️ **Cartógrafo** (501-1.000 XP) - Explorador
- ⚔️ **Cavaleiro** (1.001-1.500 XP) - Guardião
- 🔮 **Oráculo** (1.501-2.000 XP) - Sábio
- 👑 **Arquiteto-Mor** (2.001+ XP) - Grão-Mestre

#### 📖 Documentação Completa

Veja o guia completo de implementação: **[AURORA-ACADEMY-QUEST.md](./AURORA-ACADEMY-QUEST.md)**

Inclui:
- ✨ Sistema de níveis e XP
- 🏆 Badges e conquistas
- 🎭 Personagens e locais
- 📦 Componentes prontos (CSS + HTML)
- 🎨 Exemplos visuais

---

## 🔗 Links Úteis

- [Aurora Labs Design System](https://auroralabs.example/design-system/)
- [Arquivo de design fictício](https://auroralabs.example/design-system/design-file)
- [Guilda do Design System fictícia](https://auroralabs.example/design-system/guild)
- [Lista Completa de Componentes](https://auroralabs.example/design-system/components)
- Canal interno: **Aurora Design System**

---


**Última atualização**: Novembro 2025  
**Fonte**: aurora-labs-design + aurora-www-dashboard

