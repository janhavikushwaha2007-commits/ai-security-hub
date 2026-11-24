"""FastAPI application entry point for the separately hosted backend."""

from contextlib import asynccontextmanager
from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, Response

from app.api.v1.router import router as v1_router
from app.auth import router as auth_router
from app.core.config import Settings, get_settings
from app.core.errors import install_error_handlers
from app.db.mongo import create_mongo_client
from app.scanner import router as scan_router


def create_app(settings: Settings | None = None) -> FastAPI:
    """Create the service application; configuration is loaded on startup."""

    @asynccontextmanager
    async def lifespan(application: FastAPI):
        resolved_settings = settings or get_settings()
        application.state.settings = resolved_settings
        application.state.mongo_client = create_mongo_client(resolved_settings)
        application.state.mongo_database = application.state.mongo_client[
            resolved_settings.mongodb_database
        ]
        try:
            yield
        finally:
            await application.state.mongo_client.close()

    application = FastAPI(
        title="AI SECURITY MESH API",
        description="Authentication and security scanner APIs with MongoDB persistence.",
        version="0.2.0",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    @application.middleware("http")
    async def attach_request_id(request: Request, call_next):
        request.state.request_id = request.headers.get("X-Request-ID") or str(uuid4())

        resolved_settings: Settings | None = getattr(request.app.state, "settings", None)
        origin = request.headers.get("origin")
        allowed_origin = (
            origin
            if resolved_settings is not None and origin in resolved_settings.cors_origins
            else None
        )

        if request.method == "OPTIONS" and allowed_origin:
            response = Response(status_code=200)
            response.headers["Access-Control-Allow-Methods"] = (
                "GET, POST, PATCH, DELETE, OPTIONS"
            )
            response.headers["Access-Control-Allow-Headers"] = (
                "Authorization, Content-Type, X-Request-ID"
            )
            response.headers["Access-Control-Max-Age"] = "600"
        else:
            response = await call_next(request)

        if allowed_origin:
            response.headers["Access-Control-Allow-Origin"] = allowed_origin
            response.headers["Vary"] = "Origin"
        response.headers["X-Request-ID"] = request.state.request_id
        return response

    @application.get("/health", tags=["health"])
    async def health() -> JSONResponse:
        """Report process liveness without disclosing configuration or secrets."""
        return JSONResponse(content={"data": {"status": "ok"}})

    application.include_router(v1_router)
    application.include_router(auth_router)
    application.include_router(scan_router)
    install_error_handlers(application)
    return application


app = create_app()