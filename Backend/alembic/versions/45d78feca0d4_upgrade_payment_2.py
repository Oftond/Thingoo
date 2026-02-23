"""upgrade payment 2

Revision ID: 45d78feca0d4
Revises: 6f0d2819c835
Create Date: 2026-02-23 11:20:51.129203

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '45d78feca0d4'
down_revision: Union[str, Sequence[str], None] = '6f0d2819c835'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    op.drop_column('payments', 'user_id')
    op.drop_column('payments', 'request_id')
    op.drop_column('payments', 'created_at')