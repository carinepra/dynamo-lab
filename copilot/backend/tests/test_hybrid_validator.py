import importlib

from src.validators.hybrid_validator import HybridValidator


def test_hybrid_validator_reads_dynamodb_config_from_env(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    monkeypatch.delenv("DYNAMODB_EXECUTION_ENABLED", raising=False)
    monkeypatch.setenv("DYNAMODB_ENDPOINT", "http://dynamodb-test:8000")
    monkeypatch.setenv("TABLE_NAME", "test-table")

    validator = HybridValidator()

    assert validator.openai_validator.client is None
    assert validator.dynamodb_executor.endpoint_url == "http://dynamodb-test:8000"
    assert validator.dynamodb_executor.table_name == "test-table"
    assert validator.dynamodb_executor.code_execution_enabled is False


def test_hybrid_validator_enables_code_execution_only_with_explicit_opt_in(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    monkeypatch.setenv("DYNAMODB_EXECUTION_ENABLED", "true")

    validator = HybridValidator()

    assert validator.dynamodb_executor.code_execution_enabled is True


def test_hybrid_validator_constructor_args_override_env(monkeypatch):
    monkeypatch.setenv("DYNAMODB_ENDPOINT", "http://env-endpoint:8000")
    monkeypatch.setenv("TABLE_NAME", "env-table")

    validator = HybridValidator(
        dynamodb_endpoint="http://explicit-endpoint:8000",
        dynamodb_table="explicit-table",
    )

    assert validator.dynamodb_executor.endpoint_url == "http://explicit-endpoint:8000"
    assert validator.dynamodb_executor.table_name == "explicit-table"


def test_combine_validations_without_execution_uses_semantic_result(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    validator = HybridValidator()

    result = validator._combine_validations(
        semantic={
            "is_valid": True,
            "feedback": "Resposta correta",
            "confidence": 0.9,
            "suggestions": [],
        },
        execution=None,
        max_time_ms=50.0,
    )

    assert result["is_correct"] is True
    assert result["execution_time_ms"] == 0
    assert result["items_scanned"] == 0
    assert result["performance_bonus"] == 0
    assert result["semantic_validation"]["is_valid"] is True
    assert result["execution_validation"] is None


def test_quiz_routes_do_not_instantiate_hybrid_validator_in_closed_mode(monkeypatch):
    monkeypatch.setenv("QUIZ_MODE", "closed")

    import src.api.quiz_routes as quiz_routes

    reloaded_routes = importlib.reload(quiz_routes)

    assert reloaded_routes.QUIZ_MODE == "closed"
    assert reloaded_routes.hybrid_validator is None
