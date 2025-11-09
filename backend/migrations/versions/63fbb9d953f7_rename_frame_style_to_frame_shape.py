"""rename_frame_style_to_frame_shape

Revision ID: 63fbb9d953f7
Revises: a0ead778642b
Create Date: 2025-11-05 15:37:43.451036

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '63fbb9d953f7'
down_revision = 'a0ead778642b'
branch_labels = None
depends_on = None


def upgrade():
    # Rename frame_style to frame_shape in products table
    op.alter_column('products', 'frame_style', new_column_name='frame_shape')


def downgrade():
    # Revert: Rename frame_shape back to frame_style
    op.alter_column('products', 'frame_shape', new_column_name='frame_style')
