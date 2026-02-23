# api/payments.py
from uuid import UUID as UUID_t
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import select
from database import get_db
from models import Payment, User, RentalRequest, Item
from uuid import uuid4
from email_service import (
    send_payment_created_email,
    send_new_rental_notification_to_owner
)
from schemas import (
    PaymentCreate,
    PaymentRead,
    PaymentStatus,
    PaymentOut
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
@router.post("/", response_model=PaymentOut)
async def create_payment(
    payment_data: PaymentCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # Проверяем существование товара
    item = db.query(Item).filter(Item.id == payment_data.item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Получаем данные пользователей
    owner = db.query(User).filter(User.id == item.owner_id).first()
    renter = db.query(User).filter(User.id == payment_data.renter_id).first()
    
    if not owner or not renter:
        raise HTTPException(status_code=404, detail="User not found")

    # Создаём платеж
    db_payment = Payment(
        id=uuid4(),
        item_id=payment_data.item_id,
        renter_id=payment_data.renter_id,
        amount=payment_data.amount,
        method=payment_data.method,
        status="pending",
        created_at=datetime.utcnow(),
        rental_days=payment_data.rental_days,
        insurance=payment_data.insurance,
        delivery=payment_data.delivery
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)

    # Отправляем email уведомления
    background_tasks.add_task(
        send_payment_created_email,
        to=[renter.email],
        amount=float(payment_data.amount),
        item_title=item.title
    )
    
    background_tasks.add_task(
        send_new_rental_notification_to_owner,
        to=[owner.email],
        renter_name=renter.full_name,
        item_title=item.title
    )

    return db_payment



# @router.post("/", response_model=PaymentOut)
# async def create_payment(
#     payment_data: PaymentCreate,
#     background_tasks: BackgroundTasks,
#     db: Session = Depends(get_db)
# ):
#     # Получаем информацию о товаре и владельце
#     item = db.query(Item).filter(Item.id == str(payment_data.itemId)).first()
#     if not item:
#         raise HTTPException(status_code=404, detail="Item not found")
    
#     owner = db.query(User).filter(User.id == str(item.owner_id)).first()
#     renter = db.query(User).filter(User.id == str(payment_data.renterId)).first()
    
#     if not renter:
#         raise HTTPException(status_code=404, detail="Renter not found")
    
#     if not owner:
#         raise HTTPException(status_code=404, detail="Owner not found")
    
#     # Создаем платеж
#     db_payment = Payment(
#         id=uuid4(),
#         item_id=str(payment_data.itemId),
#         renter_id=str(payment_data.renterId),
#         amount=payment_data.amount,
#         method=payment_data.method,
#         status="pending",
#         rental_days=payment_data.rentalDays,
#         insurance=payment_data.insurance or 0,
#         delivery=payment_data.delivery or 0
#     )
#     db.add(db_payment)
#     db.commit()
#     db.refresh(db_payment)
    
#     # Отправляем email уведомления в фоне
#     background_tasks.add_task(
#         send_payment_created_email,
#         [renter.email],
#         payment_data.amount,
#         item.title
#     )
    
#     background_tasks.add_task(
#         send_new_rental_notification_to_owner,
#         [owner.email],
#         renter.full_name,
#         item.title
#     )
    
#     return db_payment

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
    # Убедимся, что пользователь существует
    user_stmt = select(User).where(User.id == str(user_id))
    user = db.execute(user_stmt).scalar_one_or_none()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    stmt = (
        select(Payment)
        .where(Payment.renter_id == str(user_id))
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