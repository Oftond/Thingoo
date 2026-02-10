from sqlalchemy import (
    create_engine,
    Column,
    String,
    Text,
    Integer,
    TIMESTAMP,
    ForeignKey,
    text,
)
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.dialects.postgresql import UUID
import os
from dotenv import load_dotenv
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, echo=True)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(Text, nullable=False)
    role_id = Column(Integer, ForeignKey("role.id"), nullable=False)
    failed_login_attempts = Column(Integer)
    created_at = Column(TIMESTAMP)

Session = sessionmaker(bind=engine)
session = Session()

result = session.execute(text("SELECT 1"))
print("DB ping:", result.scalar())

users = session.query(User).all()
print("Users:", users)

session.close()
