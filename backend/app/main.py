from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter
import redis.asyncio as redis
import json
from sqlalchemy import text

from .db import engine

app = FastAPI(title="FilmClips API")

security = HTTPBearer()
SECRET = "secret"


async def jwt_auth(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """Simple JWT auth dependency."""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload


@app.on_event("startup")
async def startup() -> None:
    """Initialize Redis and rate limiter."""
    app.state.redis = redis.from_url(
        "redis://localhost", encoding="utf-8", decode_responses=True
    )
    await FastAPILimiter.init(app.state.redis)
    # Ensure database connection is available
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))


@app.on_event("shutdown")
async def shutdown() -> None:
    await app.state.redis.close()


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Return generic 500 errors in JSON format."""
    return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})


@app.get("/feed", dependencies=[Depends(RateLimiter(times=10, seconds=60))])
async def get_feed() -> dict:
    """Return feed items, cached in Redis."""
    cache = await app.state.redis.get("feed")
    if cache:
        return json.loads(cache)
    data = {"items": []}
    await app.state.redis.set("feed", json.dumps(data), ex=60)
    return data


@app.get("/clip/{id}", dependencies=[Depends(RateLimiter(times=20, seconds=60))])
async def get_clip(id: int) -> dict:
    """Return details for a single clip."""
    return {"id": id, "title": f"Clip {id}"}


@app.post("/bookmark", dependencies=[Depends(jwt_auth), Depends(RateLimiter(times=5, seconds=60))])
async def bookmark_clip(clip_id: int) -> dict:
    return {"status": "bookmarked", "clip_id": clip_id}


@app.post("/like", dependencies=[Depends(jwt_auth), Depends(RateLimiter(times=20, seconds=60))])
async def like_clip(clip_id: int) -> dict:
    return {"status": "liked", "clip_id": clip_id}


@app.post("/comment", dependencies=[Depends(jwt_auth), Depends(RateLimiter(times=10, seconds=60))])
async def comment_clip(clip_id: int, text: str) -> dict:
    return {"status": "commented", "clip_id": clip_id, "text": text}


@app.post("/auth")
async def auth(username: str) -> dict:
    """Return a JWT access token."""
    token = jwt.encode({"sub": username}, SECRET, algorithm="HS256")
    return {"access_token": token}
