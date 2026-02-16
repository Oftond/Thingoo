from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import base64
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

client = AsyncIOMotorClient(os.getenv("MONGO_URL"))
db = client[os.getenv("MONGO_DB_NAME", "rental_db")]

media_collection = db["media"]