from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Item
from schemas import ItemCreate, ItemOut
from models import User
from uuid import uuid4

router = APIRouter(prefix="/api/v1/items", tags=["Items"])

@router.get("/", response_model=list[ItemOut])
def get_items(
    db: Session = Depends(get_db),
    exclude_owner_id: str = Query(None, description="Исключить объявления пользователя")
):
    query = db.query(Item)
    if exclude_owner_id:
        query = query.filter(Item.owner_id != exclude_owner_id)
    return query.all()

@router.get("/{item_id}", response_model=ItemOut)
def get_item(item_id: str, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.post("/", response_model=ItemOut)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    db_item = Item(
        id=uuid4(),
        title=item.title,
        description=item.description,
        price_per_day=item.price_per_day,
        owner_id=item.owner_id,
        status="available",
        category=item.category,
        location=item.location,
        has_insurance=item.has_insurance,
        has_fast_delivery=item.has_fast_delivery
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/users/{userId}", response_model=list[ItemOut])
def get_user_items(userId: str, db: Session = Depends(get_db)):
    return db.query(Item).filter(Item.owner_id == userId).all()