"""Versioned API router; feature routes are added only when implemented."""

from fastapi import APIRouter

router = APIRouter(prefix="/v1")