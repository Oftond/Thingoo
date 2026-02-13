"""Role model — table roles."""
from sqlalchemy import Column, Integer, String
from models.base import Base


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
