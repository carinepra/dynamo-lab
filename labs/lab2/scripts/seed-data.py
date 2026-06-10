#!/usr/bin/env python3
"""
🎭 RITUAL 3: Chamar os Aventureiros (Zelda e Link)
Popula a tabela 'aurora-benefits' com 61 items de exemplo

Estrutura:
- Zelda: 19 items (1 plano, 2 certificados, 6 meses histórico)
- Link: 42 items (2 planos, 3 certificados, 12 meses histórico)
"""

import boto3
from decimal import Decimal
from datetime import datetime, timedelta
import sys
import os

# Configuração do DynamoDB Local
ENDPOINT_URL = os.getenv("DYNAMODB_ENDPOINT", "http://localhost:17000")
REGION = "us-east-1"
TABLE_NAME = "aurora-benefits"

# =============================================================================
# UUIDs dos Personagens (fixos para reprodutibilidade)
# =============================================================================

# ZELDA - Colaboradora Individual (simples)
ZELDA = {
    "user_uuid": "550e8400-e29b-41d4-a716-446655440000",
    "employee_uuid": "650e8400-e29b-41d4-a716-446655440010",
    "plan_uuid": "880e8400-e29b-41d4-a716-446655440003",
    "cert1_uuid": "bb0e8400-e29b-41d4-a716-446655440020",
    "cert2_uuid": "cc0e8400-e29b-41d4-a716-446655440021",
}

# LINK - Colaborador Tech Corp (complexo)
LINK = {
    "user_uuid": "660e8400-e29b-41d4-a716-446655440001",
    "employee_uuid": "770e8400-e29b-41d4-a716-446655440002",
    "plan1_uuid": "880e8400-e29b-41d4-a716-446655440004",  # PGBL
    "plan2_uuid": "881e8400-e29b-41d4-a716-446655440005",  # VGBL
    "cert1_uuid": "aa0e8400-e29b-41d4-a716-446655440020",  # Max Return RF
    "cert2_uuid": "ab0e8400-e29b-41d4-a716-446655440021",  # Multimercado
    "cert3_uuid": "ac0e8400-e29b-41d4-a716-446655440022",  # Renda Fixa Plus
}

# =============================================================================
# Funções auxiliares
# =============================================================================

def get_dynamodb_resource():
    """Retorna resource DynamoDB configurado para ambiente local"""
    return boto3.resource(
        'dynamodb',
        endpoint_url=ENDPOINT_URL,
        region_name=REGION,
        aws_access_key_id='fakeMyKeyId',
        aws_secret_access_key='fakeSecretAccessKey'
    )

def generate_balances(cert_uuid: str, start_date: str, months: int, initial_value: float, monthly_growth: float = 0.008):
    """
    Gera série temporal de saldos
    
    Args:
        cert_uuid: UUID do certificado
        start_date: Data inicial (YYYY-MM-DD)
        months: Número de meses
        initial_value: Valor inicial
        monthly_growth: Taxa de crescimento mensal (default 0.8%)
    
    Returns:
        Lista de items de balance
    """
    items = []
    current_value = initial_value
    start = datetime.strptime(start_date, "%Y-%m-%d")
    
    for i in range(months):
        date = start + timedelta(days=30 * i)
        date_str = date.strftime("%Y-%m-%d")
        
        items.append({
            "PK": f"CERTIFICATE#{cert_uuid}",
            "SK": f"BALANCE#{date_str}",
            "entity": "BALANCE",
            "reference_date": date_str,
            "quote_date": date_str,
            "value": Decimal(str(round(current_value, 2)))
        })
        
        current_value *= (1 + monthly_growth)
    
    return items

# =============================================================================
# Dados da Zelda (19 items)
# =============================================================================

