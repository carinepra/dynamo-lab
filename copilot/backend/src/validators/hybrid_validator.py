"""
Hybrid Validator - Combina OpenAI (semântica) + DynamoDB (execução real)
"""
import os
from typing import Dict, Any, Optional
from .openai_validator import OpenAIValidator
from .dynamodb_executor import DynamoDBExecutor


class HybridValidator:
    """
    Validador híbrido que combina:
    1. OpenAI - Análise semântica do código
    2. DynamoDB - Execução real e métricas
    """
    
    def __init__(
        self,
        openai_api_key: Optional[str] = None,
        dynamodb_endpoint: Optional[str] = None,
        dynamodb_table: Optional[str] = None
    ):
        """Inicializa validadores"""
        endpoint = dynamodb_endpoint or os.getenv("DYNAMODB_ENDPOINT", "http://localhost:17000")
        table_name = dynamodb_table or os.getenv("TABLE_NAME", "aurora-benefits")
        self.openai_validator = OpenAIValidator(api_key=openai_api_key)
        self.dynamodb_executor = DynamoDBExecutor(
            endpoint_url=endpoint,
            table_name=table_name
        )
    
    def validate(
        self,
        code: str,
        language: str,
        question_context: str,
        expected_result: Any,
        max_execution_time_ms: float = 50.0
    ) -> Dict[str, Any]:
        """
        Validação híbrida completa
        
        Fluxo:
        1. Valida sintaxe básica
        2. Análise semântica (OpenAI) - em paralelo com execução
        3. Execução real (DynamoDB) - para Python apenas
        4. Combina resultados
        
        Args:
            code: Código submetido
            language: python, go ou javascript
            question_context: Descrição da questão
            expected_result: Resultado esperado
            max_execution_time_ms: Tempo máximo aceitável (para bonus)
        
        Returns:
            {
                "is_correct": bool,
                "feedback": str,
                "execution_time_ms": float,
                "items_scanned": int,
                "performance_bonus": int,
                "semantic_validation": dict,
                "execution_validation": dict
            }
        """
        
        # 1. Validação de sintaxe
        syntax_check = self.dynamodb_executor.validate_syntax(code, language)
        if not syntax_check["valid"]:
            return {
                "is_correct": False,
                "feedback": f"❌ Erro de sintaxe:\n" + "\n".join(syntax_check["errors"]),
                "execution_time_ms": 0,
                "items_scanned": 0,
                "performance_bonus": 0,
                "semantic_validation": None,
                "execution_validation": None
            }
        
        # 2. Análise semântica (OpenAI)
        semantic_result = self.openai_validator.validate_code(
            code=code,
            language=language,
            question_context=question_context,
            expected_result=expected_result
        )
        
        # 3. Execução real (se Python)
        execution_result = None
        if language == "python":
            execution_result = self.dynamodb_executor.execute_code(
                code=code,
                language=language,
                expected_result=expected_result
            )
        
        # 4. Combina resultados
        return self._combine_validations(
            semantic_result,
            execution_result,
            max_execution_time_ms
        )
    
    def _combine_validations(
        self,
        semantic: Dict[str, Any],
        execution: Optional[Dict[str, Any]],
        max_time_ms: float
    ) -> Dict[str, Any]:
        """Combina validação semântica + execução"""
        
        # Se não executou (Go/JS), depende apenas da semântica
        if execution is None or not execution.get("success"):
            return {
                "is_correct": semantic["is_valid"],
                "feedback": self._build_feedback(semantic, None),
                "execution_time_ms": 0,
                "items_scanned": 0,
                "performance_bonus": 0,
                "semantic_validation": semantic,
                "execution_validation": None
            }
        
        # Se executou com sucesso
        exec_time = execution.get("execution_time_ms", 0)
        items_scanned = execution.get("items_scanned", 0)
        
        # Verifica corretude
        is_correct = (
            semantic["is_valid"] and
            execution["success"] and
            execution["matches_expected"]
        )
        
        # Calcula bônus de performance
        performance_bonus = 0
        if is_correct and exec_time > 0:
            if exec_time <= max_time_ms * 0.5:  # 50% do tempo limite
                performance_bonus = 50  # Bônus máximo
            elif exec_time <= max_time_ms:
                performance_bonus = 25  # Bônus médio
        
        # Feedback combinado
        feedback = self._build_feedback(semantic, execution)
        
        return {
            "is_correct": is_correct,
            "feedback": feedback,
            "execution_time_ms": exec_time,
            "items_scanned": items_scanned,
            "performance_bonus": performance_bonus,
            "semantic_validation": semantic,
            "execution_validation": execution
        }
    
    def _build_feedback(
        self,
        semantic: Dict[str, Any],
        execution: Optional[Dict[str, Any]]
    ) -> str:
        """Constrói feedback educativo combinado"""
        
        feedback_parts = []
        
        # Feedback semântico (sempre presente)
        if semantic["is_valid"]:
            feedback_parts.append(f"✅ **Análise Semântica:** {semantic['feedback']}")
        else:
            feedback_parts.append(f"❌ **Análise Semântica:** {semantic['feedback']}")
        
        # Se há sugestões
        if semantic.get("suggestions"):
            feedback_parts.append(
                "\n💡 **Sugestões:**\n" +
                "\n".join(f"  • {s}" for s in semantic["suggestions"])
            )
        
        # Feedback de execução
        if execution and execution.get("success"):
            exec_time = execution.get("execution_time_ms", 0)
            items = execution.get("items_scanned", 0)
            
            feedback_parts.append(
                f"\n⚡ **Execução Real:**\n"
                f"  • Tempo: {exec_time:.2f}ms\n"
                f"  • Items Escaneados: {items}"
            )
            
            if execution.get("matches_expected"):
                feedback_parts.append("  • Resultado: ✅ Correto!")
            else:
                feedback_parts.append("  • Resultado: ❌ Não corresponde ao esperado")
        
        elif execution and execution.get("error"):
            feedback_parts.append(
                f"\n❌ **Erro de Execução:**\n{execution['error']}"
            )
        
        return "\n".join(feedback_parts)
    
    def get_hint(
        self,
        question_context: str,
        language: str,
        attempted_code: Optional[str] = None
    ) -> str:
        """Gera dica usando OpenAI"""
        return self.openai_validator.get_hint(
            question_context=question_context,
            language=language,
            attempted_code=attempted_code
        )

