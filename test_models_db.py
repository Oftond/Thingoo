"""Test that all models work with the existing DB (read-only checks)."""
import os
from pathlib import Path
from dotenv import load_dotenv

for p in (Path(__file__).parent / ".env", Path(__file__).parent / ".venv" / ".env"):
    if p.exists():
        load_dotenv(p)
        break
else:
    load_dotenv()

from sqlalchemy import text
from database import engine, SessionLocal
from models import (
    Base,
    Role,
    User,
    Passport,
    Item,
    RentalRequest,
    Payment,
    Media,
    Notification,
    Feedback,
)


def test_connection():
    """Test DB connection."""
    with engine.connect() as conn:
        r = conn.execute(text("SELECT 1"))
        assert r.scalar() == 1
    print("OK: connection")


def test_tables_exist():
    """Check that all expected tables exist."""
    with engine.connect() as conn:
        r = conn.execute(
            text(
                """
            SELECT table_name FROM information_schema.tables
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
            ORDER BY table_name
            """
            )
        )
        tables = {row[0] for row in r}
    expected = {
        "roles",
        "users",
        "passports",
        "payments",
        "items",
        "rental_requests",
        "media",
        "notifications",
        "feedback",
    }
    assert expected <= tables, f"Missing tables: {expected - tables}"
    print("OK: all expected tables exist", sorted(tables))


def test_models_query():
    """Query each model (no writes)."""
    session = SessionLocal()
    try:
        roles = session.query(Role).limit(5).all()
        print("OK: Role", len(roles), "rows")

        users = session.query(User).limit(5).all()
        print("OK: User", len(users), "rows")

        passports = session.query(Passport).limit(5).all()
        print("OK: Passport", len(passports), "rows")

        items = session.query(Item).limit(5).all()
        print("OK: Item", len(items), "rows")

        rental_requests = session.query(RentalRequest).limit(5).all()
        print("OK: RentalRequest", len(rental_requests), "rows")

        payments = session.query(Payment).limit(5).all()
        print("OK: Payment", len(payments), "rows")

        media = session.query(Media).limit(5).all()
        print("OK: Media", len(media), "rows")

        notifications = session.query(Notification).limit(5).all()
        print("OK: Notification", len(notifications), "rows")

        feedback = session.query(Feedback).limit(5).all()
        print("OK: Feedback", len(feedback), "rows")
    finally:
        session.close()


def test_user_role_relationship():
    """Test User -> Role relationship (FK to roles.id)."""
    session = SessionLocal()
    try:
        users = session.query(User).limit(3).all()
        for u in users:
            _ = u.role_id
            r = u.role  # relationship
            if r:
                assert hasattr(r, "name")
                print("  User", u.email, "-> Role", r.name)
        print("OK: User.role relationship")
    finally:
        session.close()


if __name__ == "__main__":
    print("Testing models with DB (DATABASE_URL from .env)...")
    test_connection()
    test_tables_exist()
    test_models_query()
    test_user_role_relationship()
    print("\nAll tests passed.")
