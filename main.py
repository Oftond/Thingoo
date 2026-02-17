"""FastAPI-приложение с роутами аренды и оплат."""
from uuid import UUID as UUID_t
from datetime import datetime

from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from database import get_db
from models import RentalRequest, Payment, User
from schemas import (
    RentalRequestCreate,
    RentalRequestRead,
    RentalRequestUpdateStatus,
    RentalRequestStatus,
    PaymentCreate,
    PaymentRead,
    PaymentStatus,
)

app = FastAPI(title="Rent Service API")


def _get_rental_request_or_404(
    rental_request_id: UUID_t, db: Session
) -> RentalRequest:
    stmt = select(RentalRequest).where(RentalRequest.id == rental_request_id)
    rental_request = db.execute(stmt).scalar_one_or_none()
    if rental_request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rental request not found",
        )
    return rental_request


def _get_payment_or_404(payment_id: UUID_t, db: Session) -> Payment:
    stmt = select(Payment).where(Payment.id == payment_id)
    payment = db.execute(stmt).scalar_one_or_none()
    if payment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found",
        )
    return payment


# ---------- Rental requests ----------


@app.post(
    "/rental-requests",
    response_model=RentalRequestRead,
    status_code=status.HTTP_201_CREATED,
)
def create_rental_request(
    data: RentalRequestCreate, db: Session = Depends(get_db)
) -> RentalRequestRead:
    rental_request = RentalRequest(
        item_id=data.item_id,
        user_id=data.user_id,
        start_date=data.start_date,
        end_date=data.end_date,
        status=data.status,
        created_at=datetime.utcnow(),
    )
    db.add(rental_request)
    db.commit()
    db.refresh(rental_request)
    return rental_request


@app.get("/rental-requests", response_model=list[RentalRequestRead])
def list_rental_requests(db: Session = Depends(get_db)) -> list[RentalRequestRead]:
    stmt = select(RentalRequest).order_by(RentalRequest.created_at.desc().nullslast())
    requests = db.execute(stmt).scalars().all()
    return requests


@app.get("/rental-requests/{rental_request_id}", response_model=RentalRequestRead)
def get_rental_request(
    rental_request_id: UUID_t, db: Session = Depends(get_db)
) -> RentalRequestRead:
    rental_request = _get_rental_request_or_404(rental_request_id, db)
    return rental_request


@app.patch(
    "/rental-requests/{rental_request_id}",
    response_model=RentalRequestRead,
)
def update_rental_request_status(
    rental_request_id: UUID_t,
    data: RentalRequestUpdateStatus,
    db: Session = Depends(get_db),
) -> RentalRequestRead:
    rental_request = _get_rental_request_or_404(rental_request_id, db)
    rental_request.status = data.status
    db.add(rental_request)
    db.commit()
    db.refresh(rental_request)
    return rental_request


@app.get(
    "/rental-requests/{rental_request_id}/status",
    response_model=RentalRequestStatus,
)
def get_rental_request_status(
    rental_request_id: UUID_t, db: Session = Depends(get_db)
) -> RentalRequestStatus:
    rental_request = _get_rental_request_or_404(rental_request_id, db)
    return RentalRequestStatus(id=rental_request.id, status=rental_request.status)


# ---------- Payments ----------


@app.post(
    "/payments",
    response_model=PaymentRead,
    status_code=status.HTTP_201_CREATED,
)
def create_payment(
    data: PaymentCreate,
    db: Session = Depends(get_db),
) -> PaymentRead:
    # опционально можно проверить существование пользователя / заявки
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


@app.get("/payments/{payment_id}", response_model=PaymentRead)
def get_payment(
    payment_id: UUID_t,
    db: Session = Depends(get_db),
) -> PaymentRead:
    payment = _get_payment_or_404(payment_id, db)
    return payment


@app.get("/users/{user_id}/payments", response_model=list[PaymentRead])
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


@app.patch("/payments/{payment_id}/confirm", response_model=PaymentStatus)
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

