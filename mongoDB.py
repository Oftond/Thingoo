from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import base64
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

client = AsyncIOMotorClient(os.getenv("MONGO_URL"))
db = client.test_db

async def upload_image():
    with open('test.jpg', "rb") as f:
        image_data = f.read()
        image_doc = {
            "fileName" : "photo_test.jpg",
            "data" : image_data,
            "size" : len(image_data),
            "upload" : datetime.now()
        }
        result = await db.test_collection.insert_one(image_doc)

    print(result)

async def read_image():
    received_image = await db.test_collection.find_one({"fileName" : "photo_test.jpg"})
    with open("new_test_image.jpg", "wb") as f:
        f.write(received_image["data"])

# asyncio.run(upload_image())
asyncio.run(read_image())