def get_zelda_items():
    """Retorna todos os items da Zelda"""
    items = []
    
    # 1. USER_SUMMARY
    items.append({
        "PK": f"USER#{ZELDA['user_uuid']}",
        "SK": "SUMMARY",
        "entity": "USER_SUMMARY",
        "cpf": "12345678901",
        "email": "zelda@email.com",
        "password_hash": "$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "mfa_enabled": False,
        "status": "signed-in",
        "created_at": "2024-01-15T10:30:00Z"
    })
    
    # 2. EMPLOYEE_SUMMARY
    items.append({
        "PK": f"EMPLOYEE#{ZELDA['employee_uuid']}",
        "SK": "SUMMARY",
        "entity": "EMPLOYEE_SUMMARY",
        "user_uuid": ZELDA['user_uuid'],
        "name": "Zelda",
        "cpf": "12345678901",
        "email": "zelda@email.com",
        "status": "active",
        "salary": Decimal("5000.00"),
        "admission_date": "2024-01-15",
        "resignation_date": None,
        "contract_uuid": "contract-zelda-001",
        "contract_name": "Plano Individual",
        "company_uuid": None,
        "company_name": None,
        "created_at": "2024-01-15T10:30:00Z"
    })
    
    # 3. EMPLOYEE_PLAN (denormalizado)
    items.append({
        "PK": f"EMPLOYEE#{ZELDA['employee_uuid']}",
        "SK": f"PLAN#{ZELDA['plan_uuid']}",
        "entity": "EMPLOYEE_PLAN",
        "plan_type": "individual",
        "status": "active",
        "billing_status": "recurrent",
        "start_date": "2024-06-01",
        "total_balance": Decimal("3425.00")
    })
    
    # 4. PLAN_SUMMARY
    items.append({
        "PK": f"PLAN#{ZELDA['plan_uuid']}",
        "SK": "SUMMARY",
        "entity": "PLAN_SUMMARY",
        "employee_uuid": ZELDA['employee_uuid'],
        "plan_type": "individual",
        "status": "active",
        "billing_status": "recurrent",
        "tax_regime": "progressive",
        "pgbl_external_id": "IND-001234",
        "vgbl_external_id": None,
        "insurer_name": "Icatu Seguros",
        "contract_uuid": "contract-zelda-001",
        "contract_name": "Plano Individual",
        "company_uuid": None,
        "company_name": None,
        "company_cnpj": None,
        "start_date": "2024-06-01",
        "created_at": "2024-06-01T08:00:00Z"
    })
    
    # 5. PROPOSAL
    items.append({
        "PK": f"PLAN#{ZELDA['plan_uuid']}",
        "SK": "PROPOSAL",
        "entity": "PROPOSAL",
        "proposal_uuid": "prop-zelda-001",
        "external_id": "PROP-2024-ZELDA",
        "proposal_type": "individual",
        "status": "signed",
        "start_date": "2024-06-01",
        "insurer_name": "Icatu Seguros",
        "tax_deduction_type": "pgbl",
        "tax_regime": "progressive",
        "created_at": "2024-05-20T10:00:00Z",
        "signed_at": "2024-05-25T14:30:00Z"
    })
    
    # 6. PROPOSAL_DOCUMENT
    items.append({
        "PK": f"PLAN#{ZELDA['plan_uuid']}",
        "SK": "PROPOSAL#DOCUMENT",
        "entity": "PROPOSAL_DOCUMENT",
        "document_uuid": "doc-zelda-001",
        "file_name": "proposta-zelda-2024.pdf",
        "s3_bucket": "aurora-documents-lab",
        "s3_key": "proposals/2024/zelda-prop-001.pdf",
        "signature_type": "electronic",
        "signature_key": "clicksign-zelda123",
        "file_size_bytes": 2048576,
        "created_at": "2024-05-25T14:30:00Z"
    })
    
    # 7. PLAN_CERTIFICATE #1 - Max Return Conservador
    items.append({
        "PK": f"PLAN#{ZELDA['plan_uuid']}",
        "SK": f"CERTIFICATE#{ZELDA['cert1_uuid']}",
        "entity": "PLAN_CERTIFICATE",
        "certificate_uuid": ZELDA['cert1_uuid'],
        "status": "active",
        "external_coverage_id": "COV-ZELDA-001",
        "tax_deduction_type": "pgbl",
        "tax_regime": "progressive",
        "contribution_type": "basic-contribution",
        "contribution_value": Decimal("300.00"),
        "fund_name": "Max Return Conservador",
        "fund_slug": "max-return-conservador",
        "fund_cnpj": "11111111000101",
        "risk_profile": "conservative",
        "administration_fee": Decimal("0.015"),
        "annual_yield": Decimal("0.085")
    })
    
    # 8. PLAN_CERTIFICATE #2 - Multimercado Moderado
    items.append({
        "PK": f"PLAN#{ZELDA['plan_uuid']}",
        "SK": f"CERTIFICATE#{ZELDA['cert2_uuid']}",
        "entity": "PLAN_CERTIFICATE",
        "certificate_uuid": ZELDA['cert2_uuid'],
        "status": "active",
        "external_coverage_id": "COV-ZELDA-002",
        "tax_deduction_type": "pgbl",
        "tax_regime": "progressive",
        "contribution_type": "basic-contribution",
        "contribution_value": Decimal("200.00"),
        "fund_name": "Multimercado Moderado",
        "fund_slug": "multimercado-moderado",
        "fund_cnpj": "22222222000102",
        "risk_profile": "moderate",
        "administration_fee": Decimal("0.020"),
        "annual_yield": Decimal("0.105")
    })
    
    # 9-14. BALANCES para Certificado 1 (6 meses: Jun-Nov 2024)
    items.extend(generate_balances(
        ZELDA['cert1_uuid'], 
        "2024-06-15", 
        months=6, 
        initial_value=1800.00,
        monthly_growth=0.007
    ))
    
    # 15-19. BALANCES para Certificado 2 (6 meses: Jun-Nov 2024)
    # Nota: Ajustando para ter exatamente 19 items total (5 balances aqui)
    items.extend(generate_balances(
        ZELDA['cert2_uuid'], 
        "2024-06-15", 
        months=5, 
        initial_value=1200.00,
        monthly_growth=0.009
    ))
    
    return items

