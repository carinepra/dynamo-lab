"""
Question Repository - Carrega e gerencia perguntas do quiz
"""
import json
import os
from pathlib import Path
from typing import List, Optional, Dict, Any
from src.models.schemas import QuestionDefinition, QuestionType, Difficulty


class QuestionRepository:
    """
    Gerencia perguntas do quiz
    
    Carrega questões de validation-schema.json (lab1, lab2 e lab3)
    """
    
    def __init__(
        self,
        labs_to_load: List[str] = ["lab1", "lab2", "lab3"],
        quiz_mode: Optional[str] = None
    ):
        """
        Inicializa repositório
        
        Args:
            labs_to_load: Lista de labs a carregar (default: ["lab1", "lab2", "lab3"])
        """
        self.labs_to_load = labs_to_load
        self.quiz_mode = (quiz_mode or os.getenv("QUIZ_MODE", "closed")).lower()
        self.questions: List[QuestionDefinition] = []
        self.questions_by_lab: Dict[str, List[QuestionDefinition]] = {}
        self._load_questions()
    
    def _load_questions(self):
        """Carrega questões dos validation-schema.json de cada lab"""
        
        # Docker usa /app/lab1; no Windows local o layout é copilot/lab1.
        backend_base_path = Path(__file__).parent.parent.parent
        repo_base_path = backend_base_path.parent
        base_path = backend_base_path
        if not any((base_path / lab / "validation-schema.json").exists() for lab in self.labs_to_load):
            base_path = repo_base_path
        
        for lab in self.labs_to_load:
            schema_path = base_path / lab / "validation-schema.json"
            
            if not schema_path.exists():
                print(f"⚠️  Schema não encontrado para {lab}: {schema_path}")
                continue
            
            try:
                with open(schema_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                lab_questions = self._parse_validation_schema(data, lab)
                self.questions.extend(lab_questions)
                self.questions_by_lab[lab] = lab_questions
                
                print(f"✅ Carregadas {len(lab_questions)} questões do {lab}")
                
            except Exception as e:
                print(f"❌ Erro ao carregar {lab}: {e}")
        
        if not self.questions:
            print("⚠️  Nenhuma questão carregada! Verifique os arquivos de validação.")
    
    def _parse_validation_schema(
        self,
        schema: Dict[str, Any],
        lab: str
    ) -> List[QuestionDefinition]:
        """
        Converte validation-schema.json em QuestionDefinition
        
        Args:
            schema: Dados do JSON
            lab: Nome do lab (lab1, lab2, lab3)
        
        Returns:
            Lista de QuestionDefinition
        """
        questions = []
        challenges = schema.get("challenges", {})
        
        for challenge_id, challenge_data in challenges.items():
            try:
                # Mapear tipo
                type_str = challenge_data.get("type", "multiple_choice")
                question_type = self._map_question_type(type_str)
                
                # Mapear dificuldade
                difficulty_str = challenge_data.get("difficulty", "⭐ Iniciante")
                difficulty = self._map_difficulty(difficulty_str)
                
                # ID único: challenge_id + lab
                unique_id = f"{challenge_id}_{lab}"
                
                # Criar QuestionDefinition
                question = QuestionDefinition(
                    id=unique_id,
                    chapter=challenge_data.get("chapter", "geral"),
                    title=challenge_data.get("title", challenge_id),
                    description=challenge_data.get("question", ""),
                    question_type=question_type,
                    difficulty=difficulty,
                    max_xp=challenge_data.get("xp", 100),
                    timer_seconds=challenge_data.get("timer_seconds", 120),
                    
                    # Campos específicos por tipo
                    options=self._convert_options(challenge_data.get("options")),
                    correct_answer=self._get_correct_answer(challenge_data),
                    
                    expected_pk=challenge_data.get("gabarito_full", {}).get("PK"),
                    expected_sk=challenge_data.get("gabarito_full", {}).get("SK"),
                    
                    code_template=challenge_data.get("code_template"),
                    expected_result=challenge_data.get("expected_result"),
                    validation_prompt=challenge_data.get("validation_prompt", ""),
                    
                    hint=self._get_hint(challenge_data),
                    explanation=challenge_data.get("explanation", ""),
                    
                    learning_objectives=challenge_data.get("learning_objectives", []),
                    tags=challenge_data.get("tags", []),
                    translations=challenge_data.get("translations", {})
                )
                
                if self._should_include_question(question):
                    questions.append(question)
                
            except Exception as e:
                print(f"⚠️  Erro ao parsear {challenge_id}: {e}")
                continue
        
        return questions
    
    def _should_include_question(self, question: QuestionDefinition) -> bool:
        """Filtra questões incompatíveis com o modo de quiz configurado."""
        quiz_mode = getattr(self, "quiz_mode", "closed")
        if quiz_mode == "closed":
            if question.question_type != QuestionType.MULTIPLE_CHOICE:
                return False
            if not question.correct_answer:
                return False
        
        return True
    
    def _map_question_type(self, type_str: str) -> QuestionType:
        """Mapeia string de tipo para enum"""
        mapping = {
            "multiple_choice": QuestionType.MULTIPLE_CHOICE,
            "open_answer": QuestionType.OPEN_ANSWER,
            "code": QuestionType.CODE,
            "query_execution": QuestionType.CODE  # Query execution usa validação híbrida (OpenAI + DynamoDB)
        }
        return mapping.get(type_str, QuestionType.MULTIPLE_CHOICE)
    
    def _map_difficulty(self, difficulty_str: str) -> Difficulty:
        """Mapeia string de dificuldade para enum"""
        if "Iniciante" in difficulty_str or "⭐" == difficulty_str:
            return Difficulty.EASY
        elif "Intermediário" in difficulty_str or "⭐⭐" in difficulty_str:
            return Difficulty.MEDIUM
        elif "Avançado" in difficulty_str or "⭐⭐⭐" in difficulty_str:
            return Difficulty.HARD
        elif "Expert" in difficulty_str or "⭐⭐⭐⭐" in difficulty_str:
            return Difficulty.EXPERT
        elif "BOSS" in difficulty_str or "⭐⭐⭐⭐⭐" in difficulty_str:
            return Difficulty.BOSS
        else:
            return Difficulty.MEDIUM
    
    def _get_correct_answer(self, challenge_data: Dict[str, Any]) -> Optional[str]:
        """Extrai resposta correta (para múltipla escolha)"""
        
        # Pode ser "A", "B", "C", "D" ou índice
        correct = challenge_data.get("correct_answer")
        if correct:
            return str(correct)
        
        # Ou pode ter correct_index
        index = challenge_data.get("correct_index")
        if index is not None:
            letters = ["A", "B", "C", "D", "E", "F"]
            if 0 <= index < len(letters):
                return letters[index]
        
        return None
    
    def _convert_options(self, options_data: Any) -> Optional[List[str]]:
        """
        Converte options de dict ou list para list
        
        Schemas Lab1 usam: {"A": "...", "B": "...", "C": "...", "D": "..."}
        Schemas Lab0 usam: ["...", "...", "...", "..."]
        """
        if options_data is None:
            return None
        
        # Se já é lista, retorna direto
        if isinstance(options_data, list):
            return options_data
        
        # Se é dict, converte para lista ordenada
        if isinstance(options_data, dict):
            # Ordena por chave (A, B, C, D)
            sorted_keys = sorted(options_data.keys())
            return [options_data[key] for key in sorted_keys]
        
        return None
    
    def _get_hint(self, challenge_data: Dict[str, Any]) -> str:
        """Extrai hint (pode ser string ou lista)"""
        hints = challenge_data.get("hints", challenge_data.get("hint", ""))
        
        if isinstance(hints, list):
            # Duas quebras de linha entre cada hint para melhor legibilidade
            return "\n\n".join(f"💡 {h}" for h in hints)
        else:
            return str(hints)
    
    def _format_hint(self, hints: Any) -> str:
        """Formata dica traduzida usando o mesmo formato da dica base."""
        if isinstance(hints, list):
            return "\n\n".join(f"💡 {h}" for h in hints)
        return str(hints)
    
    def localize_question(
        self,
        question: Optional[QuestionDefinition],
        content_language: str = "en"
    ) -> Optional[QuestionDefinition]:
        """Retorna cópia localizada da pergunta sem alterar o objeto em memória."""
        if question is None or content_language != "en":
            return question
        
        translation = (question.translations or {}).get("en", {})
        if not translation:
            return question
        
        updates: Dict[str, Any] = {}
        if translation.get("title"):
            updates["title"] = translation["title"]
        if translation.get("question"):
            updates["description"] = translation["question"]
        if translation.get("options"):
            options = translation["options"]
            if isinstance(options, list) and question.options and len(options) == len(question.options):
                updates["options"] = options
        if translation.get("explanation"):
            updates["explanation"] = translation["explanation"]
        if translation.get("hints") is not None:
            updates["hint"] = self._format_hint(translation["hints"])
        
        return question.model_copy(update=updates)
    
    # ============================================
    # API PÚBLICA
    # ============================================
    
    def get_all_questions(self) -> List[QuestionDefinition]:
        """Retorna todas as questões (todos os labs)"""
        return self.questions
    
    def get_questions_by_lab(self, lab: str) -> List[QuestionDefinition]:
        """Retorna questões de um lab específico"""
        return self.questions_by_lab.get(lab, [])
    
    def get_question_by_id(self, question_id: str) -> Optional[QuestionDefinition]:
        """Busca questão por ID único (ex: Q1_lab1, Q2_lab2)"""
        for q in self.questions:
            if q.id == question_id:
                return q
        return None
    
    def get_question_by_index(self, index: int) -> Optional[QuestionDefinition]:
        """Busca questão por índice (0-based) na lista completa"""
        if 0 <= index < len(self.questions):
            return self.questions[index]
        return None
    
    def get_total_xp(self) -> int:
        """Calcula XP máximo possível (todas questões)"""
        return sum(q.max_xp for q in self.questions)
    
    def get_questions_count(self) -> int:
        """Retorna número total de questões"""
        return len(self.questions)
    
    def get_lab_stats(self, lab: str) -> Dict[str, Any]:
        """Retorna estatísticas de um lab"""
        lab_questions = self.get_questions_by_lab(lab)
        
        return {
            "lab": lab,
            "total_questions": len(lab_questions),
            "total_xp": sum(q.max_xp for q in lab_questions),
            "by_type": {
                "multiple_choice": len([q for q in lab_questions if q.question_type == QuestionType.MULTIPLE_CHOICE]),
                "open_answer": len([q for q in lab_questions if q.question_type == QuestionType.OPEN_ANSWER]),
                "code": len([q for q in lab_questions if q.question_type == QuestionType.CODE])
            },
            "by_difficulty": {
                "easy": len([q for q in lab_questions if q.difficulty == Difficulty.EASY]),
                "medium": len([q for q in lab_questions if q.difficulty == Difficulty.MEDIUM]),
                "hard": len([q for q in lab_questions if q.difficulty == Difficulty.HARD]),
                "expert": len([q for q in lab_questions if q.difficulty == Difficulty.EXPERT]),
                "boss": len([q for q in lab_questions if q.difficulty == Difficulty.BOSS])
            }
        }
