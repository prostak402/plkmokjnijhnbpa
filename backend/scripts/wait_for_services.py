"""Utilities to wait until local infrastructure dependencies become available."""

from __future__ import annotations

import os
import sys
import time
from typing import Callable

import psycopg2
import redis

DEFAULT_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/filmclips"
DEFAULT_REDIS_URL = "redis://localhost:6379/0"


def wait_until(check: Callable[[], None], *, timeout: float = 60.0, name: str) -> None:
    """Run ``check`` until it succeeds or the timeout expires."""

    deadline = time.monotonic() + timeout
    attempt = 1
    while True:
        try:
            check()
            print(f"{name} is available", flush=True)
            return
        except Exception as exc:  # pylint: disable=broad-except
            if time.monotonic() >= deadline:
                raise RuntimeError(f"{name} did not become available") from exc
            print(
                f"Waiting for {name} (attempt {attempt}): {exc}",
                flush=True,
            )
            attempt += 1
            time.sleep(2)


def wait_for_postgres(url: str) -> None:
    """Attempt to establish a connection to PostgreSQL."""

    def check() -> None:
        conn = psycopg2.connect(url)
        conn.close()

    wait_until(check, name="PostgreSQL")


def wait_for_redis(url: str) -> None:
    """Attempt to ping Redis."""

    client = redis.Redis.from_url(url)

    def check() -> None:
        client.ping()

    wait_until(check, name="Redis")


def main() -> int:
    database_url = os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL)
    redis_url = os.getenv("REDIS_URL", DEFAULT_REDIS_URL)

    print("Checking dependent services...", flush=True)
    wait_for_postgres(database_url)
    wait_for_redis(redis_url)
    return 0


if __name__ == "__main__":
    sys.exit(main())
