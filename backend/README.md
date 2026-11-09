# AI SECURITY MESH — FastAPI foundation

This folder is a separate, externally hosted Python service. The Lovable-hosted frontend remains unchanged; Python and MongoDB dependencies are not part of its browser bundle.

## Requirements

- Python 3.12 or newer
- MongoDB Atlas, as selected in the approved architecture (or a local MongoDB instance for development)

## Local setup

From this directory:

```sh
python -m venv .venv
. .venv/bin/activate
python -m pip install -e '.[dev]'
cp .env.example .env
```

Replace the MongoDB URI placeholders in `.env` with a private connection string. Do not commit `.env` or put credentials in frontend environment variables. Then run:

```sh
uvicorn app.main:app --reload
```

- Liveness: `GET /health`
- Interactive API docs: `/docs`
- OpenAPI schema: `/openapi.json`

The health endpoint intentionally checks process liveness only and returns no configuration values or secrets. It does not claim database readiness. MongoDB is configured with PyMongo's asynchronous client and is not contacted until a future feature uses it. No scanner, authentication, or database operations are implemented in this foundation.

## Tests

```sh
python -m pytest
```

The current tests cover health behavior, OpenAPI visibility, required configuration, safe defaults, and invalid configuration. There are no scanner or authentication tests because those features do not exist yet.