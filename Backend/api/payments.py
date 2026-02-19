from uuid import UUID as UUID_t
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, FastAPI
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models import Payment, User, RentalRequest, Item
from email_service import send_payment_email
from uuid import uuid4

from schemas import (
    PaymentCreate,
    PaymentRead,
    PaymentStatus
)

router = APIRouter(prefix="/api/v1/payments", tags=["Payments"])

def _get_payment_or_404(payment_id: UUID_t, db: Session) -> Payment:
    stmt = select(Payment).where(Payment.id == payment_id)
    payment = db.execute(stmt).scalar_one_or_none()
    if payment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found",
        )
    return payment

# ---------- Payments ----------
@router.post("/", response_model=PaymentRead, status_code=status.HTTP_201_CREATED)
async def create_payment(
    data: PaymentCreate,
    db: Session = Depends(get_db),
) -> PaymentRead:
    user = db.query(User).filter(User.id == data.user_id).first()
    if not user:
        raise HTTPException(404, "User not found")

    request = db.query(RentalRequest).filter(RentalRequest.id == data.request_id).first()
    if not request or request.user_id != data.user_id:
        raise HTTPException(400, "Invalid rental request")

    item = db.query(Item).filter(Item.id == request.item_id).first()
    if not item:
        raise HTTPException(404, "Item not found")

    payment = Payment(
        id=uuid4(),
        user_id=data.user_id,
        request_id=data.request_id,
        amount=data.amount,
        status=data.status,
        created_at=datetime.utcnow(),
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)

    try:
        await send_payment_email(
            to=[user.email],
            amount=float(data.amount),
            item_title=item.title or "Без названия"
        )
    except Exception as e:
        print(f"Email error: {e}")

    return payment

@router.get("/{payment_id}", response_model=PaymentRead)
def get_payment(
    payment_id: UUID_t,
    db: Session = Depends(get_db),
) -> PaymentRead:
    payment = _get_payment_or_404(payment_id, db)
    return payment

@router.get("/users/{user_id}/payments", response_model=list[PaymentRead])
def get_user_payments(
    user_id: UUID_t,
    db: Session = Depends(get_db),
) -> list[PaymentRead]:
    # Убедимся, что пользователь существует (не обязательно, по желанию)
    user_stmt = select(User).where(User.id == user_id)
    user = db.execute(user_stmt).scalar_one_or_none()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    stmt = (
        select(Payment)
        .where(Payment.user_id == user_id)
        .order_by(Payment.created_at.desc().nullslast())
    )
    payments = db.execute(stmt).scalars().all()
    return payments

@router.patch("/{payment_id}/confirm", response_model=PaymentStatus)
def confirm_payment(
    payment_id: UUID_t,
    db: Session = Depends(get_db),
) -> PaymentStatus:
    payment = _get_payment_or_404(payment_id, db)
    payment.status = "confirmed"
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return PaymentStatus(id=payment.id, status=payment.status)