"""Environment-backed settings for the external API service."""

from functools import lru_cache
from typing import Literal
from urllib.parse import urlparse

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Validated configuration; secret values are never returned by health endpoints."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    app_env: Literal["development", "test", "staging", "production"] = "development"
    mongodb_uri: str = Field(min_length=1, repr=False)
    mongodb_database: str = Field(min_length=1)
    mongodb_server_selection_timeout_ms: int = Field(default=3000, ge=100, le=60000)
    api_public_origin: str = "http://localhost:8000"
    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:8080"])
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"

    @field_validator("mongodb_uri")
    @classmethod
    def validate_mongodb_uri(cls, value: str) -> str:
        parsed = urlparse(value)
        if parsed.scheme not in {"mongodb", "mongodb+srv"} or not parsed.hostname:
            raise ValueError("must be a valid MongoDB connection URI")
        return value

    @field_validator("mongodb_database")
    @classmethod
    def validate_database_name(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized or any(char in normalized for char in '/\\ ."$*<>:|?'):
            raise ValueError("must be a valid MongoDB database name")
        return normalized

    @field_validator("api_public_origin")
    @classmethod
    def validate_public_origin(cls, value: str) -> str:
        parsed = urlparse(value)
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            raise ValueError("must be an absolute HTTP(S) origin")
        if parsed.path not in {"", "/"} or parsed.query or parsed.fragment:
            raise ValueError("must not include a path, query, or fragment")
        return value.rstrip("/")

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: object) -> object:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @field_validator("cors_origins")
    @classmethod
    def validate_cors_origins(cls, values: list[str]) -> list[str]:
        origins: list[str] = []
        for value in values:
            parsed = urlparse(value)
            if parsed.scheme not in {"http", "https"} or not parsed.netloc:
                raise ValueError("each CORS origin must be an absolute HTTP(S) origin")
            if parsed.path not in {"", "/"} or parsed.query or parsed.fragment:
                raise ValueError("CORS entries must be origins without paths or query strings")
            origins.append(value.rstrip("/"))
        return origins


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Load validated settings once per process."""
    return Settings()