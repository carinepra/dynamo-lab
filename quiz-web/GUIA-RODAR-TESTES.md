# 🧪 Guia Rápido - Como Rodar os Testes

**Problema resolvido:** Agora você sempre saberá se os testes travaram ou só estão demorando!

---

## 🚀 Método 1: Script com Timeout (RECOMENDADO)

Use o script `run-tests.sh` que mostra progresso em tempo real e tem timeout automático:

```bash
# Rodar todos os testes (com timeout e progresso)
./run-tests.sh all

# Rodar apenas testes unitários (timeout: 60s)
./run-tests.sh unit

# Rodar apenas testes E2E (timeout: 180s)
./run-tests.sh e2e
```

**Vantagens:**
- ✅ Mostra pontos de progresso a cada 5 segundos
- ✅ Avisa quando está demorando (30s, 1min, 2min)
- ✅ Para automaticamente se travar
- ✅ Mostra tempo total de execução
- ✅ Resumo final colorido

---

## ⚡ Método 2: Scripts NPM Diretos

### Testes Unitários (RÁPIDOS - ~1 segundo)

```bash
# Com feedback detalhado
npm run test:unit

# Modo rápido (só dots)
npm run test:unit:fast

# Modo watch (re-roda ao salvar)
npm run test:unit:watch

# Interface gráfica
npm run test:unit:ui

# Com cobertura
npm run test:unit:coverage
```

**Timeout:** 10s por teste, 60s total

### Testes E2E (LENTOS - ~30-60 segundos)

```bash
# Com lista de progresso
npm run test:e2e

# Modo rápido (só dots)
npm run test:e2e:fast

# Com browser visível
npm run test:e2e:headed

# Debug passo a passo
npm run test:e2e:debug

# Interface gráfica
npm run test:e2e:ui
```

**Timeout:** 30s por teste, 5min total

### Todos os Testes

```bash
# Unitários + E2E (modo rápido)
npm run test:all
```

---

## 🕐 Timeouts Configurados

| Tipo de Teste | Por Teste | Total |
|---------------|-----------|-------|
| **Unitário** | 10 segundos | 60 segundos |
| **E2E** | 30 segundos | 5 minutos |

**Se passar desses tempos, o teste PARA automaticamente!**

---

## 📊 Como Interpretar a Saída

### Testes Unitários (Vitest)

```
✓ tests/unit/config.spec.js  (15 tests) 4ms
✓ tests/unit/state.spec.js   (31 tests) 4ms
✓ tests/unit/icons.spec.js   (30 tests) 10ms

Test Files  3 passed (3)
     Tests  76 passed (76)
  Duration  666ms
```

**Significado:**
- ✓ = Arquivo passou
- (X tests) = Quantidade de testes
- Xms = Tempo de execução
- **Se não aparecer nada por mais de 10s = TRAVOU**

### Testes E2E (Playwright)

```
  1  ✓ deve carregar a tela inicial corretamente (2s)
  2  ✓ deve validar nome vazio (1s)
  ...
  42 ✓ deve funcionar em mobile (3s)

  42 passed (45s)
```

**Significado:**
- Cada linha = 1 teste
- (Xs) = Tempo de cada teste
- **Se ficar mais de 30s em um teste = TRAVOU**

---

## 🚨 O Que Fazer Se Travar

### 1. Identificar que Travou

**Sinais:**
- Script `run-tests.sh` para automaticamente
- Nenhum novo ponto (.) aparece por > 30s
- CPU fica 100% por muito tempo
- Nenhuma nova linha por > 1 minuto

### 2. Cancelar (se usar npm direto)

```bash
# Pressione Ctrl+C para cancelar
```

### 3. Matar Processos Travados

```bash
# Matar todos os processos Node
killall node

# Matar Playwright especificamente
pkill -f playwright

# Matar Vitest especificamente
pkill -f vitest
```

### 4. Limpar e Tentar Novamente

```bash
# Limpar cache do Playwright
rm -rf playwright-report test-results

# Reinstalar browsers
npx playwright install

# Tentar novamente
./run-tests.sh unit  # Começar só com unitários
```

---

## 💡 Dicas Para Testes Mais Rápidos

### Para Testes Unitários

```bash
# Rodar apenas 1 arquivo
npx vitest run tests/unit/config.spec.js

# Rodar apenas testes que contêm "XP"
npx vitest run -t "XP"

# Modo watch (só re-roda o que mudou)
npm run test:unit:watch
```

### Para Testes E2E

```bash
# Rodar apenas 1 browser (Chrome)
npx playwright test --project=chromium

# Rodar apenas 1 arquivo
npx playwright test tests/quiz.spec.js

# Rodar apenas testes que contêm "Tela Inicial"
npx playwright test -g "Tela Inicial"

# Rodar em paralelo (mais rápido)
npx playwright test --workers=4
```

---

## 🔍 Verificar Se Servidor Está Rodando

Antes de rodar testes E2E, verifique:

```bash
# Verificar se porta 3002 está aberta
curl http://localhost:3002

# Se não responder, iniciar servidor
cd <caminho-do-projeto>
python3 -m http.server 8080
```

**Obs:** Playwright inicia o servidor automaticamente, mas é bom verificar.

---

## 📈 Progresso Esperado

### Testes Unitários (76 testes)
```
[    ] 0s     - Carregando...
[■■  ] 0.3s   - config.spec.js rodando
[■■■ ] 0.6s   - state.spec.js rodando
[■■■■] 1s     - ✅ COMPLETO
```

**Total esperado:** < 2 segundos

### Testes E2E (42 testes)
```
[    ] 0s     - Iniciando Playwright...
[■   ] 10s    - Primeiros 10 testes
[■■  ] 20s    - 20 testes
[■■■ ] 30s    - 30 testes
[■■■■] 45s    - ✅ COMPLETO
```

**Total esperado:** 30-60 segundos (depende do backend)

---

## ✅ Checklist Antes de Rodar Testes

- [ ] Dependências instaladas (`npm install`)
- [ ] Porta 3002 disponível (ou 8080 para produção)
- [ ] Backend rodando (só para testes E2E reais, não mocks)
- [ ] Espaço em disco (para screenshots/videos de falhas)

---

## 🎯 Comandos Mais Usados

```bash
# 🥇 Para desenvolvimento (rápido e com feedback)
./run-tests.sh unit

# 🥈 Para validação completa (antes de commit)
./run-tests.sh all

# 🥉 Para debug de problema específico
npm run test:e2e:headed   # Ver browser
npm run test:unit:ui      # Interface gráfica
```

---

## 🐛 Troubleshooting

### "TIMEOUT após 60s"
**Causa:** Teste unitário travou ou está muito lento  
**Solução:** Rodar teste específico para identificar qual está lento

### "TIMEOUT após 180s" (E2E)
**Causa:** Backend não respondendo ou teste travado  
**Solução:** Verificar se backend está rodando, limpar cache

### "Cannot connect to port 3002"
**Causa:** Servidor não iniciou  
**Solução:** Playwright deve iniciar automaticamente, mas pode precisar de `npx playwright install`

### Todos os testes falhando
**Causa:** Algo de errado com o ambiente  
**Solução:**
```bash
rm -rf node_modules
npm install
npx playwright install
./run-tests.sh unit  # Começar simples
```

---

**Criado em:** 28/11/2025  
**Versão:** 1.0.0  
**Autor:** Equipe Aurora DynamoDB

