"""Notification model — table notifications."""
from sqlalchemy import Column, String, Text, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from models.base import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    type = Column(String(20), nullable=True)
    message = Column(Text, nullable=True)
    sent = Column(Boolean, nullable=True)
    created_at = Column(TIMESTAMP, nullable=True)

    user = relationship("User", backref="notifications")