# =============================================================================
# Dados do Link (42 items)
# =============================================================================

def get_link_items():
    """Retorna todos os items do Link"""
    items = []
    
    # 1. USER_SUMMARY
    items.append({
        "PK": f"USER#{LINK['user_uuid']}",
        "SK": "SUMMARY",
        "entity": "USER_SUMMARY",
        "cpf": "98765432100",
        "email": "link@techcorp.com",
        "password_hash": "$2a$10$yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",
        "mfa_enabled": True,
        "status": "signed-in",
        "created_at": "2022-06-10T09:00:00Z"
    })
    
    # 2. EMPLOYEE_SUMMARY
    items.append({
        "PK": f"EMPLOYEE#{LINK['employee_uuid']}",
        "SK": "SUMMARY",
        "entity": "EMPLOYEE_SUMMARY",
        "user_uuid": LINK['user_uuid'],
        "name": "Link",
        "cpf": "98765432100",
        "email": "link@techcorp.com",
        "status": "active",
        "salary": Decimal("8000.00"),
        "admission_date": "2022-06-10",
        "resignation_date": None,
        "contract_uuid": "contract-techcorp-001",
        "contract_name": "Tech Corp",
        "company_uuid": "company-techcorp-001",
        "company_name": "Tech Corp",
        "created_at": "2022-06-10T09:00:00Z"
    })
    
    # 3. EMPLOYEE_PLAN #1 (PGBL)
    items.append({
        "PK": f"EMPLOYEE#{LINK['employee_uuid']}",
        "SK": f"PLAN#{LINK['plan1_uuid']}",
        "entity": "EMPLOYEE_PLAN",
        "plan_type": "corporate",
        "status": "active",
        "billing_status": "recurrent",
        "start_date": "2023-01-15",
        "total_balance": Decimal("45000.00")
    })
    
    # 4. EMPLOYEE_PLAN #2 (VGBL)
    items.append({
        "PK": f"EMPLOYEE#{LINK['employee_uuid']}",
        "SK": f"PLAN#{LINK['plan2_uuid']}",
        "entity": "EMPLOYEE_PLAN",
        "plan_type": "corporate",
        "status": "active",
        "billing_status": "recurrent",
        "start_date": "2023-06-01",
        "total_balance": Decimal("18490.00")
    })
    
    # =========================================================================
    # PLAN #1 - PGBL (Link)
    # =========================================================================
    
    # 5. PLAN_SUMMARY #1
    items.append({
        "PK": f"PLAN#{LINK['plan1_uuid']}",
        "SK": "SUMMARY",
        "entity": "PLAN_SUMMARY",
        "employee_uuid": LINK['employee_uuid'],
        "plan_type": "corporate",
        "status": "active",
        "billing_status": "recurrent",
        "tax_regime": "progressive",
        "pgbl_external_id": "CORP-8811288",
        "vgbl_external_id": None,
        "insurer_name": "Icatu Seguros",
        "contract_uuid": "contract-techcorp-001",
        "contract_name": "Tech Corp",
        "company_uuid": "company-techcorp-001",
        "company_name": "Tech Corp",
        "company_cnpj": "12345678000190",
        "start_date": "2023-01-15",
        "created_at": "2023-01-15T08:00:00Z"
    })
    
    # 6. PROPOSAL #1
    items.append({
        "PK": f"PLAN#{LINK['plan1_uuid']}",
        "SK": "PROPOSAL",
        "entity": "PROPOSAL",
        "proposal_uuid": "prop-link-001",
        "external_id": "PROP-2023-LINK-PGBL",
        "proposal_type": "corporate",
        "status": "signed",
        "start_date": "2023-01-15",
        "insurer_name": "Icatu Seguros",
        "tax_deduction_type": "pgbl",
        "tax_regime": "progressive",
        "created_at": "2023-01-10T10:00:00Z",
        "signed_at": "2023-01-14T16:00:00Z"
    })
    
    # 7. PROPOSAL_DOCUMENT #1
    items.append({
        "PK": f"PLAN#{LINK['plan1_uuid']}",
        "SK": "PROPOSAL#DOCUMENT",
        "entity": "PROPOSAL_DOCUMENT",
        "document_uuid": "doc-link-001",
        "file_name": "proposta-link-pgbl-2023.pdf",
        "s3_bucket": "aurora-documents-lab",
        "s3_key": "proposals/2023/link-pgbl-001.pdf",
        "signature_type": "electronic",
        "signature_key": "clicksign-link-pgbl",
        "file_size_bytes": 3125764,
        "created_at": "2023-01-14T16:00:00Z"
    })
    
    # 8. PLAN_CERTIFICATE #1 - Max Return Renda Fixa
    items.append({
        "PK": f"PLAN#{LINK['plan1_uuid']}",
        "SK": f"CERTIFICATE#{LINK['cert1_uuid']}",
        "entity": "PLAN_CERTIFICATE",
        "certificate_uuid": LINK['cert1_uuid'],
        "status": "active",
        "external_coverage_id": "COV-LINK-001",
        "tax_deduction_type": "pgbl",
        "tax_regime": "progressive",
        "contribution_type": "basic-contribution",
        "contribution_value": Decimal("800.00"),
        "fund_name": "Max Return Renda Fixa",
        "fund_slug": "max-return-rf",
        "fund_cnpj": "33333333000103",
        "risk_profile": "conservative",
        "administration_fee": Decimal("0.015"),
        "annual_yield": Decimal("0.095")
    })
    
    # 9. PLAN_CERTIFICATE #2 - Multimercado Arrojado
    items.append({
        "PK": f"PLAN#{LINK['plan1_uuid']}",
        "SK": f"CERTIFICATE#{LINK['cert2_uuid']}",
        "entity": "PLAN_CERTIFICATE",
        "certificate_uuid": LINK['cert2_uuid'],
        "status": "active",
        "external_coverage_id": "COV-LINK-002",
        "tax_deduction_type": "pgbl",
        "tax_regime": "progressive",
        "contribution_type": "basic-contribution",
        "contribution_value": Decimal("1200.00"),
        "fund_name": "Multimercado Arrojado",
        "fund_slug": "multimercado-arrojado",
        "fund_cnpj": "44444444000104",
        "risk_profile": "aggressive",
        "administration_fee": Decimal("0.025"),
        "annual_yield": Decimal("0.125")
    })
    
    # =========================================================================
    # PLAN #2 - VGBL (Link)
    # =========================================================================
    
    # 10. PLAN_SUMMARY #2
    items.append({
        "PK": f"PLAN#{LINK['plan2_uuid']}",
        "SK": "SUMMARY",
        "entity": "PLAN_SUMMARY",
        "employee_uuid": LINK['employee_uuid'],
        "plan_type": "corporate",
        "status": "active",
        "billing_status": "recurrent",
        "tax_regime": "regressive",
        "pgbl_external_id": None,
        "vgbl_external_id": "CORP-8811289",
        "insurer_name": "Icatu Seguros",
        "contract_uuid": "contract-techcorp-001",
        "contract_name": "Tech Corp",
        "company_uuid": "company-techcorp-001",
        "company_name": "Tech Corp",
        "company_cnpj": "12345678000190",
        "start_date": "2023-06-01",
        "created_at": "2023-06-01T08:00:00Z"
    })
    
    # 11. PROPOSAL #2
    items.append({
        "PK": f"PLAN#{LINK['plan2_uuid']}",
        "SK": "PROPOSAL",
        "entity": "PROPOSAL",
        "proposal_uuid": "prop-link-002",
        "external_id": "PROP-2023-LINK-VGBL",
        "proposal_type": "corporate",
        "status": "signed",
        "start_date": "2023-06-01",
        "insurer_name": "Icatu Seguros",
        "tax_deduction_type": "vgbl",
        "tax_regime": "regressive",
        "created_at": "2023-05-25T10:00:00Z",
        "signed_at": "2023-05-30T14:00:00Z"
    })
    
    # 12. PROPOSAL_DOCUMENT #2
    items.append({
        "PK": f"PLAN#{LINK['plan2_uuid']}",
        "SK": "PROPOSAL#DOCUMENT",
        "entity": "PROPOSAL_DOCUMENT",
        "document_uuid": "doc-link-002",
        "file_name": "proposta-link-vgbl-2023.pdf",
        "s3_bucket": "aurora-documents-lab",
        "s3_key": "proposals/2023/link-vgbl-002.pdf",
        "signature_type": "electronic",
        "signature_key": "clicksign-link-vgbl",
        "file_size_bytes": 2850000,
        "created_at": "2023-05-30T14:00:00Z"
    })
    
    # 13. PLAN_CERTIFICATE #3 - Renda Fixa Plus
    items.append({
        "PK": f"PLAN#{LINK['plan2_uuid']}",
        "SK": f"CERTIFICATE#{LINK['cert3_uuid']}",
        "entity": "PLAN_CERTIFICATE",
        "certificate_uuid": LINK['cert3_uuid'],
        "status": "active",
        "external_coverage_id": "COV-LINK-003",
        "tax_deduction_type": "vgbl",
        "tax_regime": "regressive",
        "contribution_type": "basic-contribution",
        "contribution_value": Decimal("500.00"),
        "fund_name": "Renda Fixa Plus",
        "fund_slug": "renda-fixa-plus",
        "fund_cnpj": "55555555000105",
        "risk_profile": "conservative",
        "administration_fee": Decimal("0.012"),
        "annual_yield": Decimal("0.088")
    })
    
    # =========================================================================
    # BALANCES - 12 meses cada certificado (Nov 2023 - Nov 2024)
    # =========================================================================
    
    # 14-25. Balances Certificado 1 (12 meses)
    items.extend(generate_balances(
        LINK['cert1_uuid'],
        "2023-12-15",
        months=12,
        initial_value=9600.00,
        monthly_growth=0.008
    ))
    
    # 26-37. Balances Certificado 2 (12 meses)
    items.extend(generate_balances(
        LINK['cert2_uuid'],
        "2023-12-15",
        months=12,
        initial_value=14400.00,
        monthly_growth=0.010
    ))
    
    # 38-49. Balances Certificado 3 (12 meses) - ajustando para caber nos 42 items
    # Link tem 13 items base + 12 + 12 + 5 = 42 items
    items.extend(generate_balances(
        LINK['cert3_uuid'],
        "2023-12-15",
        months=5,
        initial_value=6000.00,
        monthly_growth=0.007
    ))
    
    return items

