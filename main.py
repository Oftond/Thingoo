"""Entrypoint: DB ping and list users using shared models."""
from sqlalchemy import text
from database import engine, SessionLocal
from models import User

Session = SessionLocal()

result = Session.execute(text("SELECT 1"))
print("DB ping:", result.scalar())

users = Session.query(User).all()
print("Users:", users)

Session.close()
