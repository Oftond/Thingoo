from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Feedback, User
from schemas import FeedbackCreate, FeedbackOut
from uuid import uuid4
from datetime import datetime

router = APIRouter(prefix="/api/v1/feedback", tags=["Feedback"])

@router.post("/", response_model=FeedbackOut)
def create_feedback(feedback: FeedbackCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == feedback.user_id).first()
    if not user:
        raise HTTPException(404, "User not found")

    db_feedback = Feedback(
        id=uuid4(),
        user_id=feedback.user_id,
        rating=feedback.rating,
        comment=feedback.comment,
        created_at=datetime.utcnow()
    )

    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

@router.get("/items/{item_id}")
def get_item_feedback(item_id: str, db: Session = Depends(get_db)):
    #TODO Здесь нужно JOIN с rental_requests, чтобы связать item_id с feedback
    return {"msg": "Not implemented yet"}

@router.get("/users/{user_id}")
def get_user_feedback(user_id: str, db: Session = Depends(get_db)):
    return db.query(Feedback).filter(Feedback.user_id == user_id).all()