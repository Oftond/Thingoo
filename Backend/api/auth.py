from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database import get_db
from models import User, Passport, Role
from schemas import UserRegister, UserLogin
from uuid import uuid4
from email_service import send_email

pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")
router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])

@router.post("/register")
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
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

    await send_email(
        to=[user_data.email],
        subject="Добро пожаловать в Thingoo!",
        body=f"<h1>Привет, {user_data.full_name}!</h1><p>Вы успешно зарегистрировались на сайте Thingoo. Вы можете арендовать самые разные вещи на этом прекрасном сайте! Или, если захотите, можете сами выставить для аренды что нибудь свое.</p>"
    )
    return {"msg": "User created successfully"}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password_hash):
        raise HTTPException(401, "Invalid credentials")
    return {"msg": "Logged in"}