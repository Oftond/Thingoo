"""fix items.id default

Revision ID: 4fa485c1098e
Revises: 3aca4c846f86
Create Date: 2026-02-19 14:12:26.821195

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4fa485c1098e'
down_revision: Union[str, Sequence[str], None] = '3aca4c846f86'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
