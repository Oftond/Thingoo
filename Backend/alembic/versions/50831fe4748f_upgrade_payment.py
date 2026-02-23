"""upgrade payment

Revision ID: 50831fe4748f
Revises: cbec6a699d53
Create Date: 2026-02-23 00:17:22.350568

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


# revision identifiers, used by Alembic.
revision: str = '50831fe4748f'
down_revision: Union[str, Sequence[str], None] = 'cbec6a699d53'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('payments', sa.Column('item_id', UUID(as_uuid=True), sa.ForeignKey('items.id'), nullable=False))
    op.add_column('payments', sa.Column('renter_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False))
    op.add_column('payments', sa.Column('method', sa.String(50), nullable=False))
    op.add_column('payments', sa.Column('rental_days', sa.Integer(), nullable=False))
    op.add_column('payments', sa.Column('insurance', sa.Numeric(), nullable=False))
    op.add_column('payments', sa.Column('delivery', sa.Numeric(), nullable=False))
    op.alter_column('payments', 'status', server_default='pending')


def downgrade() -> None:
    op.drop_column('payments', 'item_id')
    op.drop_column('payments', 'renter_id')
    op.drop_column('payments', 'method')
    op.drop_column('payments', 'rental_days')
    op.drop_column('payments', 'insurance')
    op.drop_column('payments', 'delivery')
    op.alter_column('payments', 'status', server_default=None)
