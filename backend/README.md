# Backend

Server-side API for FilmClips built with FastAPI.

## Development

Install dependencies:

```
pip install -r requirements.txt
```

Run the server:

```
uvicorn app.main:app --reload
```

The API provides JWT authentication, rate limiting, error handling middleware, and Redis caching for feed responses. OpenAPI/Swagger documentation is available at `/docs` when the server is running.
