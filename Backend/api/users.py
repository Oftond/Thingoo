from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserOut, ChangePasswordRequest
import logging
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")
router = APIRouter(prefix="/api/v1/users", tags=["Users"])

@router.get("/", response_model=list[UserOut])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    return user

@router.post("/{user_id}/change-password")
def change_password(
    user_id: str,
    request: ChangePasswordRequest,  # Используем правильную схему!
    db: Session = Depends(get_db)
):
    print(f"Password change requested for user: {user_id}")
    
    # Получаем пользователя
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        print(f"User not found: {user_id}")
        raise HTTPException(404, "User not found")

    # Проверяем текущий пароль
    if not pwd_context.verify(request.current_password, user.password_hash):
        print(f"Invalid current password for user: {user_id}")
        raise HTTPException(400, "Current password is incorrect")

    # Проверяем, что новый пароль отличается от текущего
    if pwd_context.verify(request.new_password, user.password_hash):
        print(f"New password same as current for user: {user_id}")
        raise HTTPException(400, "New password must be different from current")

    # Обновляем пароль
    user.password_hash = pwd_context.hash(request.new_password)
    db.commit()

    print(f"Password updated successfully for user: {user_id}")
    return {"msg": "Password updated successfully"}