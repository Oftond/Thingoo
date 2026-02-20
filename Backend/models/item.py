"""Item model — table items."""
from sqlalchemy import Column, String, Text, Numeric, ForeignKey, TIMESTAMP, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from models.base import Base


class Item(Base):
    __tablename__ = "items"

    id = Column(UUID(as_uuid=True), primary_key=True)
    title = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    price_per_day = Column(Numeric, nullable=True)
    category = Column(String(50), nullable=True)
    location = Column(String(100), nullable=True)
    has_insurance = Column(Boolean, default=False)
    has_fast_delivery = Column(Boolean, default=False)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    status = Column(String(20), nullable=True)

    owner = relationship("User", backref="items")