# =============================================================================
# Função principal de seed
# =============================================================================

def seed_data():
    """Popula a tabela com todos os dados de Zelda e Link"""
    
    dynamodb = get_dynamodb_resource()
    table = dynamodb.Table(TABLE_NAME)
    
    # Verificar se tabela existe
    try:
        table.table_status
    except Exception as e:
        print(f"❌ Tabela '{TABLE_NAME}' não encontrada!")
        print(f"   Execute primeiro: python create-table.py")
        return False
    
    print(f"\n🌱 Populando tabela '{TABLE_NAME}'...")
    
    # Coletar todos os items
    zelda_items = get_zelda_items()
    link_items = get_link_items()
    
    all_items = zelda_items + link_items
    
    # Inserir em batch
    with table.batch_writer() as batch:
        for item in all_items:
            batch.put_item(Item=item)
    
    return len(zelda_items), len(link_items), len(all_items)

def main():
    print("\n" + "="*60)
    print("🎭 RITUAL 3: Chamar os Aventureiros")
    print("="*60)
    
    print("\n1️⃣  Verificando tabela...")
    
    try:
        zelda_count, link_count, total = seed_data()
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        sys.exit(1)
    
    print(f"\n✅ Dados inseridos com sucesso!")
    
    print("\n" + "="*60)
    print("📊 Resumo do Seed")
    print("="*60)
    print(f"\n👩 ZELDA (Colaboradora Individual):")
    print(f"   • Items: {zelda_count}")
    print(f"   • Plano: 1 (Individual)")
    print(f"   • Certificados: 2 fundos")
    print(f"   • Histórico: 6 meses")
    
    print(f"\n👨 LINK (Tech Corp - Corporativo):")
    print(f"   • Items: {link_count}")
    print(f"   • Planos: 2 (PGBL + VGBL)")
    print(f"   • Certificados: 3 fundos")
    print(f"   • Histórico: 12 meses")
    
    print(f"\n🗺️  TOTAL: {total} items prontos para exploração!")
    
    print("\n" + "="*60)
    print("🎯 UUIDs para Queries")
    print("="*60)
    print(f"\n👩 ZELDA:")
    print(f"   EMPLOYEE: {ZELDA['employee_uuid']}")
    print(f"   PLAN:     {ZELDA['plan_uuid']}")
    print(f"   CERT 1:   {ZELDA['cert1_uuid']}")
    print(f"   CERT 2:   {ZELDA['cert2_uuid']}")
    
    print(f"\n👨 LINK:")
    print(f"   EMPLOYEE: {LINK['employee_uuid']}")
    print(f"   PLAN 1:   {LINK['plan1_uuid']} (PGBL)")
    print(f"   PLAN 2:   {LINK['plan2_uuid']} (VGBL)")
    print(f"   CERT 1:   {LINK['cert1_uuid']}")
    print(f"   CERT 2:   {LINK['cert2_uuid']}")
    print(f"   CERT 3:   {LINK['cert3_uuid']}")
    
    print("\n✅ Seed completo! Use 'make lab2-query-1' até 'make lab2-query-9' para testar.")

if __name__ == "__main__":
    main()

