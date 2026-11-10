"""Environment configuration validation tests."""

import pytest
from pydantic import ValidationError

from app.core.config import Settings


def test_settings_accept_mongodb_atlas_uri_and_parse_cors_list() -> None:
    settings = Settings(
        mongodb_uri="mongodb+srv://user:pass@cluster.example.mongodb.net/?retryWrites=true",
        mongodb_database="ai_security_mesh",
        cors_origins="https://mesh-ai-guard.lovable.app,http://localhost:8080",
    )

    assert settings.mongodb_database == "ai_security_mesh"
    assert settings.cors_origins == [
        "https://mesh-ai-guard.lovable.app",
        "http://localhost:8080",
    ]


def test_settings_parse_environment_values(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("MONGODB_URI", "mongodb://localhost:27017")
    monkeypatch.setenv("MONGODB_DATABASE", "mesh_test")
    monkeypatch.setenv("CORS_ORIGINS", "https://app.example,https://preview.example")

    settings = Settings(_env_file=None)

    assert settings.cors_origins == ["https://app.example", "https://preview.example"]


@pytest.mark.parametrize(
    "overrides",
    [
        {"mongodb_uri": "https://example.com"},
        {"mongodb_database": "bad/name"},
        {"mongodb_server_selection_timeout_ms": 10},
        {"api_public_origin": "not-an-origin"},
        {"api_public_origin": "https://user:pass@example.com"},
        {"cors_origins": ["*"]},
        {"cors_origins": ["https://user:pass@example.com"]},
    ],
)
def test_settings_reject_invalid_values(overrides: dict[str, object]) -> None:
    values: dict[str, object] = {
        "mongodb_uri": "mongodb://localhost:27017",
        "mongodb_database": "mesh_test",
    }
    values.update(overrides)

    with pytest.raises(ValidationError):
        Settings(**values)


def test_settings_require_mongodb_configuration() -> None:
    with pytest.raises(ValidationError):
        Settings(_env_file=None)