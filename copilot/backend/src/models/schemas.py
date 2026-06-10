"""
Modelos de dados (Pydantic schemas)
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class Language(str, Enum):
    """Linguagens suportadas"""
    PYTHON = "python"
    GO = "go"
    JAVASCRIPT = "javascript"


class QuestionType(str, Enum):
    """Tipos de questão"""
    MULTIPLE_CHOICE = "multiple_choice"
    OPEN_ANSWER = "open_answer"
    CODE = "code"


class Difficulty(str, Enum):
    """Dificuldade da questão"""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"
    EXPERT = "expert"
    BOSS = "boss"


# ===== REQUESTS =====

class StartQuizRequest(BaseModel):
    """Request para iniciar quiz"""
    player_name: str = Field(..., min_length=2, max_length=100)
    language: Language
    lab: Optional[str] = Field(None, pattern=r"^lab[1-3]$")  # lab1, lab2, lab3
    content_language: str = Field("en", pattern=r"^(pt-BR|en)$")


class SubmitAnswerRequest(BaseModel):
    """Request para submeter resposta"""
    session_id: str = Field(..., min_length=1, max_length=64)
    question_id: str = Field(..., min_length=1, max_length=64)
    answer: Optional[str] = Field(None, max_length=32)  # Para múltipla escolha ou [TIMEOUT]
    code: Optional[str] = Field(None, max_length=10000)  # Para questões de código
    pk: Optional[str] = Field(None, max_length=2048)  # Para questões abertas PK/SK
    sk: Optional[str] = Field(None, max_length=2048)  # Para questões abertas PK/SK
    operation: Optional[str] = Field(None, max_length=32)  # Para questões abertas que incluem operação (Query, GetItem, etc)


class HintRequest(BaseModel):
    """Request para pedir dica"""
    session_id: str = Field(..., min_length=1, max_length=64)
    question_id: str = Field(..., min_length=1, max_length=64)


# ===== RESPONSES =====

class QuestionResponse(BaseModel):
    """Questão retornada para o usuário"""
    id: str
    chapter: str  # Nome descritivo do capítulo
    title: str
    description: str
    question_type: QuestionType
    difficulty: Difficulty
    max_xp: int
    timer_seconds: int
    options: Optional[List[str]] = None  # Para múltipla escolha
    code_template: Optional[str] = None  # Template para código
    hint_available: bool = True


class ValidationResult(BaseModel):
    """Resultado da validação"""
    correct: bool
    xp_earned: int
    feedback: str
    execution_time_ms: Optional[float] = None
    items_scanned: Optional[int] = None
    performance_bonus: int = 0
    next_question: Optional[QuestionResponse] = None
    quiz_completed: bool = False


class HintResponse(BaseModel):
    """Resposta com dica"""
    hint: str
    xp_penalty: int = 10


class QuizResultResponse(BaseModel):
    """Resultado final do quiz"""
    session_id: str
    player_name: str
    language: str
    total_xp: int
    max_possible_xp: int
    percentage: float
    rank: str
    questions_correct: int
    questions_total: int
    total_time_seconds: int
    hints_used: int
    submissions: List[Dict[str, Any]]


class SessionResponse(BaseModel):
    """Resposta ao iniciar sessão"""
    session_id: str
    player_name: str
    language: str
    first_question: QuestionResponse
    total_questions: int


# ===== DATABASE MODELS =====

class QuizSession(BaseModel):
    """Sessão de quiz (para SQLite)"""
    session_id: str
    player_name: str
    language: str
    content_language: str = "en"
    started_at: datetime
    completed_at: Optional[datetime] = None
    current_question_index: int = 0
    total_xp: int = 0
    hints_used: int = 0


class QuestionSubmission(BaseModel):
    """Submissão de questão (para SQLite)"""
    id: Optional[int] = None
    session_id: str
    question_id: str
    submitted_code: Optional[str] = None
    submitted_answer: Optional[str] = None
    is_correct: bool
    xp_earned: int
    execution_time_ms: Optional[float] = None
    items_scanned: Optional[int] = None
    feedback: str
    submitted_at: datetime


# ===== QUESTION DEFINITION (YAML) =====

class QuestionDefinition(BaseModel):
    """Definição de questão (carregada do YAML ou JSON)"""
    id: str
    chapter: str  # Pode ser "conceitos_basicos", "geral", etc
    title: str
    description: str
    question_type: QuestionType
    difficulty: Difficulty
    max_xp: int
    timer_seconds: int
    
    # Para múltipla escolha
    options: Optional[List[str]] = None
    correct_answer: Optional[str] = None
    
    # Para questões abertas (PK/SK)
    expected_pk: Optional[str] = None
    expected_sk: Optional[str] = None
    
    # Para código
    code_template: Optional[Dict[str, str]] = None  # {language: template}
    expected_result: Optional[Any] = None
    validation_prompt: Optional[str] = None
    
    # Educativo
    hint: str
    explanation: str
    learning_objectives: List[str] = []
    tags: List[str] = []
    translations: Dict[str, Any] = {}

