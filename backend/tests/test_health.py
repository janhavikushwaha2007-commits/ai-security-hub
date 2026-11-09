"""Health endpoint and API schema tests."""

from fastapi.testclient import TestClient


def test_health_returns_liveness_only(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"data": {"status": "ok"}}
    assert "mongodb" not in response.text.lower()
    assert "secret" not in response.text.lower()
    assert response.headers["x-request-id"]


def test_health_preserves_supplied_request_id(client: TestClient) -> None:
    response = client.get("/health", headers={"X-Request-ID": "request-test-123"})

    assert response.headers["x-request-id"] == "request-test-123"


def test_openapi_is_available_without_scanner_apis(client: TestClient) -> None:
    response = client.get("/openapi.json")

    assert response.status_code == 200
    schema = response.json()
    assert "/health" in schema["paths"]
    assert "/v1/scans/message" not in schema["paths"]