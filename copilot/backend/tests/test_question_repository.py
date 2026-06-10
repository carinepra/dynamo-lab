from src.models.schemas import Difficulty, QuestionDefinition, QuestionType
from src.quiz.question_repository import QuestionRepository


def make_repository_without_loading() -> QuestionRepository:
    return QuestionRepository.__new__(QuestionRepository)


def test_parse_validation_schema_maps_core_fields():
    repository = make_repository_without_loading()
    schema = {
        "challenges": {
            "q1": {
                "type": "multiple_choice",
                "difficulty": "⭐⭐ Intermediário",
                "chapter": "conceitos",
                "title": "Pergunta teste",
                "question": "Qual opção está correta?",
                "xp": 75,
                "timer_seconds": 90,
                "options": {"B": "segunda", "A": "primeira"},
                "correct_index": 1,
                "hints": ["Leia a PK", "Compare a SK"],
                "explanation": "Explicação",
                "learning_objectives": ["modelagem"],
                "tags": ["dynamodb"],
            }
        }
    }

    questions = repository._parse_validation_schema(schema, "labx")

    assert len(questions) == 1
    question = questions[0]
    assert question.id == "q1_labx"
    assert question.chapter == "conceitos"
    assert question.title == "Pergunta teste"
    assert question.description == "Qual opção está correta?"
    assert question.question_type == QuestionType.MULTIPLE_CHOICE
    assert question.difficulty == Difficulty.MEDIUM
    assert question.max_xp == 75
    assert question.timer_seconds == 90
    assert question.options == ["primeira", "segunda"]
    assert question.correct_answer == "B"
    assert question.hint == "💡 Leia a PK\n\n💡 Compare a SK"
    assert question.learning_objectives == ["modelagem"]
    assert question.tags == ["dynamodb"]


def test_closed_mode_keeps_only_multiple_choice_with_answer():
    repository = make_repository_without_loading()
    repository.quiz_mode = "closed"
    schema = {
        "challenges": {
            "q1": {
                "type": "multiple_choice",
                "title": "Fechada válida",
                "question": "Qual opção?",
                "options": ["A", "B"],
                "correct_answer": "A",
                "hints": [],
                "explanation": "Explicação",
            },
            "q2": {
                "type": "multiple_choice",
                "title": "Fechada sem gabarito",
                "question": "Qual opção?",
                "options": ["A", "B"],
                "hints": [],
                "explanation": "Explicação",
            },
            "q3": {
                "type": "open_answer",
                "title": "Aberta",
                "question": "Informe PK/SK",
                "hints": [],
                "explanation": "Explicação",
            },
            "q4": {
                "type": "code",
                "title": "Código",
                "question": "Escreva código",
                "hints": [],
                "explanation": "Explicação",
            },
        }
    }

    questions = repository._parse_validation_schema(schema, "labx")

    assert [question.id for question in questions] == ["q1_labx"]
    assert questions[0].question_type == QuestionType.MULTIPLE_CHOICE
    assert questions[0].correct_answer == "A"


def test_repository_public_methods_use_loaded_questions():
    question = QuestionDefinition(
        id="q1_labx",
        chapter="conceitos",
        title="Pergunta teste",
        description="Descrição",
        question_type=QuestionType.OPEN_ANSWER,
        difficulty=Difficulty.EASY,
        max_xp=100,
        timer_seconds=120,
        expected_pk="EMPLOYEE#1",
        expected_sk="SUMMARY",
        hint="Dica",
        explanation="Explicação",
    )
    repository = make_repository_without_loading()
    repository.questions = [question]
    repository.questions_by_lab = {"labx": [question]}

    assert repository.get_all_questions() == [question]
    assert repository.get_questions_by_lab("labx") == [question]
    assert repository.get_question_by_id("q1_labx") == question
    assert repository.get_question_by_index(0) == question
    assert repository.get_question_by_index(1) is None
    assert repository.get_total_xp() == 100
    assert repository.get_questions_count() == 1
    assert repository.get_lab_stats("labx")["total_questions"] == 1
