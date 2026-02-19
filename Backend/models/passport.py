"""Passport model — table passports."""
from sqlalchemy import Column, String, Text, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from models.base import Base


class Passport(Base):
    __tablename__ = "passports"

    id = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, unique=True)
    series = Column(String(4), nullable=True)
    number = Column(String(6), nullable=True)
    issued_by = Column(Text, nullable=True)
    issue_date = Column(Date, nullable=True)

    user = relationship("User", backref="passport")
