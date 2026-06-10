#!/usr/bin/env python3
"""
🗡️ RITUAL 2: Forjar a Tabela Sagrada
Cria a tabela 'aurora-benefits' no DynamoDB Local
"""

import boto3
from botocore.exceptions import ClientError
import sys
import os

# Configuração do DynamoDB Local
ENDPOINT_URL = os.getenv("DYNAMODB_ENDPOINT", "http://localhost:17000")
REGION = "us-east-1"
TABLE_NAME = "aurora-benefits"

def get_dynamodb_client():
    """Retorna cliente DynamoDB configurado para ambiente local"""
    return boto3.client(
        'dynamodb',
        endpoint_url=ENDPOINT_URL,
        region_name=REGION,
        aws_access_key_id='fakeMyKeyId',
        aws_secret_access_key='fakeSecretAccessKey'
    )

def check_dynamodb_running(client):
    """Verifica se DynamoDB Local está rodando"""
    try:
        client.list_tables()
        return True
    except Exception as e:
        print(f"❌ Erro ao conectar no DynamoDB Local: {e}")
        print(f"   Verifique se está rodando em {ENDPOINT_URL}")
        print(f"   Execute: docker-compose up -d dynamodb-local")
        return False

def table_exists(client, table_name):
    """Verifica se a tabela já existe"""
    try:
        client.describe_table(TableName=table_name)
        return True
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceNotFoundException':
            return False
        raise

def create_table(client):
    """Cria a tabela aurora-benefits"""
    print(f"\n🔧 Criando tabela '{TABLE_NAME}'...")
    
    try:
        response = client.create_table(
            TableName=TABLE_NAME,
            KeySchema=[
                {'AttributeName': 'PK', 'KeyType': 'HASH'},   # Partition Key
                {'AttributeName': 'SK', 'KeyType': 'RANGE'}   # Sort Key
            ],
            AttributeDefinitions=[
                {'AttributeName': 'PK', 'AttributeType': 'S'},
                {'AttributeName': 'SK', 'AttributeType': 'S'}
            ],
            BillingMode='PAY_PER_REQUEST'
        )
        
        # Aguardar tabela ficar ativa
        waiter = client.get_waiter('table_exists')
        waiter.wait(TableName=TABLE_NAME)
        
        print(f"✅ Tabela '{TABLE_NAME}' criada com sucesso!")
        return True
        
    except ClientError as e:
        print(f"❌ Erro ao criar tabela: {e}")
        return False

def main():
    print("\n" + "="*50)
    print("🗡️ RITUAL 2: Forjar a Tabela Sagrada")
    print("="*50)
    
    client = get_dynamodb_client()
    
    # 1. Verificar conexão
    print("\n1️⃣  Verificando DynamoDB Local...")
    if not check_dynamodb_running(client):
        sys.exit(1)
    print("✅ DynamoDB Local está rodando")
    
    # 2. Verificar se tabela existe
    print("\n2️⃣  Verificando se tabela já existe...")
    if table_exists(client, TABLE_NAME):
        print(f"⚠️  Tabela '{TABLE_NAME}' já existe!")
        print("   Use --force para recriar ou continue com seed-data.py")
        
        if len(sys.argv) > 1 and sys.argv[1] == '--force':
            print(f"\n🗑️  Deletando tabela existente...")
            client.delete_table(TableName=TABLE_NAME)
            waiter = client.get_waiter('table_not_exists')
            waiter.wait(TableName=TABLE_NAME)
            print("✅ Tabela deletada")
        else:
            sys.exit(0)
    
    # 3. Criar tabela
    print("\n3️⃣  Criando tabela...")
    if not create_table(client):
        sys.exit(1)
    
    # 4. Mostrar detalhes
    print("\n" + "="*50)
    print("📋 Detalhes da Tabela")
    print("="*50)
    print(f"   Nome: {TABLE_NAME}")
    print(f"   Partition Key (PK): String")
    print(f"   Sort Key (SK): String")
    print(f"   Billing Mode: PAY_PER_REQUEST")
    print("\n✅ Tabela está ATIVA e pronta para uso!")
    print("\n💡 Próximo passo: python seed-data.py")

if __name__ == "__main__":
    main()

