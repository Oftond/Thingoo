"""drop_media_table

Revision ID: 7848abe39699
Revises: 6872f212ed16
Create Date: 2026-02-13 12:21:45.481561

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


# revision identifiers, used by Alembic.
revision: str = '7848abe39699'
down_revision: Union[str, Sequence[str], None] = '6872f212ed16'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Drop media table."""
    op.drop_table("media")


def downgrade() -> None:
    """Recreate media table."""
    op.create_table(
        "media",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("entity_type", sa.String(50), nullable=True),
        sa.Column("entity_id", UUID(as_uuid=True), nullable=True),
        sa.Column("file_path", sa.Text(), nullable=True),
        sa.Column("file_type", sa.String(20), nullable=True),
        sa.Column("uploaded_at", sa.TIMESTAMP(), nullable=True),
    )
