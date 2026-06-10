.PHONY: help setup test test-ui test-headed test-debug test-report test-chrome test-firefox test-safari test-mobile test-bugs clean

# Cores para output
GREEN  := \033[0;32m
YELLOW := \033[0;33m
RED    := \033[0;31m
BLUE   := \033[0;34m
RESET  := \033[0m

##@ 📚 Ajuda

help: ## Mostra esta mensagem de ajuda
	@echo "$(GREEN)════════════════════════════════════════════════════════════════$(RESET)"
	@echo "$(GREEN)      🧪 Testes Automatizados do Quiz - Comandos                $(RESET)"
	@echo "$(GREEN)════════════════════════════════════════════════════════════════$(RESET)"
	@awk 'BEGIN {FS = ":.*##"; printf "\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(YELLOW)%-20s$(RESET) %s\n", $$1, $$2 } /^##@/ { printf "\n$(GREEN)%s$(RESET)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(BLUE)💡 Dica: Frontend deve estar rodando em http://localhost:3002$(RESET)"
	@echo "$(BLUE)   Use 'cd .. && make frontend-start' em outro terminal$(RESET)"
	@echo ""

##@ 🚀 Início Rápido

setup: ## Instala dependências e browsers do Playwright (execute apenas uma vez)
	@echo "$(GREEN)📦 Instalando dependências dos testes...$(RESET)"
	@cd .. && npm install
	@echo "$(GREEN)🌐 Instalando browsers do Playwright...$(RESET)"
	@cd .. && npx playwright install
	@echo "$(GREEN)✅ Setup de testes concluído!$(RESET)"
	@echo ""
	@echo "$(YELLOW)Próximos passos:$(RESET)"
	@echo "  1. Inicie o frontend: cd .. && make frontend-start"
	@echo "  2. Rode os testes: make test"

test: ## Roda todos os testes E2E (recomendado)
	@echo "$(GREEN)🧪 Executando todos os testes do quiz...$(RESET)"
	@echo "$(YELLOW)💡 Certifique-se que o frontend está rodando!$(RESET)"
	@echo ""
	@cd .. && npm test

##@ 🎨 Modo Visual/Debug

test-ui: ## Abre interface gráfica interativa (MELHOR para debug!)
	@echo "$(GREEN)🎨 Abrindo interface de testes Playwright...$(RESET)"
	@echo "$(BLUE)💡 Você pode ver, editar e rodar testes visualmente$(RESET)"
	@cd .. && npm run test:ui

test-headed: ## Roda testes com browser visível (útil para debug)
	@echo "$(GREEN)👀 Executando testes com browser visível...$(RESET)"
	@cd .. && npm run test:headed

test-debug: ## Debug passo a passo com DevTools
	@echo "$(GREEN)🐛 Modo debug (passo a passo)...$(RESET)"
	@cd .. && npm run test:debug

##@ 📊 Relatórios

test-report: ## Abre relatório HTML dos últimos testes
	@echo "$(GREEN)📊 Abrindo relatório de testes...$(RESET)"
	@cd .. && npm run test:report

##@ 🌐 Testes por Browser

test-chrome: ## Roda testes apenas no Chrome (mais rápido)
	@echo "$(GREEN)🧪 Executando testes no Chrome...$(RESET)"
	@cd .. && npx playwright test --project=chromium

test-firefox: ## Roda testes apenas no Firefox
	@echo "$(GREEN)🧪 Executando testes no Firefox...$(RESET)"
	@cd .. && npx playwright test --project=firefox

test-safari: ## Roda testes apenas no Safari/WebKit
	@echo "$(GREEN)🧪 Executando testes no Safari...$(RESET)"
	@cd .. && npx playwright test --project=webkit

test-mobile: ## Roda testes mobile (iOS + Android)
	@echo "$(GREEN)📱 Executando testes mobile...$(RESET)"
	@cd .. && npx playwright test --project="Mobile Chrome" --project="Mobile Safari"

##@ 🐛 Testes Específicos

test-bugs: ## Roda apenas testes de bugs de usabilidade
	@echo "$(GREEN)🐛 Executando testes de bugs de usabilidade...$(RESET)"
	@echo ""
	@echo "$(YELLOW)Bugs identificados:$(RESET)"
	@echo "  1. Múltiplos cliques em 'Validar'"
	@echo "  2. Feedback não limpa ao trocar questão"
	@echo "  3. Timer não para ao validar"
	@echo "  4. Botões não desabilitam durante validação"
	@echo "  5. Caracteres especiais em nomes"
	@echo ""
	@cd .. && npx playwright test -g "BUG"

test-timer: ## Roda apenas testes de timer
	@echo "$(GREEN)⏱️  Executando testes de timer...$(RESET)"
	@cd .. && npx playwright test -g "Timer"

test-inicio: ## Roda apenas testes da tela inicial
	@echo "$(GREEN)🏁 Executando testes da tela inicial...$(RESET)"
	@cd .. && npx playwright test -g "Tela Inicial"

test-multipla: ## Roda apenas testes de múltipla escolha
	@echo "$(GREEN)☑️  Executando testes de múltipla escolha...$(RESET)"
	@cd .. && npx playwright test -g "Múltipla Escolha"

test-abertas: ## Roda apenas testes de questões abertas
	@echo "$(GREEN)✏️  Executando testes de questões abertas...$(RESET)"
	@cd .. && npx playwright test -g "Abertas"

test-codigo: ## Roda apenas testes de questões de código
	@echo "$(GREEN)💻 Executando testes de código...$(RESET)"
	@cd .. && npx playwright test -g "Código"

test-navegacao: ## Roda apenas testes de navegação/fluxo
	@echo "$(GREEN)🧭 Executando testes de navegação...$(RESET)"
	@cd .. && npx playwright test -g "Navegação"

test-resultado: ## Roda apenas testes da tela de resultado
	@echo "$(GREEN)🏆 Executando testes de resultado...$(RESET)"
	@cd .. && npx playwright test -g "Resultado"

test-responsive: ## Roda apenas testes de responsividade
	@echo "$(GREEN)📱 Executando testes de responsividade...$(RESET)"
	@cd .. && npx playwright test -g "Responsividade"

##@ 🔧 Utilitários

codegen: ## Grava interações e gera código de teste automaticamente
	@echo "$(GREEN)🎬 Iniciando Playwright Codegen...$(RESET)"
	@echo "$(BLUE)💡 Interaja com o app e o código será gerado!$(RESET)"
	@cd .. && npm run test:codegen

trace: ## Visualiza trace de uma execução específica
	@echo "$(GREEN)🔍 Abrindo trace viewer...$(RESET)"
	@cd .. && npx playwright show-trace

list-tests: ## Lista todos os testes disponíveis
	@echo "$(GREEN)📋 Testes disponíveis:$(RESET)"
	@echo ""
	@cd .. && npx playwright test --list

##@ 🧹 Limpeza

clean: ## Limpa resultados de testes anteriores
	@echo "$(YELLOW)🧹 Limpando resultados de testes...$(RESET)"
	@rm -rf ../test-results ../playwright-report ../*.zip
	@echo "$(GREEN)✅ Limpeza concluída!$(RESET)"

clean-all: ## Limpa tudo (incluindo node_modules)
	@echo "$(RED)🧹 Limpando TUDO (node_modules, cache, resultados)...$(RESET)"
	@rm -rf ../node_modules ../test-results ../playwright-report ../*.zip ../playwright/.cache
	@echo "$(GREEN)✅ Limpeza completa! Execute 'make setup' para reinstalar$(RESET)"

##@ 📚 Documentação

docs: ## Abre documentação no browser
	@echo "$(GREEN)📚 Abrindo documentação...$(RESET)"
	@open README.md || xdg-open README.md || echo "Veja: testing/README.md"

##@ ℹ️  Informações

info: ## Mostra informações do ambiente de testes
	@echo "$(GREEN)ℹ️  Informações do Ambiente de Testes$(RESET)"
	@echo ""
	@echo "$(YELLOW)Node.js:$(RESET)"
	@node --version 2>/dev/null || echo "$(RED)  ❌ Node.js não instalado$(RESET)"
	@echo ""
	@echo "$(YELLOW)NPM:$(RESET)"
	@npm --version 2>/dev/null || echo "$(RED)  ❌ NPM não instalado$(RESET)"
	@echo ""
	@echo "$(YELLOW)Playwright:$(RESET)"
	@cd .. && npx playwright --version 2>/dev/null || echo "$(RED)  ❌ Execute 'make setup' primeiro$(RESET)"
	@echo ""
	@echo "$(YELLOW)Browsers instalados:$(RESET)"
	@cd .. && npx playwright install --dry-run 2>/dev/null || echo "$(RED)  ❌ Execute 'make setup' primeiro$(RESET)"
	@echo ""
	@echo "$(YELLOW)Frontend rodando?$(RESET)"
	@curl -s http://localhost:3002 > /dev/null && echo "$(GREEN)  ✅ Sim (http://localhost:3002)$(RESET)" || echo "$(RED)  ❌ Não (execute 'cd .. && make frontend-start')$(RESET)"
	@echo ""

status: info ## Alias para 'info'

##@ 🎯 Fluxos Completos

all: test test-report ## Roda todos os testes e abre relatório

ci: ## Simula ambiente de CI/CD (sem interface)
	@echo "$(GREEN)🤖 Executando em modo CI...$(RESET)"
	@cd .. && CI=true npm test

quick: test-chrome ## Teste rápido (apenas Chrome)

full: ## Teste completo (todos browsers + mobile)
	@echo "$(GREEN)🚀 Executando suite completa de testes...$(RESET)"
	@make test
	@echo ""
	@make test-report

watch: test-ui ## Alias para test-ui (modo watch)

