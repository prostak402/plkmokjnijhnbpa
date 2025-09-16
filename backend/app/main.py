import json
import os

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
import redis.asyncio as redis
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter
from sqlalchemy import text
from sqlalchemy.orm import Session

from .db import engine, get_db
from . import models
from .feed_service import fetch_candidates, rank_clips

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
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    app.state.redis = redis.from_url(
        redis_url, encoding="utf-8", decode_responses=True
    )
    await app.state.redis.ping()
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


@app.get(
    "/feed/personalized",
    dependencies=[Depends(RateLimiter(times=10, seconds=60))],
)
async def get_personalized_feed(
    limit: int = 20,
    user: dict = Depends(jwt_auth),
    db: Session = Depends(get_db),
) -> dict:
    candidates = fetch_candidates(db, user_id=user["sub"], limit=limit)
    ranked = rank_clips(db, candidates, limit=limit)
    return {"items": ranked}


@app.get("/clip/{id}", dependencies=[Depends(RateLimiter(times=20, seconds=60))])
async def get_clip(id: int) -> dict:
    """Return details for a single clip."""
    return {"id": id, "title": f"Clip {id}"}


@app.post("/bookmark", dependencies=[Depends(jwt_auth), Depends(RateLimiter(times=5, seconds=60))])
async def bookmark_clip(
    clip_id: int,
    user: dict = Depends(jwt_auth),
    db: Session = Depends(get_db),
) -> dict:
    db.add(models.Bookmark(user_id=user["sub"], clip_id=clip_id))
    db.commit()
    return {"status": "bookmarked", "clip_id": clip_id}


@app.post("/like", dependencies=[Depends(jwt_auth), Depends(RateLimiter(times=20, seconds=60))])
async def like_clip(
    clip_id: int,
    user: dict = Depends(jwt_auth),
    db: Session = Depends(get_db),
) -> dict:
    db.add(models.Like(user_id=user["sub"], clip_id=clip_id))
    db.commit()
    return {"status": "liked", "clip_id": clip_id}


@app.post("/comment", dependencies=[Depends(jwt_auth), Depends(RateLimiter(times=10, seconds=60))])
async def comment_clip(clip_id: int, text: str) -> dict:
    return {"status": "commented", "clip_id": clip_id, "text": text}


@app.post("/signal/view", dependencies=[Depends(jwt_auth)])
async def signal_view(
    clip_id: int,
    user: dict = Depends(jwt_auth),
    db: Session = Depends(get_db),
) -> dict:
    db.add(models.View(user_id=user["sub"], clip_id=clip_id))
    db.commit()
    return {"status": "viewed", "clip_id": clip_id}


@app.post("/signal/click", dependencies=[Depends(jwt_auth)])
async def signal_click(
    clip_id: int,
    user: dict = Depends(jwt_auth),
    db: Session = Depends(get_db),
) -> dict:
    db.add(models.Click(user_id=user["sub"], clip_id=clip_id))
    db.commit()
    return {"status": "clicked", "clip_id": clip_id}


@app.post("/auth")
async def auth(username: str) -> dict:
    """Return a JWT access token."""
    token = jwt.encode({"sub": username}, SECRET, algorithm="HS256")
    return {"access_token": token}
