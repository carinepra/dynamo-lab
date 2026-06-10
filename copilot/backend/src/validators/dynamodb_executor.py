"""
DynamoDB Executor - Executa código real no DynamoDB Local
"""
import boto3
import os
import time
import re
from typing import Dict, Any, Optional
from botocore.exceptions import ClientError


class DynamoDBExecutor:
    """Executa queries DynamoDB e mede performance"""
    
    def __init__(
        self,
        endpoint_url: Optional[str] = None,
        region: Optional[str] = None,
        table_name: Optional[str] = None,
        code_execution_enabled: Optional[bool] = None
    ):
        """Inicializa cliente DynamoDB Local"""
        self.table_name = table_name or os.getenv("TABLE_NAME", "aurora-benefits")
        self.endpoint_url = endpoint_url or os.getenv("DYNAMODB_ENDPOINT", "http://localhost:17000")
        self.region = region or os.getenv("AWS_REGION", "us-east-1")
        self.code_execution_enabled = (
            code_execution_enabled
            if code_execution_enabled is not None
            else os.getenv("DYNAMODB_EXECUTION_ENABLED", "false").lower() == "true"
        )
        self._dynamodb = None
        self._table = None
    
    @property
    def dynamodb(self):
        """Lazy initialization do boto3 resource"""
        if self._dynamodb is None:
            self._dynamodb = boto3.resource(
                'dynamodb',
                endpoint_url=self.endpoint_url,
                region_name=self.region,
                aws_access_key_id='fakeKeyId',
                aws_secret_access_key='fakeSecretKey'
            )
        return self._dynamodb
    
    @property
    def table(self):
        """Lazy initialization da table"""
        if self._table is None:
            self._table = self.dynamodb.Table(self.table_name)
        return self._table
    
    def close(self):
        """Fecha conexões e limpa recursos"""
        if self._dynamodb is not None:
            # Fechar conexões HTTP subjacentes
            if hasattr(self._dynamodb.meta.client, '_client_config'):
                try:
                    self._dynamodb.meta.client._endpoint._pool.clear()
                except:
                    pass
            self._dynamodb = None
            self._table = None
    
    def __enter__(self):
        """Context manager support"""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Cleanup on exit"""
        self.close()
        return False
    
    def __del__(self):
        """Cleanup on deletion"""
        self.close()
    
    def execute_code(
        self,
        code: str,
        language: str,
        expected_result: Any
    ) -> Dict[str, Any]:
        """
        Executa código DynamoDB e retorna resultado + métricas
        
        Args:
            code: Código submetido (Python/Go/JS)
            language: python, go ou javascript
            expected_result: Resultado esperado para comparação
        
        Returns:
            {
                "success": bool,
                "result": Any,
                "execution_time_ms": float,
                "items_scanned": int,
                "consumed_capacity": float,
                "matches_expected": bool,
                "error": Optional[str]
            }
        """
        
        if not self.code_execution_enabled:
            return {
                "success": False,
                "result": None,
                "execution_time_ms": 0,
                "items_scanned": 0,
                "consumed_capacity": 0,
                "matches_expected": False,
                "error": (
                    "Execução de código desabilitada por segurança. "
                    "Configure DYNAMODB_EXECUTION_ENABLED=true apenas em ambiente local controlado."
                )
            }
        
        if language != "python":
            # Para Go e JS, precisaríamos converter para Python
            # ou executar em runtime separado
            return self._execute_non_python(code, language, expected_result)
        
        return self._execute_python_code(code, expected_result)
    
    def _execute_python_code(
        self,
        code: str,
        expected_result: Any
    ) -> Dict[str, Any]:
        """Executa código Python boto3"""
        
        try:
            # Preparar ambiente de execução
            exec_globals = {
                "boto3": boto3,
                "table": self.table,
                "dynamodb": self.dynamodb,
            }
            exec_locals = {}
            
            # Medir tempo
            start_time = time.time()
            
            # Executar código
            exec(code, exec_globals, exec_locals)
            
            execution_time_ms = (time.time() - start_time) * 1000
            
            # Tentar extrair resultado
            # Comum: response = table.query(...) ou result = ...
            result = None
            items_scanned = 0
            consumed_capacity = 0.0
            
            # Procurar por 'response' ou 'result' no namespace
            if 'response' in exec_locals:
                response = exec_locals['response']
                result = response.get('Items', [])
                items_scanned = response.get('ScannedCount', len(result))
                consumed_capacity = response.get('ConsumedCapacity', {}).get('CapacityUnits', 0)
            
            elif 'result' in exec_locals:
                result = exec_locals['result']
                if isinstance(result, dict) and 'Items' in result:
                    items_scanned = result.get('ScannedCount', len(result['Items']))
                    result = result['Items']
            
            # Verificar se resultado bate com esperado
            matches_expected = self._compare_results(result, expected_result)
            
            return {
                "success": True,
                "result": result,
                "execution_time_ms": round(execution_time_ms, 2),
                "items_scanned": items_scanned,
                "consumed_capacity": consumed_capacity,
                "matches_expected": matches_expected,
                "error": None
            }
            
        except ClientError as e:
            return {
                "success": False,
                "result": None,
                "execution_time_ms": 0,
                "items_scanned": 0,
                "consumed_capacity": 0,
                "matches_expected": False,
                "error": f"DynamoDB Error: {e.response['Error']['Message']}"
            }
        
        except Exception as e:
            return {
                "success": False,
                "result": None,
                "execution_time_ms": 0,
                "items_scanned": 0,
                "consumed_capacity": 0,
                "matches_expected": False,
                "error": f"Execution Error: {str(e)}"
            }
    
    def _execute_non_python(
        self,
        code: str,
        language: str,
        expected_result: Any
    ) -> Dict[str, Any]:
        """
        Simula execução de Go/JavaScript convertendo para Python
        
        Estratégia simplificada:
        1. Extrai parâmetros (TableName, Key, etc)
        2. Executa query equivalente em Python
        3. Retorna resultado
        
        Nota: Implementação completa requereria parsers específicos
        """
        
        # Por ora, retorna execução simulada
        # TODO: Implementar conversão Go -> boto3 e JS -> boto3
        
        return {
            "success": False,
            "result": None,
            "execution_time_ms": 0,
            "items_scanned": 0,
            "consumed_capacity": 0,
            "matches_expected": False,
            "error": f"Execução de {language} ainda não implementada. Use Python para execução real."
        }
    
    def _compare_results(
        self,
        actual: Any,
        expected: Any
    ) -> bool:
        """Compara resultado obtido com esperado"""
        
        if actual is None:
            return False
        
        # Se expected é dict com chave específica
        if isinstance(expected, dict) and "expected_value" in expected:
            expected_value = expected["expected_value"]
            
            # Procurar valor em items retornados
            if isinstance(actual, list) and len(actual) > 0:
                # Exemplo: esperado 2000.00, verificar se está em algum item
                for item in actual:
                    if isinstance(item, dict):
                        for value in item.values():
                            if str(value) == str(expected_value):
                                return True
            
            return False
        
        # Comparação direta
        return str(actual) == str(expected)
    
    def validate_syntax(self, code: str, language: str) -> Dict[str, Any]:
        """
        Valida sintaxe básica do código sem executar
        
        Returns:
            {"valid": bool, "errors": List[str]}
        """
        errors = []
        
        if language == "python":
            try:
                compile(code, '<string>', 'exec')
            except SyntaxError as e:
                errors.append(f"Linha {e.lineno}: {e.msg}")
        
        # Para Go/JS, checagens básicas
        elif language == "go":
            required = ["dynamodb", "Query", "KeyConditionExpression"]
            for req in required:
                if req not in code:
                    errors.append(f"Código Go deve conter: {req}")
        
        elif language == "javascript":
            required = ["DynamoDB", "query", "KeyConditionExpression"]
            for req in required:
                if req not in code:
                    errors.append(f"Código JS deve conter: {req}")
        
        return {
            "valid": len(errors) == 0,
            "errors": errors
        }

