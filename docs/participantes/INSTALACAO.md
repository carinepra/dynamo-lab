# 🚀 Guia de Instalação - DynamoDB Lab

**Objetivo:** Configurar o ambiente para rodar DynamoDB Local usando Colima (alternativa ao Docker Desktop) no Mac.

**Tempo estimado:** 15-20 minutos

> **Windows:** este guia usa comandos bash/macOS. No Windows, execute via WSL ou Git Bash, ou use os comandos equivalentes do PowerShell quando indicado pelo instrutor.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

- ✅ **Mac** (qualquer versão recente do macOS)
- ✅ **Homebrew instalado** (gerenciador de pacotes do Mac)
- ✅ **Terminal** aberto (pode usar o Terminal padrão do Mac)

### Verificar se Homebrew está instalado

Abra o Terminal e digite:

```bash
brew --version
```

Se aparecer algo como `Homebrew 4.x.x`, está instalado! ✅

Se não estiver instalado, execute:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

---

## 🐳 Passo 1: Instalar Colima e Docker CLI

O **Colima** é um runtime Docker gratuito e leve para Mac (alternativa ao Docker Desktop).

### 1.1. Verificar se já estão instalados

Antes de instalar, verifique se já estão instalados:

```bash
colima version
docker --version
docker-compose --version
```

Se aparecer as versões instaladas, você já tem tudo! ✅ Pode pular para o **Passo 2**.

### 1.2. Instalar Colima

```bash
brew install colima
```

### 1.3. Instalar Docker CLI

```bash
brew install docker docker-compose
```

### 1.4. Verificar instalação

```bash
colima version
docker --version
docker-compose --version
```

Deve aparecer as versões instaladas. ✅

---

## ⚙️ Passo 2: Configurar o Projeto

### 2.1. Navegar até a pasta do projeto

```bash
cd dynamodb-lab
```

> 💡 **Nota:** Se você clonou o repo em outro local, ajuste o caminho conforme necessário.

Crie seu arquivo local de ambiente a partir do exemplo e preencha somente os valores necessários:

```bash
cp copilot/backend/env.example copilot/backend/.env
```

> Não commite arquivos `.env`. Eles são locais e podem conter segredos.

---

## 🚀 Passo 3: Iniciar o Ambiente

Agora vamos usar o **Makefile** para facilitar os comandos.

### 3.1. Ver todos os comandos disponíveis

```bash
make help
```

Isso mostra todos os comandos que você pode usar! 📚

### 3.2. Preparar dependências locais

```bash
make setup
```

⏱️ **Aguarde:** Pode demorar 1-2 minutos na primeira vez.

Você verá mensagens como:
- `INFO[0000] starting colima`
- `INFO[0030] done`

### 3.3. Subir o ambiente

```bash
make start
```

Isso vai:
1. Baixar a imagem do DynamoDB Local (primeira vez demora ~1 min)
2. Subir o container
3. Verificar se está funcionando

### 3.4. Verificar se está tudo OK

```bash
make health-check
```

Se tudo estiver funcionando, você verá:
```
✅ Colima está rodando
✅ Container está rodando
✅ DynamoDB Local respondendo corretamente
```

---

## ✅ Testando se está funcionando

Execute este comando para verificar a conexão:

```bash
AWS_ACCESS_KEY_ID=fakeMyKeyId AWS_SECRET_ACCESS_KEY=fakeSecretAccessKey aws dynamodb list-tables --endpoint-url http://localhost:17000 --region us-east-1 --no-cli-pager
```

Se aparecer `{"TableNames": []}`, está **funcionando perfeitamente**! ✅

> **💡 Por que o navegador não mostra nada?**
> 
> O DynamoDB Local não tem interface web. Ele só responde a chamadas de API através do AWS CLI ou SDKs (Python/Go).

### 🧪 Teste completo: criar tabela, inserir e consultar dados

