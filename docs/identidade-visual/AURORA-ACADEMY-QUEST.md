# 🎮 Aurora Academy: Quest DynamoDB

## Identidade Visual para Treinamentos Gamificados

**Versão**: 1.0  
**Data**: Novembro 2025  
**Abordagem**: 80% Aurora Labs + 20% Fantasy (Sutil e Profissional)  
**Uso**: Material de treinamento DynamoDB

---

## 📋 Índice

- [Filosofia](#-filosofia)
- [Paleta de Cores Quest](#-paleta-de-cores-quest)
- [Tipografia Quest](#-tipografia-quest)
- [Sistema de Níveis e XP](#-sistema-de-níveis-e-xp)
- [Badges e Conquistas](#-badges-e-conquistas)
- [Personagens](#-personagens)
- [Locais](#-locais)
- [Itens e Elementos](#-itens-e-elementos)
- [Componentes Prontos](#-componentes-prontos)
- [Exemplos de Uso](#-exemplos-de-uso)

---

## 🎯 Filosofia

### Objetivo

Criar uma **experiência de aprendizado envolvente** que mantém o profissionalismo da Aurora Labs enquanto adiciona elementos de gamificação para aumentar o engajamento em treinamentos técnicos.

### Princípios

1. **Profissional Primeiro**: A identidade Aurora Labs é prioridade
2. **Fantasy Sutil**: Elementos RPG são discretos e bem integrados
3. **Educacional**: Gamificação serve o aprendizado, não o contrário
4. **Escalável**: Pode ser usado em outros treinamentos técnicos

### Tom de Comunicação

**"Aurora Academy: Quest DynamoDB"** - Tom corporativo-educacional que combina:
- ✅ Seriedade técnica da Aurora Labs
- ✅ Engajamento de narrativas RPG
- ✅ Clareza educacional
- ❌ Não é infantil ou excessivamente lúdico

---

## 🎨 Paleta de Cores Quest

### Cores Base Aurora Labs (Mantidas)

Estas cores permanecem como fundação:

```css
/* Primárias Aurora Labs */
--brand-navy-40: #002740;    /* Cor principal da marca */
--brand-aqua-20: #67d2df;    /* Cor secundária */
--brand-yellow-10: #f9e27d;  /* Destaque */
--brand-neutral-40: #253746; /* Texto principal */
--brand-neutral-0: #ffffff;  /* Branco */
```

### Cores Complementares Quest

Cores adicionadas para elementos gamificados:

| Variável CSS | Cor Aurora Labs | Hex | Uso Quest |
|--------------|----------|-----|-----------|
| `--quest-magic` | `purple-20` | `#a259ff` | XP, feitiços, magia, conhecimento místico |
| `--quest-success` | `green-20` | `#789d4a` | Níveis, conquistas, missões completas |
| `--quest-warning` | `yellow-10` | `#f9e27d` | Desafios, atenção, alertas importantes |
| `--quest-danger` | `red-20` | `#f94f48` | Erros, anti-patterns, falhas |
| `--quest-crystal` | `aqua-20` | `#67d2df` | Cristais, bônus, poder, conhecimento |
| `--quest-dark` | `navy-40` | `#002740` | Backgrounds, containers principais |
| `--quest-medium` | `neutral-30` | `#546c7e` | Textos secundários, bordas |
| `--quest-light` | `neutral-10` | `#e1e9ec` | Backgrounds claros, cards |

### Mapeamento Semântico Quest

```css
/* Sistema de XP e Progresso */
--xp-bar-fill: var(--quest-magic);
--xp-bar-bg: var(--quest-light);
--level-badge: var(--quest-success);

/* Estados de Missão */
--mission-pending: var(--quest-medium);
--mission-in-progress: var(--brand-aqua-20);
--mission-completed: var(--quest-success);
--mission-failed: var(--quest-danger);

/* Elementos de UI */
--card-quest-bg: var(--brand-neutral-0);
--card-quest-border: var(--quest-light);
--card-quest-shadow: rgba(0, 39, 64, 0.1);

/* Badges e Conquistas */
--badge-bg-bronze: #c0a445;
--badge-bg-silver: #abbdc8;
--badge-bg-gold: #f9e27d;
--badge-bg-legend: #a259ff;
```

---

## 🖋️ Tipografia Quest

### Fonte: Rubik (mantida da Aurora Labs)

#### Hierarquia Épica

```css
/* 🧙 Voz do Arquiteto-Mor (Títulos Principais) */
.quest-title-epic {
  font-family: 'Rubik', sans-serif;
  font-weight: 700;
  font-size: 32px;
  line-height: 1.2;
  color: var(--quest-dark);
  letter-spacing: -0.5px;
}

/* ⚔️ Títulos de Capítulo */
.quest-title-chapter {
  font-family: 'Rubik', sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 1.3;
  color: var(--quest-dark);
}

/* 🎯 Títulos de Missão */
.quest-title-mission {
  font-family: 'Rubik', sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.4;
  color: var(--quest-dark);
}

/* 📖 Corpo de Texto */
.quest-body {
  font-family: 'Rubik', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.6;
  color: var(--quest-medium);
}

/* 💬 Diálogos de Personagens */
.quest-dialogue {
  font-family: 'Rubik', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.6;
  color: var(--quest-dark);
  font-style: italic;
  padding-left: 16px;
  border-left: 3px solid var(--quest-crystal);
}

/* 🏷️ Labels e Metadata */
.quest-label {
  font-family: 'Rubik', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.4;
  color: var(--quest-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 💻 Código (Monospace) */
.quest-code {
  font-family: 'Courier New', Courier, monospace;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
  color: var(--quest-dark);
  background: var(--quest-light);
  padding: 2px 6px;
  border-radius: 4px;
}
```

---

## 📊 Sistema de Níveis e XP

### Níveis (Ranks)

Cada nível representa um personagem mestre/mentor que guia os colaboradores:

| Rank | XP Necessário | Personagem | Emoji | Cor | Descrição |
|------|---------------|------------|-------|-----|-----------|
| 🥉 **Aprendiz** | 0 - 500 | **Escudeiro** | 🛡️ | `bronze` | Iniciante em DynamoDB |
| 🥈 **Explorador** | 501 - 1.000 | **Cartógrafo** | 🗺️ | `silver` | Entende os fundamentos |
| 🥇 **Guardião** | 1.001 - 1.500 | **Cavaleiro** | ⚔️ | `gold` | Domina access patterns |
| 💎 **Sábio** | 1.501 - 2.000 | **Oráculo** | 🔮 | `aqua-20` | Arquiteto de soluções |
| ⚡ **Grão-Mestre** | 2.001+ | **Arquiteto-Mor** | 👑 | `purple-20` | Mestre do DynamoDB |

### Componente: Badge de Nível

```html
<!-- Bronze/Aprendiz -->
<div class="quest-level-badge quest-level-bronze">
  <span class="quest-level-emoji">🛡️</span>
  <span class="quest-level-name">Escudeiro</span>
  <span class="quest-level-xp">350 / 500 XP</span>
</div>

<!-- Grão-Mestre -->
<div class="quest-level-badge quest-level-legend">
  <span class="quest-level-emoji">👑</span>
  <span class="quest-level-name">Grão-Mestre</span>
  <span class="quest-level-xp">2.100 XP</span>
</div>
```

### Componente: Barra de Progresso XP

```html
<div class="quest-xp-bar">
  <div class="quest-xp-bar-header">
    <span class="quest-xp-current">750 XP</span>
    <span class="quest-xp-target">/ 1.000 XP</span>
    <span class="quest-xp-next">Faltam 250 XP para Senior!</span>
  </div>
  <div class="quest-xp-bar-track">
    <div class="quest-xp-bar-fill" style="width: 75%"></div>
  </div>
</div>
```

---

## 🏆 Badges e Conquistas

### Tipos de Conquistas

| Tipo | Ícone | Cor | Critério |
|------|-------|-----|----------|
| **Fundamentos** | 🎓 | `blue-20` | Completar Academia dos Fundamentos |
| **Access Pattern** | 🗺️ | `aqua-20` | Criar query correta |
| **Performance** | ⚡ | `yellow-10` | Query < 10ms |
| **Boss Defeat** | ⚔️ | `green-20` | Completar desafio principal |
| **Mestre** | 👑 | `purple-20` | Completar todos os capítulos |

### Componente: Badge de Conquista

```html
<div class="quest-achievement">
  <div class="quest-achievement-icon">⚡</div>
  <div class="quest-achievement-content">
    <h4 class="quest-achievement-title">Mestre da Query Reversa</h4>
    <p class="quest-achievement-desc">
      Usou ScanIndexForward=false com sucesso
    </p>
    <span class="quest-achievement-xp">+500 XP</span>
  </div>
</div>
```

---

## 🎭 Personagens

### Protagonistas (Colaboradores da Aurora Labs)

Estes são os **alunos/jogadores** do treinamento, representando colaboradores reais:

#### 👩 Zelda
- **Cor Temática**: `aqua-20` (#67d2df)
- **Papel**: Colaboradora individual
- **Perfil**: 1 plano, 2 certificados, exemplos simples
- **Uso**: Missões iniciais, GetItem, Query básica

#### 👨 Link
- **Cor Temática**: `green-20` (#789d4a)
- **Papel**: Colaborador Tech Corp
- **Perfil**: 2 planos, 3 certificados, casos complexos
- **Uso**: Exemplos avançados, boss battles, múltiplas queries

---

### NPCs e Mentores

Personagens que representam os níveis de conhecimento e guiam os protagonistas:

#### 🛡️ Escudeiro (Nível: Aprendiz)
- **Cor Temática**: `bronze` (#c0a445)
- **Descrição**: Iniciante que está aprendendo os fundamentos
- **Mensagem**: "Ainda estou aprendendo GetItem!"

#### 🗺️ Cartógrafo (Nível: Explorador)
- **Cor Temática**: `silver` (#abbdc8)
- **Descrição**: Explorador que mapeia access patterns
- **Mensagem**: "Conheço bem Query e begins_with"

#### ⚔️ Cavaleiro (Nível: Guardião)
- **Cor Temática**: `gold` (#f9e27d)
- **Descrição**: Guardião que domina queries complexas
- **Mensagem**: "Protejo os dados com Single-Table Design"

#### 🔮 Oráculo (Nível: Sábio)
- **Cor Temática**: `aqua-20` (#67d2df)
- **Descrição**: Sábio que enxerga além, arquiteto de soluções
- **Mensagem**: "Vejo todos os access patterns possíveis"

#### 👑 Arquiteto-Mor (Nível: Grão-Mestre)
- **Cor Temática**: `purple-20` (#a259ff)
- **Descrição**: Tech Lead, mentor supremo, mestre absoluto
- **Mensagem**: "Domino todas as artes do DynamoDB"
- **Uso**: Explicações técnicas, dicas avançadas

### Componente: Card de Personagem

```html
<div class="quest-character-card quest-character-zelda">
  <div class="quest-character-avatar">👩</div>
  <div class="quest-character-info">
    <h3 class="quest-character-name">Zelda</h3>
    <p class="quest-character-role">Colaboradora Individual</p>
    <ul class="quest-character-stats">
      <li>📋 1 Plano</li>
      <li>🎖️ 2 Certificados</li>
      <li>💰 R$ 3.425,00</li>
    </ul>
  </div>
</div>
```

---

## 🏛️ Locais

### Mapa de Locais da Quest

| Local | Emoji | Cor | Capítulo | Descrição |
|-------|-------|-----|----------|-----------|
| **Academia** | 🏛️ | `blue-20` | Cap. 1 | Fundamentos (GetItem, Query, Scan) |
| **Templo** | ⛩️ | `aqua-20` | Cap. 2 | Decisões pragmáticas (denormalização) |
| **Castelo** | 🏰 | `navy-40` | Cap. 3 | Desafio da escala (Single-Table) |
| **Torre** | 🗼 | `purple-20` | Cap. 4 | GSIs (Global Secondary Indexes) |
| **Caverna** | ⚠️ | `red-20` | Cap. 5 | Anti-Padrões (erros comuns) |
| **Oráculo** | 🔮 | `green-20` | Cap. 6 | Métricas e observabilidade |

### Componente: Header de Local

```html
<div class="quest-location-header quest-location-academia">
  <div class="quest-location-icon">🏛️</div>
  <div class="quest-location-info">
    <h2 class="quest-location-name">Academia dos Fundamentos</h2>
    <p class="quest-location-desc">Aprenda os 3 Feitiços Fundamentais</p>
  </div>
  <div class="quest-location-chapter">Capítulo 1</div>
</div>
```

---

## 🎁 Itens e Elementos

### Itens de Poder

| Item | Emoji | Cor | Obtido | Efeito |
|------|-------|-----|--------|--------|
| **Tomo do DynamoDB** | 📖 | `blue-20` | Cap. 1 | Conhecimento básico |
| **Amuleto da Desnormalização** | 🔮 | `purple-20` | Cap. 2 | Entendimento de trade-offs |
| **Cristal de Performance** | 💎 | `aqua-20` | Cap. 3 | Maestria em queries |
| **Chave dos GSIs** | 🔑 | `yellow-10` | Cap. 4 | Acesso avançado |
| **Escudo Anti-Pattern** | 🛡️ | `red-20` | Cap. 5 | Proteção contra erros |
| **Orbe das Métricas** | 🔮 | `green-20` | Cap. 6 | Observabilidade total |

### Componente: Card de Item

```html
<div class="quest-item-card">
  <div class="quest-item-icon">📖</div>
  <div class="quest-item-content">
    <h4 class="quest-item-name">Tomo do DynamoDB</h4>
    <p class="quest-item-desc">
      Grimório contendo os fundamentos de GetItem, Query e Scan
    </p>
    <span class="quest-item-obtained">Obtido no Cap. 1</span>
  </div>
</div>
```

---

## 📦 Componentes Prontos

### Card de Missão

```html
<div class="quest-mission-card quest-mission-pending">
  <!-- Header -->
  <div class="quest-mission-header">
    <div class="quest-mission-number">Missão 1</div>
    <div class="quest-mission-difficulty">
      <span>⭐⭐</span>
      <span>Intermediária</span>
    </div>
  </div>
  
  <!-- Conteúdo -->
  <div class="quest-mission-content">
    <h3 class="quest-mission-title">Home do App da Zelda</h3>
    <p class="quest-mission-desc">
      Zelda faz login no app. Você precisa mostrar seus dados 
      básicos na tela inicial usando GetItem.
    </p>
    
    <!-- Objetivos -->
    <ul class="quest-mission-objectives">
      <li class="quest-objective-done">✅ Entender GetItem</li>
      <li class="quest-objective-pending">⏳ Escrever query</li>
      <li class="quest-objective-pending">⏳ Validar resultado</li>
    </ul>
  </div>
  
  <!-- Footer -->
  <div class="quest-mission-footer">
    <span class="quest-mission-xp">+150 XP</span>
    <button class="quest-mission-btn">Iniciar Missão</button>
  </div>
</div>
```

### Box de Diálogo

```html
<div class="quest-dialogue-box quest-dialogue-wizard">
  <div class="quest-dialogue-avatar">🧙</div>
  <div class="quest-dialogue-content">
    <div class="quest-dialogue-name">Arquiteto-Mor</div>
    <p class="quest-dialogue-text">
      "Bem-vindos ao Reino da Aurora Labs! Antes de começar, 
      precisam entender: SQL NÃO é nosso inimigo!"
    </p>
  </div>
</div>
```

### Caixa de Conceito

```html
<div class="quest-concept-box quest-concept-info">
  <div class="quest-concept-icon">💡</div>
  <div class="quest-concept-content">
    <h4 class="quest-concept-title">GetItem - Invocação Direta</h4>
    <p class="quest-concept-desc">
      Busca 1 item EXATO quando você sabe a Partition Key (PK) 
      e Sort Key (SK). Custo: 1 RCU. Velocidade: ⚡⚡⚡ 2-5ms.
    </p>
    <div class="quest-concept-example">
      <code>PK = "EMPLOYEE#660e8400..." SK = "SUMMARY"</code>
    </div>
  </div>
</div>
```

### Tabela de Comparação

```html
<div class="quest-comparison-table">
  <h3 class="quest-comparison-title">SQL vs DynamoDB</h3>
  
  <table>
    <thead>
      <tr>
        <th>Operação</th>
        <th>🐌 SQL</th>
        <th>⚡ DynamoDB</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Buscar employee</td>
        <td class="quest-slow">280ms (6 JOINs)</td>
        <td class="quest-fast">3ms (GetItem)</td>
      </tr>
      <tr>
        <td>Listar planos</td>
        <td class="quest-slow">180ms (2 JOINs)</td>
        <td class="quest-fast">5ms (Query)</td>
      </tr>
      <tr>
        <td>Último saldo</td>
        <td class="quest-slow">150ms (ORDER BY)</td>
        <td class="quest-fast">3ms (Query reversa)</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td><strong>Total</strong></td>
        <td class="quest-slow"><strong>730ms</strong></td>
        <td class="quest-fast"><strong>25ms</strong> 🚀</td>
      </tr>
    </tfoot>
  </table>
</div>
```

### Alerta de Anti-Pattern

```html
<div class="quest-alert quest-alert-danger">
  <div class="quest-alert-icon">⚠️</div>
  <div class="quest-alert-content">
    <h4 class="quest-alert-title">Magia Proibida: Scan em Produção</h4>
    <p class="quest-alert-text">
      Nunca use Scan em APIs de produção! Lê TODOS os registros,
      é muito caro e pode travar a tabela.
    </p>
    <div class="quest-alert-example">
      <strong>História de Terror Real:</strong>
      <p>Um dev fez Scan em produção. Budget AWS: R$ 200 → R$ 8.000. 
      Tabela travou por 2 horas. RIP sua carreira. 💀</p>
    </div>
  </div>
</div>
```

---

## 🎨 Exemplos de Uso

### Estrutura de Página Quest

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Aurora Academy: Quest DynamoDB</title>
  <link rel="stylesheet" href="componentes-quest.css">
</head>
<body class="quest-body">
  
  <!-- Header Principal -->
  <header class="quest-header">
    <div class="quest-header-brand">
      <img src="logo-aurora.svg" alt="Aurora Labs" class="quest-logo">
      <span class="quest-header-title">Academy: Quest DynamoDB</span>
    </div>
    <div class="quest-header-user">
      <div class="quest-level-badge quest-level-pleno">
        <span class="quest-level-emoji">🥈</span>
        <span class="quest-level-name">Pleno</span>
      </div>
      <span class="quest-user-name">João Silva</span>
    </div>
  </header>
  
  <!-- Barra de Progresso -->
  <div class="quest-progress-container">
    <div class="quest-xp-bar">
      <div class="quest-xp-bar-header">
        <span class="quest-xp-current">750 XP</span>
        <span class="quest-xp-target">/ 1.000 XP</span>
      </div>
      <div class="quest-xp-bar-track">
        <div class="quest-xp-bar-fill" style="width: 75%"></div>
      </div>
    </div>
  </div>
  
  <!-- Conteúdo Principal -->
  <main class="quest-main">
    
    <!-- Header de Local -->
    <div class="quest-location-header quest-location-academia">
      <div class="quest-location-icon">🏛️</div>
      <div class="quest-location-info">
        <h1 class="quest-location-name">Academia dos Fundamentos</h1>
        <p class="quest-location-desc">
          Aprenda os 3 Feitiços Fundamentais do DynamoDB
        </p>
      </div>
      <div class="quest-location-chapter">Capítulo 1</div>
    </div>
    
    <!-- Diálogo de Introdução -->
    <div class="quest-dialogue-box quest-dialogue-wizard">
      <div class="quest-dialogue-avatar">🧙</div>
      <div class="quest-dialogue-content">
        <div class="quest-dialogue-name">Arquiteto-Mor</div>
        <p class="quest-dialogue-text">
          "Bem-vindos! Antes de enfrentar o desafio da escala,
          vocês precisam dominar os 3 Feitiços Fundamentais!"
        </p>
      </div>
    </div>
    
    <!-- Conceito -->
    <div class="quest-concept-box quest-concept-info">
      <div class="quest-concept-icon">✨</div>
      <div class="quest-concept-content">
        <h3 class="quest-concept-title">Feitiço 1: GetItem</h3>
        <p class="quest-concept-desc">
          Busca 1 item EXATO quando você sabe a Partition Key (PK) 
          e Sort Key (SK).
        </p>
        <div class="quest-concept-stats">
          <span>Custo: 1 RCU</span>
          <span>Velocidade: ⚡⚡⚡ 2-5ms</span>
          <span>Escalabilidade: ♾️ Infinita</span>
        </div>
      </div>
    </div>
    
    <!-- Missão -->
    <div class="quest-mission-card quest-mission-in-progress">
      <div class="quest-mission-header">
        <div class="quest-mission-number">Missão 1</div>
        <div class="quest-mission-difficulty">
          <span>⭐⭐</span>
          <span>Intermediária</span>
        </div>
      </div>
      
      <div class="quest-mission-content">
        <h3 class="quest-mission-title">Home do App da Zelda</h3>
        <p class="quest-mission-desc">
          Zelda faz login no app. Mostre seus dados básicos usando GetItem.
        </p>
      </div>
      
      <div class="quest-mission-footer">
        <span class="quest-mission-xp">+150 XP</span>
        <button class="quest-mission-btn">Continuar Missão</button>
      </div>
    </div>
    
  </main>
  
  <!-- Footer -->
  <footer class="quest-footer">
    <p>Aurora Academy: Quest DynamoDB | Novembro 2025</p>
  </footer>
  
</body>
</html>
```

### Slide de Apresentação

```markdown
---
theme: aurora-academy-quest
---

# 🏛️ Capítulo 1
## Academia dos Fundamentos

**Aurora Academy: Quest DynamoDB**

---

## 🧙 Arquiteto-Mor

> "Antes de enfrentar o sistema legado, vocês precisam
> dominar os 3 Feitiços Fundamentais do DynamoDB!"

---

## ✨ Feitiço 1: GetItem

**Invocação Direta**

- O que faz: Busca 1 item EXATO
- Quando usar: Você sabe PK e SK
- Performance: ⚡⚡⚡ 2-5ms
- Custo: 1 RCU

```python
response = dynamodb.get_item(
    TableName='aurora-benefits',
    Key={
        'PK': {'S': 'EMPLOYEE#660e8400...'},
        'SK': {'S': 'SUMMARY'}
    }
)
```

---

## 🎯 Comparação: SQL vs DynamoDB

| Operação | SQL | DynamoDB |
|----------|-----|----------|
| Buscar employee | 280ms (6 JOINs) 🐌 | 3ms ⚡⚡⚡ |
| Listar planos | 180ms (2 JOINs) 🐌 | 5ms ⚡⚡ |
| Último saldo | 150ms (ORDER BY) 🐌 | 3ms ⚡⚡⚡ |
| **Total** | **730ms** 💀 | **25ms** 🚀 |

**29x MAIS RÁPIDO!**

---
```

---

## 💻 CSS Completo

Veja o arquivo completo de estilos: **[componentes-quest.css](./componentes-quest.css)**

Inclui:
- ✨ Variáveis CSS personalizadas
- 🎨 Classes de utilidade
- 📦 Componentes prontos
- 🎭 Animações sutis
- 📱 Responsividade

---

## 🚀 Como Usar

### 1. Importar Estilos

```html
<!-- Base da Aurora Labs -->
<link rel="stylesheet" href="identidade-visual/aurora-base.css">

<!-- Extensão Quest -->
<link rel="stylesheet" href="identidade-visual/componentes-quest.css">
```

### 2. Estrutura Básica

```html
<body class="quest-body">
  <header class="quest-header">
    <!-- Logo e navegação -->
  </header>
  
  <main class="quest-main">
    <!-- Conteúdo do treinamento -->
  </main>
  
  <footer class="quest-footer">
    <!-- Rodapé -->
  </footer>
</body>
```

### 3. Adicionar Componentes

Copie e cole os componentes HTML desta documentação e personalize conforme necessário.

---

## 📸 Screenshots

> **Nota**: Em produção, adicionar screenshots dos componentes em uso

---

## 🔄 Versionamento

| Versão | Data | Mudanças |
|--------|------|----------|
| 1.0 | Nov 2025 | Lançamento inicial da identidade Quest |

---

## 👥 Créditos

**Desenvolvido por**: Equipe Aurora Labs  
**Design System Base**: aurora-labs-design  
**Narrativa**: NARRATIVA.md (Quest DynamoDB)

---

**Última atualização**: Novembro 2025  
**Versão**: 1.0

