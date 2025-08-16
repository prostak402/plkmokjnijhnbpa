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

## Database Schema

The backend uses PostgreSQL with SQLAlchemy and Alembic for migrations. The core tables are:

- **users** – application users (`id`, `username`).
- **films** – films indexed by Kinopoisk (`id`, `kinopoisk_id`, `metadata`).
- **clips** – user submitted film clips (`id`, `film_id`, `user_id`, `title`). Clip IDs are unique.
- **bookmarks** – mapping of users to bookmarked clips (`id`, `user_id`, `clip_id`).
- **likes** – mapping of users to liked clips (`id`, `user_id`, `clip_id`).
- **comments** – user comments on clips (`id`, `user_id`, `clip_id`, `text`).
- **genre_preferences** – preferred genres for each user (`id`, `user_id`, `genre`).
- **views** – records of clip views (`id`, `user_id`, `clip_id`).
- **clicks** – records of clip clicks (`id`, `user_id`, `clip_id`).

Foreign keys connect clips to films and users, and link interactions back to the originating user and clip.

Run migrations and seed data:

```bash
alembic upgrade head
python app/seed.py
```
