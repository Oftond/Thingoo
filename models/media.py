"""Media model — table media."""
from sqlalchemy import Column, String, Text, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from models.base import Base


class Media(Base):
    __tablename__ = "media"

    id = Column(UUID(as_uuid=True), primary_key=True)
    entity_type = Column(String(50), nullable=True)
    entity_id = Column(UUID(as_uuid=True), nullable=True)
    file_path = Column(Text, nullable=True)
    file_type = Column(String(20), nullable=True)
    uploaded_at = Column(TIMESTAMP, nullable=True)
