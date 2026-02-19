"""Маршруты для payments."""
from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models import Payment, User
from schemas import PaymentCreate, PaymentRead, PaymentStatus

router = APIRouter(tags=["payments"])


def _get_payment_or_404(payment_id: UUID, db: Session) -> Payment:
    stmt = select(Payment).where(Payment.id == payment_id)
    payment = db.execute(stmt).scalar_one_or_none()
    if payment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found",
        )
    return payment


@router.post(
    "/payments",
    response_model=PaymentRead,
    status_code=status.HTTP_201_CREATED,
)
def create_payment(
    data: PaymentCreate,
    db: Session = Depends(get_db),
) -> PaymentRead:
    payment = Payment(
        user_id=data.user_id,
        request_id=data.request_id,
        amount=data.amount,
        status=data.status,
        created_at=datetime.utcnow(),
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


@router.get("/payments/{payment_id}", response_model=PaymentRead)
def get_payment(
    payment_id: UUID,
    db: Session = Depends(get_db),
) -> PaymentRead:
    payment = _get_payment_or_404(payment_id, db)
    return payment


@router.get("/users/{user_id}/payments", response_model=list[PaymentRead])
def get_user_payments(
    user_id: UUID,
    db: Session = Depends(get_db),
) -> list[PaymentRead]:
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


@router.patch("/payments/{payment_id}/confirm", response_model=PaymentStatus)
def confirm_payment(
    payment_id: UUID,
    db: Session = Depends(get_db),
) -> PaymentStatus:
    payment = _get_payment_or_404(payment_id, db)
    payment.status = "confirmed"
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return PaymentStatus(id=payment.id, status=payment.status)

