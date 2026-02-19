from fastapi import APIRouter, File, UploadFile, HTTPException, Query
from fastapi.responses import StreamingResponse
from models.mongoDB import media_collection
from bson import ObjectId
from datetime import datetime
import io

router = APIRouter(prefix="/api/v1/media", tags=["Media"])

@router.post("/items/{item_id}/photos")
async def upload_item_photo(item_id: str, file: UploadFile = File(...),is_primary: bool = Query(False)):
    """Загрузить фото для предмета"""
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "Only image files are allowed")

    contents = await file.read()
    
    photo_doc = {
        "entity_type": "item",
        "entity_id": item_id,
        "file_name": file.filename,
        "content_type": file.content_type,
        "data": contents,
        "size": len(contents),
        "is_primary": is_primary,
        "uploaded_at": datetime.utcnow()
    }

    result = await media_collection.insert_one(photo_doc)
    
    return {
        "id": str(result.inserted_id),
        "entity_id": item_id,
        "file_name": file.filename,
        "is_primary": is_primary
    }

@router.get("/items/{item_id}/photos")
async def get_item_photos(item_id: str):
    """Получить все фото для объекта (только метаданные)"""
    cursor = media_collection.find(
        {"entity_type": "item", "entity_id": item_id},
        {"data": 0})
    photos = []
    async for doc in cursor:
        photos.append({
            "id": str(doc["_id"]),
            "file_name": doc["file_name"],
            "content_type": doc["content_type"],
            "size": doc["size"],
            "is_primary": doc["is_primary"],
            "uploaded_at": doc["uploaded_at"].isoformat()
        })
    return photos

@router.get("/photos/{photo_id}")
async def get_photo_by_id(photo_id: str):
    """Получить фото по ID"""
    try:
        doc = await media_collection.find_one({"_id": ObjectId(photo_id)})
    except Exception:
        raise HTTPException(400, "Invalid photo ID")

    if not doc:
        raise HTTPException(404, "Photo not found")

    return StreamingResponse(
        io.BytesIO(doc["data"]),
        media_type=doc["content_type"]
    )