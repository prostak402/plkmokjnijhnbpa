"""Seed initial data for testing."""

from .db import SessionLocal
from . import models


def seed() -> None:
    db = SessionLocal()
    try:
        # Users
        alice = models.User(username="alice")
        bob = models.User(username="bob")
        db.add_all([alice, bob])
        db.flush()

        # Films
        film1 = models.Film(kinopoisk_id=100, data={"title": "Film 100"})
        film2 = models.Film(kinopoisk_id=200, data={"title": "Film 200"})
        db.add_all([film1, film2])
        db.flush()

        # Clips
        clip1 = models.Clip(film=film1, user=alice, title="Clip 1")
        clip2 = models.Clip(film=film2, user=bob, title="Clip 2")
        db.add_all([clip1, clip2])
        db.flush()

        # Interactions
        db.add(models.Bookmark(user=alice, clip=clip2))
        db.add(models.Like(user=bob, clip=clip1))
        db.add(models.Comment(user=bob, clip=clip1, text="Great clip!"))

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()

