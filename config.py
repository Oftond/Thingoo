"""App config from environment."""
import os
from pathlib import Path
from dotenv import load_dotenv

for p in (Path(__file__).parent / ".env", Path(__file__).parent / ".venv" / ".env"):
    if p.exists():
        load_dotenv(p)
        break
else:
    load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set")
