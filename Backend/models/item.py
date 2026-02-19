"""Item model — table items."""
from sqlalchemy import Column, String, Text, Numeric, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from models.base import Base


class Item(Base):
    __tablename__ = "items"

    id = Column(UUID(as_uuid=True), primary_key=True)
    title = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    price_per_day = Column(Numeric, nullable=True)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    status = Column(String(20), nullable=True)
    # created_at not in introspection; skip if missing

    owner = relationship("User", backref="items")
