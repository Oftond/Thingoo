"""Payment model — table payments."""
from sqlalchemy import Column, String, Numeric, TIMESTAMP, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from models.base import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True)
    request_id = Column(UUID(as_uuid=True), ForeignKey("rental_requests.id"), nullable=True)
    amount = Column(Numeric, nullable=True)
    status = Column(String(20), default="pending")
    created_at = Column(TIMESTAMP, nullable=True)
    item_id = Column(UUID(as_uuid=True), ForeignKey("items.id"), nullable=False)
    renter_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    method = Column(String(50), nullable=False)
    rental_days = Column(Integer, nullable=False)
    insurance = Column(Numeric, nullable=False)
    delivery = Column(Numeric, nullable=False)

    rental_request = relationship("RentalRequest", backref="payments")