```bash
# 1. Criar tabela
AWS_ACCESS_KEY_ID=fakeMyKeyId AWS_SECRET_ACCESS_KEY=fakeSecretAccessKey aws dynamodb create-table \
  --table-name TestTable \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:17000 \
  --region us-east-1 \
  --no-cli-pager

# 2. Inserir item
AWS_ACCESS_KEY_ID=fakeMyKeyId AWS_SECRET_ACCESS_KEY=fakeSecretAccessKey aws dynamodb put-item \
  --table-name TestTable \
  --item '{"PK":{"S":"USER#123"},"SK":{"S":"PROFILE"},"name":{"S":"Maria Silva"},"email":{"S":"maria@example.com"}}' \
  --endpoint-url http://localhost:17000 \
  --region us-east-1 \
  --no-cli-pager

# 3. Consultar item
AWS_ACCESS_KEY_ID=fakeMyKeyId AWS_SECRET_ACCESS_KEY=fakeSecretAccessKey aws dynamodb query \
  --table-name TestTable \
  --key-condition-expression "PK = :pk" \
  --expression-attribute-values '{":pk":{"S":"USER#123"}}' \
  --endpoint-url http://localhost:17000 \
  --region us-east-1 \
  --no-cli-pager

# 4. Deletar tabela de teste
AWS_ACCESS_KEY_ID=fakeMyKeyId AWS_SECRET_ACCESS_KEY=fakeSecretAccessKey aws dynamodb delete-table \
  --table-name TestTable \
  --endpoint-url http://localhost:17000 \
  --region us-east-1 \
  --no-cli-pager
```

---

## 🎉 Parabéns! Ambiente configurado!

Seu DynamoDB Local está rodando em: **http://localhost:17000**

---

## 🎯 Comandos AWS CLI para DynamoDB

### Formato completo (sempre use este para aprender!)

Para interagir com o DynamoDB Local, você precisa usar o **AWS CLI** com credenciais fake:

```bash
AWS_ACCESS_KEY_ID=fakeMyKeyId AWS_SECRET_ACCESS_KEY=fakeSecretAccessKey \
  aws dynamodb <comando> \
  --endpoint-url http://localhost:17000 \
  --region us-east-1
```

**Exemplo - Listar tabelas:**
```bash
AWS_ACCESS_KEY_ID=fakeMyKeyId AWS_SECRET_ACCESS_KEY=fakeSecretAccessKey \
  aws dynamodb list-tables \
  --endpoint-url http://localhost:17000 \
  --region us-east-1
```

### ⚡ Atalho do Makefile (apenas para economizar digitação)

Para não digitar as credenciais fake toda vez, você pode usar:

```bash
# Atalho para list-tables
make list-tables

# Atalho genérico (você ainda escreve o comando DynamoDB completo)
make aws-cli CMD="describe-table --table-name MinhaTabela"
make aws-cli CMD="scan --table-name MinhaTabela"
make aws-cli CMD="put-item --table-name Test --item '{\"id\":{\"S\":\"123\"}}'"
```

