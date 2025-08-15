"""initial tables

Revision ID: 0001
Revises: 
Create Date: 2024-05-10 00:00:00

"""
from alembic import op
import sqlalchemy as sa

revision = '0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('username', sa.String(), nullable=False, unique=True),
    )

    op.create_table(
        'films',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('kinopoisk_id', sa.Integer, nullable=False),
        sa.Column('metadata', sa.JSON(), nullable=True),
    )

    op.create_table(
        'clips',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('film_id', sa.Integer, sa.ForeignKey('films.id'), nullable=False),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('title', sa.String(), nullable=True),
        sa.UniqueConstraint('id', name='uq_clip_id'),
    )

    op.create_table(
        'bookmarks',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('clip_id', sa.Integer, sa.ForeignKey('clips.id'), nullable=False),
    )

    op.create_table(
        'likes',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('clip_id', sa.Integer, sa.ForeignKey('clips.id'), nullable=False),
    )

    op.create_table(
        'comments',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('clip_id', sa.Integer, sa.ForeignKey('clips.id'), nullable=False),
        sa.Column('text', sa.Text(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table('comments')
    op.drop_table('likes')
    op.drop_table('bookmarks')
    op.drop_table('clips')
    op.drop_table('films')
    op.drop_table('users')
