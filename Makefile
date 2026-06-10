.PHONY: help setup start stop reset health-check backend-test-docker list-tables aws-cli \
        lab-setup lab-seed lab-query count-items scan-table \
        scan-employees scan-plans scan-certificates \
        lab2-query-1 lab2-query-2 lab2-query-3 lab2-query-4 lab2-query-5 \
        lab2-query-6 lab2-query-7 lab2-query-8 lab2-query-9

# Cores para output
GREEN  := \033[0;32m
YELLOW := \033[0;33m
RED    := \033[0;31m
CYAN   := \033[0;36m
RESET  := \033[0m

# Credenciais fake para DynamoDB Local (não requerem autenticação real)
export AWS_ACCESS_KEY_ID := fakeMyKeyId
export AWS_SECRET_ACCESS_KEY := fakeSecretAccessKey

# Labs disponíveis
LABS := lab1 lab2 lab3

##@ 📚 Ajuda

help: ## Mostra esta mensagem de ajuda
	@echo "$(GREEN)════════════════════════════════════════════════════════════════$(RESET)"
	@echo "$(GREEN)              🧪 DynamoDB Lab - Comandos                       $(RESET)"
	@echo "$(GREEN)════════════════════════════════════════════════════════════════$(RESET)"
	@echo ""
	@echo "$(CYAN)🚀 SETUP INICIAL$(RESET)"
	@echo "  $(YELLOW)make setup$(RESET)          Setup automático completo (primeira vez)"
	@echo "  $(YELLOW)make start$(RESET)          Ligar tudo (Docker + DynamoDB)"
	@echo "  $(YELLOW)make stop$(RESET)           Desligar tudo"
	@echo "  $(YELLOW)make reset$(RESET)          Recriar do zero"
	@echo ""
	@echo "$(CYAN)🎓 LABS (use LAB=lab1, LAB=lab2, etc)$(RESET)"
	@echo "  $(YELLOW)make lab-setup LAB=lab2$(RESET)    Criar tabela + seed do lab"
	@echo "  $(YELLOW)make lab-seed LAB=lab2$(RESET)     Apenas popular dados"
	@echo "  $(YELLOW)make lab-query LAB=lab2$(RESET)    Queries de exemplo do lab"
	@echo ""
	@echo "$(CYAN)🔧 UTILITÁRIOS$(RESET)"
	@echo "  $(YELLOW)make list-tables$(RESET)    Listar tabelas DynamoDB"
	@echo "  $(YELLOW)make count-items$(RESET)    Contar items na tabela"
	@echo "  $(YELLOW)make health-check$(RESET)   Verificar saúde do ambiente"
	@echo "  $(YELLOW)make backend-test-docker$(RESET) Validar backend dentro do Docker"
	@echo "  $(YELLOW)make aws-cli CMD=\"...\"$(RESET)  Executar comando AWS CLI"
	@echo ""
	@echo "$(CYAN)📋 EXEMPLO DE USO$(RESET)"
	@echo "  $(GREEN)# Primeiro uso:$(RESET)"
	@echo "  make setup"
	@echo ""
	@echo "  $(GREEN)# Preparar Lab 2:$(RESET)"
	@echo "  make start"
	@echo "  make lab-setup LAB=lab2"
	@echo "  make lab-query LAB=lab2"
	@echo ""

# ═══════════════════════════════════════════════════════════════════════════
##@ 🚀 Setup e Infraestrutura
# ═══════════════════════════════════════════════════════════════════════════

setup: ## Setup automático completo (instala tudo e sobe stack)
	@bash scripts/setup.sh

start: ## Ligar tudo (frontend + backend + DynamoDB)
	@echo "$(GREEN)🚀 Ligando tudo...$(RESET)"
	@if command -v colima >/dev/null 2>&1; then \
		if ! colima status >/dev/null 2>&1; then \
			echo "$(YELLOW)⏳ Iniciando Colima...$(RESET)"; \
			colima start --cpu 2 --memory 4 --disk 10; \
		fi; \
	fi
	@docker-compose up -d
	@echo "$(GREEN)✅ Tudo ligado!$(RESET)"
	@echo "   $(YELLOW)🌐 Frontend: http://localhost:17080$(RESET)"
	@echo "   $(YELLOW)🚀 Backend:  http://localhost:17091$(RESET)"
	@echo "   $(YELLOW)📖 API Docs: http://localhost:17091/docs$(RESET)"
	@echo "   $(YELLOW)🗄️  DynamoDB: http://localhost:17000$(RESET)"
	@echo ""
	@echo "$(CYAN)💡 Para comandos manuais no terminal, execute uma vez:$(RESET)"
	@echo "   export AWS_ACCESS_KEY_ID=fakeMyKeyId && export AWS_SECRET_ACCESS_KEY=fakeSecretAccessKey"
	@sleep 3

stop: ## Desligar tudo
	@echo "$(YELLOW)🛑 Desligando tudo...$(RESET)"
	@docker-compose down
	@if command -v colima >/dev/null 2>&1; then \
		colima stop || true; \
	fi
	@echo "$(GREEN)✅ Tudo desligado$(RESET)"

reset: ## Recriar do zero (limpa tudo e reinicia)
	@echo "$(RED)🧹 Limpando tudo e recriando...$(RESET)"
	@docker-compose down -v
	@if command -v colima >/dev/null 2>&1; then \
		colima stop || true; \
	fi
	@echo "$(GREEN)✅ Ambiente limpo!$(RESET)"
	@echo "$(YELLOW)💡 Execute 'make setup' para recriar tudo$(RESET)"

# ═══════════════════════════════════════════════════════════════════════════
##@ 🎓 Labs (use LAB=lab2 para scripts automatizados)
# ═══════════════════════════════════════════════════════════════════════════

# Validação do parâmetro LAB
define check_lab
	@if [ -z "$(LAB)" ]; then \
		echo "$(RED)❌ Erro: Especifique o lab$(RESET)"; \
		echo "$(YELLOW)Exemplo: make $(1) LAB=lab2$(RESET)"; \
		echo ""; \
		echo "Labs com scripts automatizados: lab2"; \
		exit 1; \
	fi
	@if [ ! -f "labs/$(LAB)/scripts/create-table.py" ] || [ ! -f "labs/$(LAB)/scripts/seed-data.py" ]; then \
		echo "$(RED)❌ Erro: $(LAB) não possui scripts automatizados compatíveis$(RESET)"; \
		echo "$(YELLOW)Use LAB=lab2 ou consulte o README específico do lab$(RESET)"; \
		exit 1; \
	fi
endef

lab-setup: ## Criar tabela + popular dados (LAB=lab2)
	$(call check_lab,lab-setup)
	@echo "$(GREEN)🎯 Preparando $(LAB)...$(RESET)"
	@echo ""
	@docker exec dynamodb-backend python /app/labs/$(LAB)/scripts/create-table.py || echo "$(YELLOW)⚠️  Tabela pode já existir$(RESET)"
	@docker exec dynamodb-backend python /app/labs/$(LAB)/scripts/seed-data.py
	@echo ""
	@echo "$(GREEN)✅ $(LAB) pronto!$(RESET)"

lab-seed: ## Apenas popular dados (LAB=lab2)
	$(call check_lab,lab-seed)
	@echo "$(GREEN)🌱 Populando dados do $(LAB)...$(RESET)"
	@docker exec dynamodb-backend python /app/labs/$(LAB)/scripts/seed-data.py

lab-query: ## Executar queries de exemplo (LAB=lab2)
	$(call check_lab,lab-query)
	@echo "$(GREEN)🎯 Queries de exemplo do $(LAB)$(RESET)"
	@echo ""
	@docker exec dynamodb-backend test -f /app/labs/$(LAB)/scripts/queries.py && \
		docker exec dynamodb-backend python /app/labs/$(LAB)/scripts/queries.py || \
		echo "$(YELLOW)Use: make lab2-query-1, make lab2-query-2, ... make lab2-query-9$(RESET)"

# ═══════════════════════════════════════════════════════════════════════════
##@ 🔧 Utilitários DynamoDB
# ═══════════════════════════════════════════════════════════════════════════

health-check: ## Verificar saúde do ambiente
	@echo "$(GREEN)🔎 Verificando ambiente...$(RESET)"
	@docker ps --format '{{.Names}}' | grep -q '^dynamodb-local$$' && echo "$(GREEN)✅ DynamoDB Local rodando$(RESET)" || (echo "$(RED)❌ DynamoDB Local não está rodando$(RESET)" && exit 1)
	@aws dynamodb list-tables --endpoint-url http://localhost:17000 --region us-east-1 --no-cli-pager > /dev/null && echo "$(GREEN)✅ DynamoDB responde na porta 17000$(RESET)" || (echo "$(RED)❌ DynamoDB não respondeu em http://localhost:17000$(RESET)" && exit 1)
	@curl -fsS http://localhost:17091/health > /dev/null 2>&1 && echo "$(GREEN)✅ Backend responde na porta 17091$(RESET)" || echo "$(YELLOW)⚠️  Backend não respondeu em http://localhost:17091$(RESET)"
	@curl -fsS http://localhost:17080/ > /dev/null 2>&1 && echo "$(GREEN)✅ Frontend responde na porta 17080$(RESET)" || echo "$(YELLOW)⚠️  Frontend não respondeu em http://localhost:17080$(RESET)"

backend-test-docker: ## Validar backend dentro do Docker
	@echo "$(GREEN)🧪 Validando backend no Docker...$(RESET)"
	@COMPOSE="docker-compose"; \
	if docker compose version >/dev/null 2>&1; then COMPOSE="docker compose"; \
	elif ! command -v docker-compose >/dev/null 2>&1; then echo "$(RED)❌ Docker Compose não encontrado$(RESET)"; exit 1; fi; \
	$$COMPOSE build backend && \
	$$COMPOSE run --rm --no-deps \
		-v ./copilot/backend/tests:/app/tests:ro \
		backend sh -c "python -m py_compile src/quiz/question_repository.py src/validators/hybrid_validator.py src/validators/dynamodb_executor.py src/api/quiz_routes.py src/models/schemas.py tests/test_question_repository.py tests/test_hybrid_validator.py && python -m pytest --tb=short"

list-tables: ## Listar todas as tabelas do DynamoDB
	@echo "$(GREEN)📋 Listando tabelas...$(RESET)"
	@aws dynamodb list-tables \
		--endpoint-url http://localhost:17000 \
		--region us-east-1 \
		--no-cli-pager

count-items: ## Contar items na tabela aurora-benefits
	@echo "$(GREEN)📊 Contando items...$(RESET)"
	@aws dynamodb scan \
		--table-name aurora-benefits \
		--endpoint-url http://localhost:17000 \
		--region us-east-1 \
		--select COUNT \
		--no-cli-pager

scan-table: ## 📋 Listar TODOS os items da tabela (scan completo)
	@echo "$(GREEN)📋 Listando todos os items da tabela 'aurora-benefits'...$(RESET)" >&2
	@aws dynamodb scan \
		--table-name aurora-benefits \
		--endpoint-url http://localhost:17000 \
		--region us-east-1 \
		--no-cli-pager

scan-employees: ## 👥 Ver estrutura dos EMPLOYEEs (JSON)
	@echo "$(GREEN)👥 Estrutura dos EMPLOYEEs na tabela...$(RESET)" >&2
	@aws dynamodb scan \
		--table-name aurora-benefits \
		--filter-expression "begins_with(PK, :prefix)" \
		--expression-attribute-values '{":prefix":{"S":"EMPLOYEE#"}}' \
		--endpoint-url http://localhost:17000 \
		--region us-east-1 \
		--no-cli-pager

scan-plans: ## 📋 Ver estrutura dos PLANs (JSON)
	@echo "$(GREEN)📋 Estrutura dos PLANs na tabela...$(RESET)" >&2
	@aws dynamodb scan \
		--table-name aurora-benefits \
		--filter-expression "begins_with(PK, :prefix)" \
		--expression-attribute-values '{":prefix":{"S":"PLAN#"}}' \
		--endpoint-url http://localhost:17000 \
		--region us-east-1 \
		--no-cli-pager

scan-certificates: ## 🎖️ Ver estrutura dos CERTIFICATEs (JSON)
	@echo "$(GREEN)🎖️ Estrutura dos CERTIFICATEs na tabela...$(RESET)" >&2
	@aws dynamodb scan \
		--table-name aurora-benefits \
		--filter-expression "begins_with(PK, :prefix)" \
		--expression-attribute-values '{":prefix":{"S":"CERTIFICATE#"}}' \
		--endpoint-url http://localhost:17000 \
		--region us-east-1 \
		--no-cli-pager

aws-cli: ## Executar comando AWS CLI (CMD="list-tables")
	@if [ -z "$(CMD)" ]; then \
		echo "$(RED)❌ Erro: Você precisa passar o comando$(RESET)"; \
		echo "$(YELLOW)Exemplo: make aws-cli CMD=\"list-tables\"$(RESET)"; \
		exit 1; \
	fi
	@aws dynamodb $(CMD) \
		--endpoint-url http://localhost:17000 \
		--region us-east-1 \
		--no-cli-pager

# ═══════════════════════════════════════════════════════════════════════════
##@ 🎯 Queries Prontas (Lab 2 - Access Patterns 1-9)
# ═══════════════════════════════════════════════════════════════════════════

lab2-query-1: ## 1️⃣ Dados do Employee (GetItem)
	@echo "$(GREEN)1️⃣ Dados do Employee (GetItem)$(RESET)"
	@echo "   PK: EMPLOYEE#650e8400-e29b-41d4-a716-446655440010"
	@echo "   SK: SUMMARY"
	@echo ""
	@aws dynamodb get-item \
		--table-name aurora-benefits \
		--key '{"PK":{"S":"EMPLOYEE#650e8400-e29b-41d4-a716-446655440010"},"SK":{"S":"SUMMARY"}}' \
		--endpoint-url http://localhost:17000 \
		--region us-east-1 \
		--no-cli-pager

lab2-query-2: ## 2️⃣ Certificado específico (GetItem)
	@echo "$(GREEN)2️⃣ Certificado específico (GetItem)$(RESET)"
	@echo "   PK: PLAN#880e8400-e29b-41d4-a716-446655440004"
	@echo "   SK: CERTIFICATE#aa0e8400-e29b-41d4-a716-446655440020"
	@echo ""
	@aws dynamodb get-item \
		--table-name aurora-benefits \
		--key '{"PK":{"S":"PLAN#880e8400-e29b-41d4-a716-446655440004"},"SK":{"S":"CERTIFICATE#aa0e8400-e29b-41d4-a716-446655440020"}}' \
		--endpoint-url http://localhost:17000 \
		--region us-east-1 \
		--no-cli-pager

lab2-query-3: ## 3️⃣ Planos do Employee (begins_with)
	@echo "$(GREEN)3️⃣ Planos do Employee (Query + begins_with)$(RESET)"
	@echo "   PK: EMPLOYEE#770e8400-e29b-41d4-a716-446655440002"
	@echo "   SK: begins_with(PLAN#)"
	@echo ""
	@aws dynamodb query \
		--table-name aurora-benefits \
		--key-condition-expression "PK = :pk AND begins_with(SK, :prefix)" \
		--expression-attribute-values '{":pk":{"S":"EMPLOYEE#770e8400-e29b-41d4-a716-446655440002"},":prefix":{"S":"PLAN#"}}' \
		--endpoint-url http://localhost:17000 \
		--region us-east-1 \
		--no-cli-pager

lab2-query-4: ## 4️⃣ Certificados do Plano (begins_with)
	@echo "$(GREEN)4️⃣ Certificados do Plano (Query + begins_with)$(RESET)"
	@echo "   PK: PLAN#880e8400-e29b-41d4-a716-446655440004"
	@echo "   SK: begins_with(CERTIFICATE#)"
	@echo ""
	@aws dynamodb query \
		--table-name aurora-benefits \
		--key-condition-expression "PK = :pk AND begins_with(SK, :prefix)" \
		--expression-attribute-values '{":pk":{"S":"PLAN#880e8400-e29b-41d4-a716-446655440004"},":prefix":{"S":"CERTIFICATE#"}}' \
		--endpoint-url http://localhost:17000 \
		--region us-east-1 \
		--no-cli-pager

lab2-query-5: ## 5️⃣ Dashboard Employee (todos os SKs)
	@echo "$(GREEN)5️⃣ Dashboard Employee (Query - todos os SKs)$(RESET)"
	@echo "   PK: EMPLOYEE#770e8400-e29b-41d4-a716-446655440002"
	@echo "   Retorna: SUMMARY + todos os PLANs"
	@echo ""
	@aws dynamodb query \
		--table-name aurora-benefits \
		--key-condition-expression "PK = :pk" \
		--expression-attribute-values '{":pk":{"S":"EMPLOYEE#770e8400-e29b-41d4-a716-446655440002"}}' \
		--endpoint-url http://localhost:17000 \
		--region us-east-1 \
		--no-cli-pager

lab2-query-6: ## 6️⃣ Detalhes do Plano (todos os SKs)
	@echo "$(GREEN)6️⃣ Detalhes do Plano (Query - todos os SKs)$(RESET)"
	@echo "   PK: PLAN#880e8400-e29b-41d4-a716-446655440004"
	@echo "   Retorna: SUMMARY + PROPOSAL + DOCUMENT + CERTIFICATEs"
	@echo ""
	@aws dynamodb query \
		--table-name aurora-benefits \
		--key-condition-expression "PK = :pk" \
		--expression-attribute-values '{":pk":{"S":"PLAN#880e8400-e29b-41d4-a716-446655440004"}}' \
		--endpoint-url http://localhost:17000 \
		--region us-east-1 \
		--no-cli-pager

lab2-query-7: ## 7️⃣ ⭐ Último Saldo (Query Reversa)
	@echo "$(GREEN)7️⃣ ⭐ Último Saldo (Query Reversa)$(RESET)"
	@echo "   PK: CERTIFICATE#aa0e8400-e29b-41d4-a716-446655440020"
	@echo "   SK: begins_with(BALANCE#)"
	@echo "   ScanIndexForward: false + Limit: 1"
	@echo ""
	@aws dynamodb query \
		--table-name aurora-benefits \
		--key-condition-expression "PK = :pk AND begins_with(SK, :prefix)" \
		--expression-attribute-values '{":pk":{"S":"CERTIFICATE#aa0e8400-e29b-41d4-a716-446655440020"},":prefix":{"S":"BALANCE#"}}' \
		--scan-index-forward false \
		--limit 1 \
		--endpoint-url http://localhost:17000 \
		--region us-east-1 \
		--no-cli-pager

lab2-query-8: ## 8️⃣ Saldos do mês (BETWEEN)
	@echo "$(GREEN)8️⃣ Saldos do mês (Query + BETWEEN)$(RESET)"
	@echo "   PK: CERTIFICATE#aa0e8400-e29b-41d4-a716-446655440020"
	@echo "   SK: BETWEEN BALANCE#2024-10-01 AND BALANCE#2024-10-31"
	@echo ""
	@aws dynamodb query \
		--table-name aurora-benefits \
		--key-condition-expression "PK = :pk AND SK BETWEEN :start AND :end" \
		--expression-attribute-values '{":pk":{"S":"CERTIFICATE#aa0e8400-e29b-41d4-a716-446655440020"},":start":{"S":"BALANCE#2024-10-01"},":end":{"S":"BALANCE#2024-10-31"}}' \
		--endpoint-url http://localhost:17000 \
		--region us-east-1 \
		--no-cli-pager

lab2-query-9: ## 9️⃣ Últimos N meses (>=)
	@echo "$(GREEN)9️⃣ Últimos N meses (Query + >=)$(RESET)"
	@echo "   PK: CERTIFICATE#aa0e8400-e29b-41d4-a716-446655440020"
	@echo "   SK: >= BALANCE#2024-09-01"
	@echo ""
	@aws dynamodb query \
		--table-name aurora-benefits \
		--key-condition-expression "PK = :pk AND SK >= :start" \
		--expression-attribute-values '{":pk":{"S":"CERTIFICATE#aa0e8400-e29b-41d4-a716-446655440020"},":start":{"S":"BALANCE#2024-09-01"}}' \
		--endpoint-url http://localhost:17000 \
		--region us-east-1 \
		--no-cli-pager

.DEFAULT_GOAL := help
