"""Shared settings and ASGI test fixtures."""

import pytest
from fastapi.testclient import TestClient

from app.core.config import Settings
from app.main import create_app


@pytest.fixture
def settings() -> Settings:
    return Settings(
        mongodb_uri="mongodb://localhost:27017",
        mongodb_database="mesh_test",
        app_env="test",
        cors_origins=["http://localhost:8080"],
    )


@pytest.fixture
def client(settings: Settings):
    with TestClient(create_app(settings)) as test_client:
        yield test_client