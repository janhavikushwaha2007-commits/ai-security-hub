"""MongoDB Atlas connection factory using the official async PyMongo API."""

from pymongo import AsyncMongoClient

from app.core.config import Settings


def create_mongo_client(settings: Settings) -> AsyncMongoClient:
    """Create an async client without initiating a network request."""
    return AsyncMongoClient(
        settings.mongodb_uri,
        serverSelectionTimeoutMS=settings.mongodb_server_selection_timeout_ms,
        appname="ai-security-mesh-api",
    )