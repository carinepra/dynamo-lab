"""
API Routes - Endpoints do Quiz
"""
from fastapi import APIRouter, HTTPException
from uuid import uuid4
from datetime import datetime
import logging
import os

from src.models.schemas import (
    StartQuizRequest, SubmitAnswerRequest, HintRequest,
    SessionResponse, ValidationResult, HintResponse,
    QuizResultResponse, QuestionResponse, QuestionType
)
from src.storage.database import get_database
from src.quiz.question_repository import QuestionRepository
from src.quiz.score_calculator import ScoreCalculator
from src.validators.hybrid_validator import HybridValidator

router = APIRouter()

# Configuração de produção interna: somente questões fechadas por padrão.
QUIZ_MODE = os.getenv("QUIZ_MODE", "closed").lower()

# Inicialização de componentes
question_repo = QuestionRepository()
score_calculator = ScoreCalculator(max_possible_xp=question_repo.get_total_xp())
hybrid_validator = None if QUIZ_MODE == "closed" else HybridValidator()
db = get_database()

# Logger
logger = logging.getLogger(__name__)

TEXT = {
    "pt-BR": {
        "timeout_title": "⏱️ **Tempo esgotado!**",
        "timeout_body": "Você não respondeu a tempo.",
        "correct_answer_was": "✅ **A resposta correta era:**",
        "you_chose": "❌ **Você escolheu:**",
    },
    "en": {
        "timeout_title": "⏱️ **Time is up!**",
        "timeout_body": "You did not answer in time.",
        "correct_answer_was": "✅ **The correct answer was:**",
        "you_chose": "❌ **You chose:**",
    },
}


def _content_language(session) -> str:
    if not session:
        return "en"
    language = session.get("content_language") or "en"
    return language if language in TEXT else "en"


def _text(content_language: str, key: str) -> str:
    return TEXT.get(content_language, TEXT["pt-BR"]).get(key, TEXT["pt-BR"][key])


def filter_code_by_language(text: str, language: str) -> str:
    """
    Filtra blocos de código para mostrar apenas a linguagem escolhida.
    Remove cabeçalhos "**Código [Linguagem]:**" + blocos de código de outras linguagens.
    """
    import re
    
    logger.info(f"🔍 DEBUG filter_code_by_language: language={language}")
    
    # Normalizar linguagem do usuário
    user_lang = language.lower()
    if user_lang in ['js', 'javascript']:
        user_lang = 'javascript'
    
    logger.info(f"🔍 DEBUG user_lang normalizado: {user_lang}")
    
    # Definir todas as linguagens possíveis (capitalizado como aparece no texto)
    all_languages = ['Python', 'Go', 'JavaScript']
    
    result = text
    
    # Para cada linguagem, remover se não for a escolhida pelo usuário
    for lang_name in all_languages:
        lang_key = lang_name.lower()
        
        # Se esta não é a linguagem do usuário, remover
        if lang_key != user_lang:
            # Pattern: **Código [Linguagem]:**
            # seguido opcionalmente de espaços/quebras de linha
            # seguido de ```lang
            # seguido de qualquer coisa até fechar ```
            # Usa non-greedy .*? para não pegar além do fechamento
            pattern = rf'\*\*Código {lang_name}:\*\*\s*```{lang_key}.*?```'
            
            matches = re.findall(pattern, result, flags=re.IGNORECASE | re.DOTALL)
            logger.info(f"🔍 DEBUG Removendo {lang_name}: encontrados {len(matches)} blocos")
            
            result = re.sub(pattern, '', result, flags=re.IGNORECASE | re.DOTALL)
    
    # Limpar múltiplas linhas vazias (3+ vira 2)
    result = re.sub(r'\n{3,}', '\n\n', result)
    
    logger.info(f"🔍 DEBUG Texto filtrado tem {len(result)} caracteres")
    
    return result.strip()


