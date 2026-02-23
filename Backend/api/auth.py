from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database import get_db
from models import User, Passport, Role, PasswordResetToken
from schemas import UserRegister, UserLogin, UserOut, ForgotPasswordRequest, ResetPasswordRequest
from uuid import uuid4
from datetime import datetime, timedelta
import secrets
import os
from email_service import send_password_reset_email 

pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")
router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])

@router.post("/register")
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    print("Register success!!")
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(400, "Email already registered")

    user_role = db.query(Role).filter(Role.name == "USER").first()
 
    if not user_role:
        raise HTTPException(500, "Role 'USER' not found in database")

    hashed = pwd_context.hash(user_data.password[:72])

    db_user = User(
        id=uuid4(),
        full_name=user_data.full_name,
        city=user_data.city,
        email=user_data.email,
        password_hash=hashed,
        role_id=user_role.id
    )
    db.add(db_user)
    db.flush()

    db_passport = Passport(
        id=uuid4(),
        user_id=db_user.id,
        series=user_data.passport_series,
        number=user_data.passport_number,
        issued_by=user_data.passport_issued_by,
        issue_date=user_data.passport_issue_date
    )
    db.add(db_passport)

    db.commit()

    return {"msg": "User created successfully"}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    print("Login success")
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password_hash):
        raise HTTPException(401, "Invalid credentials")

    role_name = None
    if db_user.role:
        role_name = db_user.role.name
        print(f"User role from DB: {role_name}")
    else:
        print(f"User has no role assigned: {user.email}")

    return {
        "is_admin": role_name,
        "user": db_user.__dict__
    }

reset_tokens = {}

@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    email = request.email
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return {"msg": "If email exists, reset link was sent"}

    # Генерируем токен
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(minutes=15)  # 15 минут

    # Сохраняем в памяти
    reset_tokens[token] = {"user_id": user.id, "expires_at": expires_at}

    # Отправляем письмо
    reset_link = f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/reset-password?token={token}"
    await send_password_reset_email([email], reset_link)

    return {"msg": "Reset email sent"}

@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    token = request.token
    new_password = request.newPassword

    if token not in reset_tokens:
        raise HTTPException(400, "Недействительный или просроченный токен")

    data = reset_tokens[token]
    if datetime.utcnow() > data["expires_at"]:
        del reset_tokens[token]
        raise HTTPException(400, "Недействительный или просроченный токен")

    # Обновляем пароль
    hashed = pwd_context.hash(new_password[:72])
    db.query(User).filter(User.id == data["user_id"]).update({"password_hash": hashed})
    db.commit()

    # Удаляем токен
    del reset_tokens[token]

    return {"msg": "Password updated successfully"}