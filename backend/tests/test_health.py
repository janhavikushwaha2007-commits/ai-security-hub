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


def test_not_found_uses_safe_error_envelope(client: TestClient) -> None:
    response = client.get("/not-a-route")

    assert response.status_code == 404
    assert response.json()["error"]["code"] == "not_found"
    assert "traceback" not in response.text.lower()


def test_cors_allows_only_configured_origins(client: TestClient) -> None:
    allowed = client.get("/health", headers={"Origin": "http://localhost:8080"})
    rejected = client.get("/health", headers={"Origin": "https://untrusted.example"})

    assert allowed.headers["access-control-allow-origin"] == "http://localhost:8080"
    assert "access-control-allow-origin" not in rejected.headers


def test_cors_preflight_has_no_credentials(client: TestClient) -> None:
    response = client.options(
        "/health",
        headers={
            "Origin": "http://localhost:8080",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:8080"
    assert "access-control-allow-credentials" not in response.headers


def test_openapi_is_available_without_scanner_apis(client: TestClient) -> None:
    response = client.get("/openapi.json")

    assert response.status_code == 200
    schema = response.json()
    assert "/health" in schema["paths"]
    assert "/v1/scans/message" not in schema["paths"]