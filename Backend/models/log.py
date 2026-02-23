# models.py
from sqlalchemy import Column, String, DateTime, JSON, Integer, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import uuid
from datetime import datetime

class Log(Base):
    __tablename__ = "logs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    action = Column(String, nullable=False)  # CREATE, UPDATE, DELETE, LOGIN, etc.
    entity_type = Column(String, nullable=False)  # User, Item, Payment, etc.
    entity_id = Column(String, nullable=True)
    old_values = Column(JSON, nullable=True)  # Старые значения (для UPDATE)
    new_values = Column(JSON, nullable=True)  # Новые значения (для CREATE/UPDATE)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    status = Column(String, nullable=False)  # SUCCESS, FAILURE
    error_message = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="logs")

# Добавьте связь в модель User
class User(Base):
    # ... существующие поля ...
    logs = relationship("Log", back_populates="user", order_by="Log.created_at.desc())