"""Consistent, non-sensitive API error responses."""

from typing import Any

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


def _request_id(request: Request) -> str:
    return getattr(request.state, "request_id", "unavailable")


def _error_response(
    request: Request,
    *,
    status_code: int,
    code: str,
    message: str,
    fields: list[dict[str, str]] | None = None,
) -> JSONResponse:
    error: dict[str, Any] = {
        "code": code,
        "message": message,
        "request_id": _request_id(request),
    }
    if fields:
        error["fields"] = fields
    return JSONResponse(
        status_code=status_code,
        content={"error": error},
        headers={"X-Request-ID": _request_id(request)},
    )


def install_error_handlers(app: FastAPI) -> None:
    """Install safe validation, HTTP, and unexpected-error handlers."""

    @app.exception_handler(RequestValidationError)
    async def handle_validation_error(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        fields = [
            {
                "field": ".".join(str(part) for part in error.get("loc", ())[1:]),
                "message": str(error.get("msg", "Invalid value")),
            }
            for error in exc.errors()
        ]
        return _error_response(
            request,
            status_code=422,
            code="validation_error",
            message="The request could not be accepted.",
            fields=fields,
        )

    @app.exception_handler(StarletteHTTPException)
    async def handle_http_error(request: Request, exc: StarletteHTTPException) -> JSONResponse:
        code_by_status = {404: "not_found", 405: "method_not_allowed"}
        public_messages = {
            404: "The requested resource was not found.",
            405: "The requested method is not allowed.",
        }
        status = exc.status_code
        return _error_response(
            request,
            status_code=status,
            code=code_by_status.get(status, "request_error"),
            message=public_messages.get(status, "The request could not be completed."),
        )

    @app.exception_handler(Exception)
    async def handle_unexpected_error(request: Request, _exc: Exception) -> JSONResponse:
        return _error_response(
            request,
            status_code=500,
            code="internal_error",
            message="An unexpected error occurred.",
        )