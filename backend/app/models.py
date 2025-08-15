"""ORM models for FilmClips."""

from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from .db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)

    clips = relationship("Clip", back_populates="user")
    bookmarks = relationship("Bookmark", back_populates="user")
    likes = relationship("Like", back_populates="user")
    comments = relationship("Comment", back_populates="user")
    genre_preferences = relationship("GenrePreference", back_populates="user")
    views = relationship("View", back_populates="user")
    clicks = relationship("Click", back_populates="user")


class Film(Base):
    __tablename__ = "films"

    id = Column(Integer, primary_key=True, index=True)
    kinopoisk_id = Column(Integer, nullable=False)
    data = Column("metadata", JSON)

    clips = relationship("Clip", back_populates="film")


class Clip(Base):
    __tablename__ = "clips"

    id = Column(Integer, primary_key=True, index=True)
    film_id = Column(Integer, ForeignKey("films.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String)

    film = relationship("Film", back_populates="clips")
    user = relationship("User", back_populates="clips")
    bookmarks = relationship("Bookmark", back_populates="clip")
    likes = relationship("Like", back_populates="clip")
    comments = relationship("Comment", back_populates="clip")

    __table_args__ = (UniqueConstraint("id", name="uq_clip_id"),)


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    clip_id = Column(Integer, ForeignKey("clips.id"), nullable=False)

    user = relationship("User", back_populates="bookmarks")
    clip = relationship("Clip", back_populates="bookmarks")


class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    clip_id = Column(Integer, ForeignKey("clips.id"), nullable=False)

    user = relationship("User", back_populates="likes")
    clip = relationship("Clip", back_populates="likes")


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    clip_id = Column(Integer, ForeignKey("clips.id"), nullable=False)
    text = Column(Text, nullable=False)

    user = relationship("User", back_populates="comments")
    clip = relationship("Clip", back_populates="comments")


class GenrePreference(Base):
    __tablename__ = "genre_preferences"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    genre = Column(String, nullable=False)

    user = relationship("User", back_populates="genre_preferences")


class View(Base):
    __tablename__ = "views"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    clip_id = Column(Integer, ForeignKey("clips.id"), nullable=False)

    user = relationship("User", back_populates="views")
    clip = relationship("Clip")


class Click(Base):
    __tablename__ = "clicks"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    clip_id = Column(Integer, ForeignKey("clips.id"), nullable=False)

    user = relationship("User", back_populates="clicks")
    clip = relationship("Clip")

