"""FastAPI application entry point for the separately hosted backend."""

from contextlib import asynccontextmanager
from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import router as v1_router
from app.core.config import Settings, get_settings
from app.core.errors import install_error_handlers
from app.db.mongo import create_mongo_client


def create_app(settings: Settings | None = None) -> FastAPI:
    """Create the service application; configuration is loaded on startup."""

    @asynccontextmanager
    async def lifespan(application: FastAPI):
        resolved_settings = settings or get_settings()
        application.state.settings = resolved_settings
        application.state.mongo_client = create_mongo_client(resolved_settings)
        try:
            yield
        finally:
            await application.state.mongo_client.close()

    application = FastAPI(
        title="AI SECURITY MESH API",
        description="External API foundation. Scanner and authentication APIs are not implemented.",
        version="0.1.0",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    if settings is not None:
        application.add_middleware(
            CORSMiddleware,
            allow_origins=settings.cors_origins,
            allow_credentials=False,
            allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
            allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
        )

    @application.middleware("http")
    async def attach_request_id(request: Request, call_next):
        request.state.request_id = request.headers.get("X-Request-ID") or str(uuid4())
        response = await call_next(request)
        response.headers["X-Request-ID"] = request.state.request_id
        return response

    @application.get("/health", tags=["health"])
    async def health() -> JSONResponse:
        """Report process liveness without disclosing configuration or secrets."""
        return JSONResponse(content={"data": {"status": "ok"}})

    application.include_router(v1_router)
    install_error_handlers(application)
    return application


app = create_app()