def split_explanation(explanation: str) -> tuple[str, dict]:
    """
    Separa a explanation em:
    1. Parte correta (tudo antes do primeiro ---)
    2. Dicionário de alternativas erradas {A: texto, B: texto, ...}
    """
    import re
    
    # Separar por --- (se existir)
    parts = explanation.split('---', 1)
    correct_part = parts[0].strip()
    
    wrong_answers = {}
    if len(parts) > 1:
        wrong_section = parts[1].strip()
        
        # Extrair blocos de alternativas erradas
        # Padrão: ❌ **A) Titulo:** ou ❌ **A:**
        # Captura tudo até a próxima alternativa ou fim do texto
        pattern = r'❌\s*\*\*([A-D])\)\s*([^❌]+?)(?=\n\n❌\s*\*\*[A-D]\)|$)'
        matches = re.finditer(pattern, wrong_section, re.DOTALL)
        
        for match in matches:
            letter = match.group(1)
            content = match.group(2).strip()
            wrong_answers[letter] = f"❌ **{letter})** {content}"
    
    return correct_part, wrong_answers


def extract_wrong_answer_feedback(
    explanation: str,
    wrong_answer: str,
    content_language: str = "en"
) -> str:
    """
    Extrai apenas o feedback da alternativa errada escolhida.
    """
    _, wrong_answers = split_explanation(explanation)
    
    if wrong_answer in wrong_answers:
        return wrong_answers[wrong_answer]
    
    # Fallback: se não encontrar no formato estruturado, tenta buscar manualmente
    import re
    patterns = [
        rf'❌\s*\*\*{wrong_answer}\)([^❌]+?)(?=\n\n❌|$)',
        rf'❌\s*\*\*{wrong_answer}:([^❌]+?)(?=\n\n❌|$)',
        rf'❌\s*\*\*Opção {wrong_answer}([^❌]+?)(?=\n\n❌|$)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, explanation, re.DOTALL | re.MULTILINE)
        if match:
            content = match.group(1).strip()
            return f"❌ **{wrong_answer})** {content}"
    
    if content_language == "en":
        return f"❌ **Option {wrong_answer} is incorrect.**\n\nThis is not the best approach for the proposed problem."
    
    return f"❌ **A opção {wrong_answer} está incorreta.**\n\nEsta não é a melhor abordagem para o problema proposto."


def _question_to_response(question) -> QuestionResponse:
    """Converte QuestionDefinition para QuestionResponse (público)"""
    return QuestionResponse(
        id=question.id,
        chapter=question.chapter,
        title=question.title,
        description=question.description,
        question_type=question.question_type,
        difficulty=question.difficulty,
        max_xp=question.max_xp,
        timer_seconds=question.timer_seconds,
        options=question.options if question.question_type == QuestionType.MULTIPLE_CHOICE else None,
        code_template=question.code_template.get(
            "python", ""
        ) if question.code_template else None,
        hint_available=True
    )


def _ensure_closed_question_allowed(question) -> None:
    if QUIZ_MODE != "closed":
        return
    
    if question.question_type != QuestionType.MULTIPLE_CHOICE:
        raise HTTPException(
            status_code=422,
            detail="Modo fechado aceita apenas questões de múltipla escolha"
        )
    
    if not question.correct_answer:
        raise HTTPException(
            status_code=500,
            detail="Questão fechada sem gabarito configurado"
        )


def _get_lab_from_question_id(question_id: str) -> str | None:
    if "_lab" not in question_id:
        return None
    
    return question_id.split("_")[-1]


@router.post("/start", response_model=SessionResponse)
async def start_quiz(request: StartQuizRequest):
    """
    Inicia nova sessão de quiz
    
    - Cria sessão no banco
    - Retorna primeira questão
    - Filtra por lab se especificado
    """
    # Criar repositório filtrado por lab se especificado
    selected_lab = request.lab
    labs_to_use = [selected_lab] if selected_lab else ["lab1", "lab2", "lab3"]
    filtered_repo = QuestionRepository(labs_to_load=labs_to_use)
    
    # Criar sessão
    session_id = str(uuid4())
    db.create_session(
        session_id=session_id,
        player_name=request.player_name,
        language=request.language.value,
        lab=selected_lab,
        content_language=request.content_language
    )
    
    # Primeira questão do lab específico
    first_question = filtered_repo.get_question_by_index(0)
    if not first_question:
        raise HTTPException(status_code=500, detail="Nenhuma questão disponível")
    
    localized_first_question = filtered_repo.localize_question(
        first_question,
        request.content_language
    )
    
    return SessionResponse(
        session_id=session_id,
        player_name=request.player_name,
        language=request.language.value,
        first_question=_question_to_response(localized_first_question),
        total_questions=filtered_repo.get_questions_count()
    )


@router.post("/validate", response_model=ValidationResult)
async def validate_answer(request: SubmitAnswerRequest):
    """
    Valida resposta submetida
    
    - Valida resposta (múltipla escolha, aberta ou código)
    - Calcula XP
    - Retorna próxima questão ou finaliza quiz
    """
    
    # Buscar sessão
    session = db.get_session(request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Sessão não encontrada")
    
    # Buscar questão
    question = question_repo.get_question_by_id(request.question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Questão não encontrada")
    
    _ensure_closed_question_allowed(question)
    
    session_lab = session.get("lab")
    question_lab = _get_lab_from_question_id(request.question_id)
    if session_lab and question_lab and session_lab != question_lab:
        raise HTTPException(status_code=400, detail="Questão não pertence ao lab da sessão")
    
    content_language = _content_language(session)
    display_question = question_repo.localize_question(question, content_language)
    
    # Pegar linguagem da sessão para filtrar código
    user_language = session.get("language", "python")
    logger.info(f"🔍 DEBUG validate_answer: session_id={request.session_id}, question_id={request.question_id}, question_title={question.title}, user_language={user_language}")
    
    # Validar resposta baseado no tipo
    is_correct = False
    feedback = ""
    execution_time_ms = None
    items_scanned = None
    performance_bonus = 0
    
    # Verificar timeout ANTES de qualquer processamento
    is_timeout_answer = request.answer == "[TIMEOUT]"
    
    if question.question_type == QuestionType.MULTIPLE_CHOICE:
        # Verificar se respondeu (ou se tempo esgotou)
        if is_timeout_answer or request.answer is None or request.answer == "":
            is_correct = False
            # Separar explanation para pegar só a parte correta
            correct_explanation, _ = split_explanation(display_question.explanation or "")
            explanation_filtered = filter_code_by_language(correct_explanation, user_language)
            
            # Mostrar qual era a opção correta
            correct_index = ord(question.correct_answer) - 65  # A=0, B=1, C=2, D=3
            correct_option = display_question.options[correct_index] if display_question.options else question.correct_answer
            
            feedback = (
                f"{_text(content_language, 'timeout_title')}\n\n"
                f"{_text(content_language, 'timeout_body')}\n\n"
                f"---\n\n"
                f"{_text(content_language, 'correct_answer_was')}\n"
                f"**{question.correct_answer}) {correct_option}**\n\n"
                f"{explanation_filtered}"
            )
        else:
            # Múltipla escolha - comparação direta
            is_correct = request.answer == question.correct_answer
            
            # Separar explanation em parte correta e alternativas erradas
            correct_explanation, wrong_answers = split_explanation(display_question.explanation)
            
            if is_correct:
                # Quando acerta: mostrar APENAS a parte correta (sem alternativas erradas)
                # Filtrar código pela linguagem do usuário
                feedback = filter_code_by_language(correct_explanation, user_language)
            else:
                # Quando erra: mostrar qual era a correta + por que a escolhida está errada
                correct_index = ord(question.correct_answer) - 65  # A=0, B=1, C=2, D=3
                # Proteção: só calcular índice se for uma letra válida
                if len(request.answer) == 1 and request.answer.isalpha():
                    wrong_index = ord(request.answer.upper()) - 65
                else:
                    wrong_index = -1
                
                correct_option = display_question.options[correct_index] if display_question.options else question.correct_answer
                wrong_option = display_question.options[wrong_index] if display_question.options and 0 <= wrong_index < len(display_question.options) else request.answer
                
                # Extrair apenas a explicação da alternativa que o usuário escolheu
                wrong_feedback = extract_wrong_answer_feedback(
                    display_question.explanation,
                    request.answer,
                    content_language
                )
                
                # Filtrar código pela linguagem do usuário (tanto parte correta quanto errada)
                correct_filtered = filter_code_by_language(correct_explanation, user_language)
                wrong_filtered = filter_code_by_language(wrong_feedback, user_language)
                
                feedback = (
                    f"{_text(content_language, 'correct_answer_was')}\n"
                    f"**{question.correct_answer}) {correct_option}**\n\n"
                    f"{correct_filtered}\n\n"
                    f"---\n\n"
                    f"{_text(content_language, 'you_chose')}\n"
                    f"**{request.answer}) {wrong_option}**\n\n"
                    f"{wrong_filtered}"
                )
    
    elif question.question_type == QuestionType.OPEN_ANSWER:
        # Resposta aberta (PK/SK)
        
        # Verificar se respondeu (ou se tempo esgotou)
        is_empty_answer = (request.pk is None or request.pk == "") and (request.sk is None or request.sk == "")
        
        if is_empty_answer or is_timeout_answer:
            is_correct = False
            explanation_filtered = filter_code_by_language(question.explanation or "", user_language)
            feedback = "⏱️ **Tempo esgotado!**\n\nVocê não respondeu a tempo.\n\n" + explanation_filtered
        # Se tem validation_prompt, usar validação flexível
        elif question.validation_prompt:
            # Validação flexível - aceita variações conceituais
            pk_valid = False
            sk_valid = False
            operation_valid = False
            
            # Validar PK - aceita variações (case insensitive)
            if request.pk is not None and request.pk != "":
                pk_lower = request.pk.lower().strip()
                # Aceita: EMPLOYEE#uuid, EMPLOYEE#id, EMPLOYEE#*, etc
                if "employee" in pk_lower and "#" in pk_lower:
                    pk_valid = True
                elif "employee" in pk_lower:  # Aceita até sem #
                    pk_valid = True
            
            # Validar SK - aceita variações (case insensitive)
            if request.sk is not None and request.sk != "":
                sk_lower = request.sk.lower().strip()
                # Aceita: PLAN#, PLAN#*, PLAN, etc
                if "plan" in sk_lower:
                    sk_valid = True
            
            # Validar operação
            if request.operation is not None and request.operation != "":
                op_lower = request.operation.lower().strip()
                if "query" in op_lower:
                    operation_valid = True
            
            is_correct = pk_valid and sk_valid and operation_valid
            
            if is_correct:
                explanation_filtered = filter_code_by_language(question.explanation, user_language)
                feedback = f"✅ Excelente! Você entendeu o conceito!\n\n{explanation_filtered}"
            else:
                # Construir feedback visual mostrando o que está certo/errado
                pk_status = "✅" if pk_valid else "❌"
                sk_status = "✅" if sk_valid else "❌"
                op_status = "✅" if operation_valid else "❌"
                
                errors = []
                if not pk_valid:
                    errors.append("• PK deve conter 'EMPLOYEE#' (aceita maiúscula/minúscula)")
                if not sk_valid:
                    errors.append("• SK deve conter 'PLAN' (aceita maiúscula/minúscula)")
                if not operation_valid:
                    errors.append("• Operação deve ser 'Query' (Link tem MÚLTIPLOS planos!)")
                
                feedback = (
                    f"**Você respondeu:**\n"
                    f"{pk_status} PK: `{request.pk}`\n"
                    f"{sk_status} SK: `{request.sk}`\n"
                    f"{op_status} Operação: `{request.operation}`\n\n"
                    f"**Problemas encontrados:**\n"
                    f"{chr(10).join(errors)}\n\n"
                    f"**💡 Dica:** GetItem pega apenas 1 item. Link tem 2 planos (PGBL + VGBL). Use Query para pegar múltiplos!\n\n"
                    f"✅ **Resposta correta (aceita variações):**\n"
                    f"PK: `EMPLOYEE#uuid` (ou employee#id, EMPLOYEE#770e8400...)\n"
                    f"SK: `PLAN#` (ou plan#, PLAN)\n"
                    f"Operação: `Query` ← CRUCIAL!\n\n"
                    f"**Por que a resposta correta é melhor:**\n\n"
                    f"{question.explanation}"
                )
        else:
            # Validação exata (padrão)
            pk_correct = request.pk == question.expected_pk
            sk_correct = request.sk == question.expected_sk
            is_correct = pk_correct and sk_correct
            
            if is_correct:
                feedback = f"✅ {question.explanation}"
            else:
                errors = []
                your_answer = []
                
                if not pk_correct:
                    errors.append(f"❌ PK incorreta")
                    your_answer.append(f"PK: `{request.pk}`")
                else:
                    your_answer.append(f"PK: `{request.pk}` ✅")
                    
                if not sk_correct:
                    errors.append(f"❌ SK incorreta")
                    your_answer.append(f"SK: `{request.sk}`")
                else:
                    your_answer.append(f"SK: `{request.sk}` ✅")
                
                feedback = (
                    f"**Você respondeu:**\n"
                    f"{chr(10).join(your_answer)}\n\n"
                    f"✅ **Resposta correta:**\n"
                    f"PK: `{question.expected_pk}`\n"
                    f"SK: `{question.expected_sk}`\n\n"
                    f"**Por que a resposta correta é melhor:**\n\n"
                    f"{question.explanation}"
                )
    
    elif question.question_type == QuestionType.CODE:
        if hybrid_validator is None:
            raise HTTPException(
                status_code=422,
                detail="Validação de código indisponível no modo de questões fechadas"
            )
        
        # Verificar se respondeu (ou se tempo esgotou)
        is_empty_code = request.code is None or request.code == "" or request.code.strip() == ""
        
        if is_empty_code or is_timeout_answer:
            is_correct = False
            feedback = "⏱️ **Tempo esgotado!**\n\nVocê não enviou código a tempo.\n\n" + (question.explanation or "Tente novamente!")
            execution_time_ms = None
            items_scanned = None
            performance_bonus = 0
        else:
            # Código - validação híbrida
            validation_result = hybrid_validator.validate(
                code=request.code,
                language=session["language"],
                question_context=f"{question.description}\n\n{question.validation_prompt}",
                expected_result=question.expected_result,
                max_execution_time_ms=50.0
            )
            
            is_correct = validation_result["is_correct"]
            feedback = validation_result["feedback"]
            execution_time_ms = validation_result["execution_time_ms"]
            items_scanned = validation_result["items_scanned"]
            performance_bonus = validation_result["performance_bonus"]
    
    # Calcular XP
    xp_earned, xp_breakdown = score_calculator.calculate_question_xp(
        base_xp=question.max_xp,
        is_correct=is_correct,
        execution_time_ms=execution_time_ms or 0,
        performance_bonus=performance_bonus,
        hint_used=False  # TODO: rastrear hints usados
    )
    
    # Salvar submissão
    db.save_submission(
        session_id=request.session_id,
        question_id=request.question_id,
        is_correct=is_correct,
        xp_earned=xp_earned,
        feedback=feedback,
        submitted_code=request.code,
        submitted_answer=request.answer,
        execution_time_ms=execution_time_ms,
        items_scanned=items_scanned
    )
    
    # Atualizar sessão
    db.update_session_xp(request.session_id, xp_earned)
    db.increment_question_index(request.session_id)
    
    # Próxima questão ou finaliza
    session = db.get_session(request.session_id)
    next_index = session["current_question_index"]
    
    # Descobrir qual lab está sendo usado pela question_id
    # question_id formato: "Q1_lab1" ou "Q2_lab2"
    current_lab = None
    if '_lab' in request.question_id:
        current_lab = _get_lab_from_question_id(request.question_id)  # Extrai "lab1", "lab2", "lab3"
    
    # Criar repositório filtrado pelo mesmo lab
    if current_lab:
        labs_to_use = [current_lab]
    else:
        labs_to_use = ["lab1", "lab2", "lab3"]  # Fallback para todos
    
    filtered_repo = QuestionRepository(labs_to_load=labs_to_use)
    next_question = filtered_repo.get_question_by_index(next_index)
    localized_next_question = filtered_repo.localize_question(next_question, content_language)
    
    quiz_completed = next_question is None
    
    if quiz_completed:
        db.complete_session(request.session_id)
    
    return ValidationResult(
        correct=is_correct,
        xp_earned=xp_earned,
        feedback=feedback,
        execution_time_ms=execution_time_ms,
        items_scanned=items_scanned,
        performance_bonus=performance_bonus,
        next_question=_question_to_response(localized_next_question) if localized_next_question else None,
        quiz_completed=quiz_completed
    )


@router.post("/hint", response_model=HintResponse)
async def get_hint(request: HintRequest):
    """
    Retorna dica para a questão
    
    - Penaliza XP
    - Incrementa contador de hints
    """
    
    # Buscar questão
    question = question_repo.get_question_by_id(request.question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Questão não encontrada")
    
    # Buscar sessão
    session = db.get_session(request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Sessão não encontrada")
    
    content_language = _content_language(session)
    display_question = question_repo.localize_question(question, content_language)
    
    # Aplicar penalidade
    penalty = score_calculator.HINT_PENALTY
    db.update_session_xp(request.session_id, -penalty)
    db.increment_hints_used(request.session_id)
    
    return HintResponse(
        hint=display_question.hint,
        xp_penalty=penalty
    )


@router.get("/results/{session_id}", response_model=QuizResultResponse)
async def get_results(session_id: str):
    """
    Retorna resultado final do quiz
    
    - Estatísticas completas
    - Rank
    - Todas submissões
    """
    
    stats = db.get_session_stats(session_id)
    if not stats or not stats.get("session"):
        raise HTTPException(status_code=404, detail="Sessão não encontrada")
    
    session = stats["session"]
    submissions = stats["submissions"]
    
    session_lab = session.get("lab")
    result_score_calculator = score_calculator
    if session_lab:
        result_score_calculator = ScoreCalculator(
            max_possible_xp=QuestionRepository(labs_to_load=[session_lab]).get_total_xp()
        )
    
    # Calcular estatísticas finais
    final_stats = result_score_calculator.calculate_final_stats(
        submissions=submissions,
        total_time_seconds=stats["total_time_seconds"],
        hints_used=session.get("hints_used", 0)
    )
    
    return QuizResultResponse(
        session_id=session_id,
        player_name=session["player_name"],
        language=session["language"],
        total_xp=final_stats["total_xp"],
        max_possible_xp=final_stats["max_possible_xp"],
        percentage=final_stats["percentage"],
        rank=f"{final_stats['rank_emoji']} {final_stats['rank']}",
        questions_correct=final_stats["questions_correct"],
        questions_total=final_stats["questions_total"],
        total_time_seconds=final_stats["total_time_seconds"],
        hints_used=final_stats["hints_used"],
        submissions=[
            {
                "question_id": s["question_id"],
                "is_correct": bool(s["is_correct"]),
                "xp_earned": s["xp_earned"],
                "execution_time_ms": s.get("execution_time_ms"),
                "submitted_at": s["submitted_at"]
            }
            for s in submissions
        ]
    )


@router.get("/result/{session_id}", response_model=QuizResultResponse)
async def get_result_alias(session_id: str):
    """Alias temporário para compatibilidade com clientes antigos."""
    return await get_results(session_id)


@router.get("/session/{session_id}")
async def get_session_status(session_id: str):
    """Retorna status atual da sessão"""
    
    session = db.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Sessão não encontrada")
    
    current_index = session["current_question_index"]
    session_lab = session.get("lab")
    status_repo = QuestionRepository(labs_to_load=[session_lab]) if session_lab else question_repo
    current_question = status_repo.get_question_by_index(current_index)
    localized_question = status_repo.localize_question(
        current_question,
        _content_language(session)
    )
    
    return {
        "session": session,
        "current_question": _question_to_response(localized_question) if localized_question else None,
        "progress": {
            "current": current_index,
            "total": status_repo.get_questions_count(),
            "percentage": (current_index / status_repo.get_questions_count()) * 100
        }
    }


@router.get("/question/{question_index}", response_model=QuestionResponse)
async def get_question_by_index(question_index: int):
    """
    Retorna questão pelo índice (usado para navegação manual)
    """
    # Ajustar índice (frontend usa 1-based, backend usa 0-based)
    adjusted_index = question_index - 1
    
    question = question_repo.get_question_by_index(adjusted_index)
    if not question:
        raise HTTPException(status_code=404, detail=f"Questão {question_index} não encontrada")
    
    return _question_to_response(question)