> **💡 Importante para o laboratório:**  
> Os atalhos do Makefile apenas adicionam as credenciais automaticamente.  
> Você ainda precisa conhecer e usar os **comandos reais do AWS DynamoDB CLI**.  
> Consulte sempre a [documentação oficial](https://docs.aws.amazon.com/cli/latest/reference/dynamodb/index.html).

### 📚 Exemplos práticos de comandos DynamoDB

**Listar tabelas:**
```bash
make aws-cli CMD="list-tables"
# Equivalente a: aws dynamodb list-tables --endpoint-url http://localhost:17000 --region us-east-1
```

**Criar tabela com PK e SK:**
```bash
make aws-cli CMD="create-table \
  --table-name MinhaTabela \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST"
```

**Inserir item:**
```bash
make aws-cli CMD="put-item \
  --table-name MinhaTabela \
  --item '{\"PK\":{\"S\":\"USER#123\"},\"SK\":{\"S\":\"PROFILE\"},\"name\":{\"S\":\"Maria\"}}'"
```

**Query (buscar por PK):**
```bash
make aws-cli CMD="query \
  --table-name MinhaTabela \
  --key-condition-expression \"PK = :pk\" \
  --expression-attribute-values '{\":pk\":{\"S\":\"USER#123\"}}'"
```

**Scan (varrer toda tabela):**
```bash
make aws-cli CMD="scan --table-name MinhaTabela"
```

**Descrever tabela:**
```bash
make aws-cli CMD="describe-table --table-name MinhaTabela"
```

**Deletar tabela:**
```bash
make aws-cli CMD="delete-table --table-name MinhaTabela"
```

> 💡 **Dica de estudo:** Execute esses comandos manualmente para entender a sintaxe!

---

### 🧪 Como usar o DynamoDB Local

Você pode interagir com o DynamoDB Local de 3 formas:

**1. AWS CLI (linha de comando):**
```bash
# Listar tabelas (use sempre as credenciais fake!)
AWS_ACCESS_KEY_ID=fakeMyKeyId AWS_SECRET_ACCESS_KEY=fakeSecretAccessKey \
  aws dynamodb list-tables \
  --endpoint-url http://localhost:17000 \
  --region us-east-1

# Criar tabela de exemplo
AWS_ACCESS_KEY_ID=fakeMyKeyId AWS_SECRET_ACCESS_KEY=fakeSecretAccessKey \
  aws dynamodb create-table \
  --table-name TestTable \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:17000 \
  --region us-east-1
```

**2. Python (boto3):**
```python
import boto3

dynamodb = boto3.resource('dynamodb',
    endpoint_url='http://localhost:17000',
    region_name='us-east-1',
    aws_access_key_id='fakeMyKeyId',
    aws_secret_access_key='fakeSecretAccessKey'
)

# Listar tabelas
for table in dynamodb.tables.all():
    print(table.name)
```

**3. Go (aws-sdk-go):**
```go
sess := session.Must(session.NewSession(&aws.Config{
    Region:   aws.String("us-east-1"),
    Endpoint: aws.String("http://localhost:17000"),
}))
svc := dynamodb.New(sess)
```

---

## 📖 Comandos Úteis do Dia a Dia

### Reiniciar quando algo der errado

```bash
make start             # Reinicia tudo (recomendado)
make reset      # Reinicia só o DynamoDB Local
```

### Ver logs do DynamoDB

```bash
docker logs dynamodb-local
```

Pressione `Ctrl+C` para sair.

### Parar o DynamoDB (mas deixar Colima rodando)

```bash
make stop
```

### Parar tudo (incluindo Colima)

```bash
make stop
```

### Iniciar tudo novamente

```bash
make start
```

### Ver status do ambiente

```bash
make health-check
```

### Limpar tudo (apaga dados!)

```bash
make reset
```

**⚠️ ATENÇÃO:** Isso apaga todas as tabelas e dados do DynamoDB Local!

---

## 🔧 Instalações Opcionais (para os labs)

### AWS CLI (para usar comandos direto no terminal)

```bash
brew install awscli
```

Verificar:
```bash
aws --version
```

### Python 3 e boto3 (se ainda não tiver)

Verificar se Python está instalado:
```bash
python3 --version
```

Instalar dependências Python:
```bash
cd examples/python
pip3 install -r requirements.txt
```

### Go (se ainda não tiver)

```bash
brew install go
```

Verificar:
```bash
go version
```

---

## 🆘 Problemas Comuns (Troubleshooting)

### ❌ Erro: "colima: command not found"

**Solução:** Homebrew não está no PATH. Após instalar, execute:

```bash
# Para zsh (shell padrão do Mac):
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

Feche e abra o Terminal novamente.

---

### ❌ Erro: "Cannot connect to the Docker daemon"

**Solução:** Colima não está rodando.

```bash
make setup
```

---

### ❌ Erro: "port 8000 is already in use"

**Solução:** Algum outro processo está usando a porta 8000.

Descobrir o que está usando:
```bash
lsof -i :17000
```

Parar o processo ou mudar a porta no `docker-compose.yml`.

---

### ❌ DynamoDB Local não responde

**Solução 1:** Aguarde alguns segundos após o `docker-up`. O container demora um pouco para inicializar.

```bash
# Aguardar 10 segundos e tentar novamente
sleep 10
make health-check
```

**Solução 2:** Reiniciar o DynamoDB:

```bash
make reset
```

---

### ❌ Colima está lento ou travando

**Solução 1:** Reiniciar Colima:
```bash
make colima-stop
make setup
```

**Solução 2:** Aumentar recursos do Colima (se seu Mac tiver mais memória):
```bash
colima stop
colima start --cpu 4 --memory 8 --disk 20
```

---

### ❌ Erro de permissão no diretório

**Solução:** Verificar permissões da pasta do projeto:
```bash
ls -la dynamodb-lab
```

Se necessário:
```bash
chmod u+w dynamodb-lab
```

---

### ❌ Erro: "error starting vm: error at 'starting': exit status 1"

**Sintoma:** Colima não inicia e mostra erro como:
```
FATA[0010] error starting vm: error at 'starting': exit status 1
```

**Causa:** Instância do Colima corrompida (pode acontecer após atualizações ou desligamentos inesperados).

**Solução:** Deletar e recriar a instância do Colima:

```bash
# 1. Deletar instância corrompida
colima delete

# 2. Iniciar nova instância
make setup
```

> ⚠️ **Atenção:** Isso vai apagar os dados do DynamoDB Local. Você precisará recriar suas tabelas.

**Alternativa (se quiser manter dados):**
```bash
# Tentar reparar sem deletar
colima stop
colima start --force
```

---

### ❌ Erro: "diffDisk: Shrinking is currently unavailable"

**Sintoma:** Colima não inicia e mostra erro como:
```
> Resize instance colima's disk from 100GiB to 10GiB
> diffDisk: Shrinking is currently unavailable
FATA[0002] error starting vm: error at 'starting': exit status 1
```

**Causa:** Existe uma instância do Colima com um disco maior (ex: 100GiB) e o Makefile está tentando iniciar com um disco menor (10GiB). O Colima não suporta reduzir o tamanho do disco.

**Solução:** Deletar a instância existente e recriar com o tamanho correto:

```bash
# 1. Parar Colima (se estiver rodando)
colima stop

# 2. Deletar instância existente
colima delete

# 3. Iniciar nova instância com o tamanho correto
make setup
```

> ⚠️ **Atenção:** Isso vai apagar os dados do DynamoDB Local. Você precisará recriar suas tabelas.

**Alternativa (se quiser manter o disco maior):**
Se você preferir manter o disco maior, pode iniciar manualmente:
```bash
colima stop
colima start --cpu 2 --memory 4 --disk 100
```

---

## 💡 Dicas Importantes

### 1. Colima continua rodando após fechar o Terminal
Se você fechar o Terminal, o Colima continua rodando em background (consome recursos). Para parar:
```bash
make colima-stop
```

### 2. DynamoDB Local não persiste dados por padrão
Os dados ficam salvos em um volume Docker. Se você executar `make reset`, **tudo será apagado**.

### 3. Usar AWS CLI com DynamoDB Local
Sempre use `--endpoint-url http://localhost:17000`:
```bash
aws dynamodb list-tables --endpoint-url http://localhost:17000 --region us-east-1
```

### 4. Credenciais fake são necessárias
O DynamoDB Local não valida credenciais, mas os SDKs exigem que elas existam. Use as do `.env`.

---

## 🆘 Precisa de Ajuda?

- **Ver configurações atuais:** `make health-check`
- **Verificar saúde do ambiente:** `make health-check`
- **Ver todos os comandos:** `make help`
- **Pergunte ao instrutor(a)** se tiver dúvidas específicas

---

**Criado para o Laboratório de DynamoDB - Aurora Labs**  
**Data:** Novembro 2025

