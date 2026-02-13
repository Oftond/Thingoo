"""RentalRequest model — table rental_requests."""
from sqlalchemy import Column, String, Date, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from models.base import Base


class RentalRequest(Base):
    __tablename__ = "rental_requests"

    id = Column(UUID(as_uuid=True), primary_key=True)
    item_id = Column(UUID(as_uuid=True), ForeignKey("items.id"), nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    status = Column(String(20), nullable=True)
    created_at = Column(TIMESTAMP, nullable=True)

    item = relationship("Item", backref="rental_requests")
    user = relationship("User", backref="rental_requests")
