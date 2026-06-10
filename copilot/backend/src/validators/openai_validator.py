"""
OpenAI Validator - Validação semântica de código DynamoDB
"""
import os
from typing import Dict, Any, Optional
from openai import OpenAI


class OpenAIValidator:
    """Valida código DynamoDB usando OpenAI para análise semântica"""
    
    def __init__(self, api_key: Optional[str] = None):
        """Inicializa cliente OpenAI"""
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            # OPENAI_API_KEY é opcional - validação funcionará sem ela
            # mas apenas com comparação literal de strings
            self.client = None
            self.model = None
            return
        
        self.client = OpenAI(api_key=self.api_key)
        self.model = "gpt-4o-mini"  # Custo baixo + performance
    
    def validate_code(
        self,
        code: str,
        language: str,
        question_context: str,
        expected_result: Any
    ) -> Dict[str, Any]:
        """
        Valida código semanticamente usando OpenAI
        
        Args:
            code: Código submetido pelo usuário
            language: python, go ou javascript
            question_context: Descrição da questão
            expected_result: Resultado esperado
        
        Returns:
            {
                "is_valid": bool,
                "feedback": str,
                "confidence": float,
                "suggestions": List[str]
            }
        """
        # Se OpenAI não estiver configurada, retorna validação negativa
        if not self.client:
            return {
                "is_valid": False,
                "feedback": "Validação de código requer OpenAI API Key configurada",
                "confidence": 0.0,
                "suggestions": []
            }
        
        prompt = self._build_validation_prompt(
            code, language, question_context, expected_result
        )
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "Você é um especialista em DynamoDB e professor experiente. "
                            "Analise o código DynamoDB submetido e forneça feedback educativo. "
                            "Seja preciso, construtivo e didático. "
                            "Responda APENAS em formato JSON válido."
                        )
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,  # Mais determinístico
                max_tokens=800
            )
            
            content = response.choices[0].message.content
            
            # Parse da resposta JSON
            import json
            result = json.loads(content)
            
            return {
                "is_valid": result.get("is_valid", False),
                "feedback": result.get("feedback", "Análise inconclusiva"),
                "confidence": result.get("confidence", 0.5),
                "suggestions": result.get("suggestions", []),
                "reasoning": result.get("reasoning", "")
            }
            
        except Exception as e:
            return {
                "is_valid": False,
                "feedback": f"Erro na validação OpenAI: {str(e)}",
                "confidence": 0.0,
                "suggestions": [],
                "reasoning": ""
            }
    
    def _build_validation_prompt(
        self,
        code: str,
        language: str,
        question_context: str,
        expected_result: Any
    ) -> str:
        """Constrói prompt para OpenAI"""
        
        return f"""
# CONTEXTO DA QUESTÃO
{question_context}

# CÓDIGO SUBMETIDO ({language.upper()})
```{language}
{code}
```

# RESULTADO ESPERADO
{expected_result}

# SUA TAREFA
Analise o código e responda em JSON com esta estrutura:

{{
    "is_valid": true/false,
    "confidence": 0.0-1.0,
    "feedback": "Explicação clara e educativa sobre o código",
    "reasoning": "Por que está correto ou incorreto",
    "suggestions": ["lista", "de", "melhorias"]
}}

# CRITÉRIOS DE AVALIAÇÃO
1. **Corretude**: O código resolve o problema proposto?
2. **Sintaxe DynamoDB**: Usa corretamente PK, SK, GSI, Query, etc?
3. **Performance**: Usa Limit, ScanIndexForward, projeções adequadas?
4. **Best Practices**: Segue boas práticas da linguagem?

# IMPORTANTE
- Se o código está SINTATICAMENTE correto mas pode não funcionar: is_valid=false
- Se há múltiplas soluções válidas, aceite variações corretas
- Feedback deve ser educativo e construtivo
- Suggestions deve ter melhorias práticas

Responda APENAS o JSON, sem markdown ou texto extra.
"""

    def get_hint(
        self,
        question_context: str,
        language: str,
        attempted_code: Optional[str] = None
    ) -> str:
        """
        Gera dica educativa para a questão
        
        Args:
            question_context: Descrição da questão
            language: Linguagem escolhida
            attempted_code: Código tentado (opcional)
        
        Returns:
            str: Dica educativa
        """
        # Se OpenAI não estiver configurada, retorna mensagem genérica
        if not self.client:
            return "Revise os conceitos de DynamoDB e tente novamente. Verifique a documentação sobre Query, Scan, e uso de chaves."
        
        # Construir seção de código tentado
        code_section = ""
        if attempted_code:
            code_section = f"# CÓDIGO TENTADO\n```{language}\n{attempted_code}\n```\n\n"
        
        prompt = f"""
# QUESTÃO
{question_context}

# LINGUAGEM ESCOLHIDA
{language}

{code_section}# SUA TAREFA
Forneça uma dica educativa (não a resposta completa) que ajude o aluno a pensar na direção certa.

FORMATO: Apenas texto simples, 2-3 frases curtas e diretas.

EXEMPLO:
"Pense em como usar o Sort Key para ordenação. A flag ScanIndexForward=False inverte a ordem. Use Limit=1 para pegar apenas o último item."

Não dê a resposta pronta, mas direcione o raciocínio.
"""
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "Você é um professor experiente de DynamoDB. "
                            "Dê dicas educativas sem entregar a resposta completa."
                        )
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=200
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            return f"💡 Revise a documentação sobre Query patterns no DynamoDB Single-Table Design."

