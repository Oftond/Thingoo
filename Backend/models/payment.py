"""Payment model — table payments."""
from sqlalchemy import Column, String, Numeric, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from models.base import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    request_id = Column(UUID(as_uuid=True), ForeignKey("rental_requests.id"), nullable=True)
    amount = Column(Numeric, nullable=True)
    status = Column(String(20), nullable=True)
    created_at = Column(TIMESTAMP, nullable=True)

    user = relationship("User", backref="payments")
    rental_request = relationship("RentalRequest", backref="payments")
