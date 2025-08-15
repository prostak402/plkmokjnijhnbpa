from collections import defaultdict
from typing import List

from sqlalchemy.orm import Session
from sqlalchemy import func

from . import models

CTR_WEIGHT = 0.6
LIKE_WEIGHT = 0.3
BOOKMARK_WEIGHT = 0.1


def fetch_candidates(db: Session, user_id: int, limit: int = 20) -> List[models.Clip]:
    """Return candidate clips matching user genre preferences sorted by recency."""
    user = db.get(models.User, user_id)
    if not user:
        return []
    prefs = {p.genre for p in user.genre_preferences}
    clips = (
        db.query(models.Clip)
        .join(models.Film)
        .order_by(models.Clip.id.desc())
        .all()
    )
    in_genre: List[models.Clip] = []
    out_genre: List[models.Clip] = []
    for clip in clips:
        genres = clip.film.data.get("genres", []) if clip.film and clip.film.data else []
        if prefs and prefs.intersection(genres):
            in_genre.append(clip)
        else:
            out_genre.append(clip)
    allowed_out = max(1, limit // 20)
    selected = in_genre[: limit - allowed_out] + out_genre[:allowed_out]
    return selected


def rank_clips(db: Session, clips: List[models.Clip], limit: int = 20):
    """Rank clips by weighted signals applying per-film limits."""
    results = []
    film_counts = defaultdict(int)
    for clip in clips:
        if film_counts[clip.film_id] >= 2:
            continue
        views = db.query(func.count(models.View.id)).filter_by(clip_id=clip.id).scalar() or 0
        clicks = db.query(func.count(models.Click.id)).filter_by(clip_id=clip.id).scalar() or 0
        likes = db.query(func.count(models.Like.id)).filter_by(clip_id=clip.id).scalar() or 0
        bookmarks = db.query(func.count(models.Bookmark.id)).filter_by(clip_id=clip.id).scalar() or 0
        ctr = clicks / views if views else 0
        score = CTR_WEIGHT * ctr + LIKE_WEIGHT * likes + BOOKMARK_WEIGHT * bookmarks
        film_counts[clip.film_id] += 1
        results.append(
            {
                "id": clip.id,
                "title": clip.title,
                "film_id": clip.film_id,
                "score": score,
            }
        )
        if len(results) >= limit:
            break
    results.sort(key=lambda x: x["score"], reverse=True)
    return results
