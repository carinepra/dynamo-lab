"""
Módulo de quiz do DynamoDB Copilot.

Contém a lógica de validação de respostas e gerenciamento de questões.
"""

from .question_repository import QuestionRepository
from .score_calculator import ScoreCalculator

__all__ = ['QuestionRepository', 'ScoreCalculator']

