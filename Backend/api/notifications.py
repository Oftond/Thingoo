# api/notifications.py
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, List
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv
from email_service import (
    send_welcome_email,
    send_password_reset_email,
    send_payment_created_email,
    send_payment_confirmed_email,
    send_new_rental_notification_to_owner,
    send_new_message_notification,
    send_review_notification,
    send_password_changed_email
)

load_dotenv()

router = APIRouter(prefix="/api/v1/notifications", tags=["Notifications"])

# Модели для каждого типа уведомлений (правильные названия полей)

class PasswordChangedRequest(BaseModel):
    to: List[EmailStr]
    userName: str

class WelcomeEmailRequest(BaseModel):
    to: List[EmailStr]
    name: str

class PasswordResetRequest(BaseModel):
    to: List[EmailStr]
    resetToken: str

class NewMessageRequest(BaseModel):
    to: List[EmailStr]
    senderName: str
    messagePreview: str

class NewRentalRequest(BaseModel):
    to: List[EmailStr]
    ownerName: str
    renterName: str
    itemName: str

class RentalConfirmedRequest(BaseModel):
    to: List[EmailStr]
    renterName: str
    ownerName: str
    itemName: str
    dates: str

class PaymentSuccessRequest(BaseModel):
    to: List[EmailStr]
    amount: float
    itemName: str

class NewReviewRequest(BaseModel):
    to: List[EmailStr]
    reviewerName: str
    rating: str

# Универсальный endpoint (опционально)
class EmailRequest(BaseModel):
    to: List[EmailStr]
    template: str
    data: Dict[str, Any]

# Настройки SMTP (если нужны для прямых отправок)
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USER)

# Эндпоинты для каждого типа уведомлений
@router.post("/welcome")
async def send_welcome(request: WelcomeEmailRequest, background_tasks: BackgroundTasks):
    """Отправка приветственного письма"""
    try:
        await send_welcome_email(
            to=request.to,
            full_name=request.name
        )
        return {"status": "success", "message": "Welcome email sent"}
    except Exception as e:
        print(f"❌ Email error: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email")

@router.post("/password-reset")
async def send_password_reset(request: PasswordResetRequest, background_tasks: BackgroundTasks):
    """Отправка письма для сброса пароля"""
    try:
        await send_password_reset_email(
            to=request.to,
            reset_token=request.resetToken
        )
        return {"status": "success", "message": "Password reset email sent"}
    except Exception as e:
        print(f"❌ Email error: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email")

@router.post("/password-changed")
async def send_password_changed(request: PasswordChangedRequest, background_tasks: BackgroundTasks):
    """Отправка уведомления об успешной смене пароля"""
    try:
        await send_password_changed_email(
            to=request.to,
            user_name=request.userName
        )
        return {"status": "success", "message": "Password changed notification sent"}
    except Exception as e:
        print(f"❌ Email error: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email")

@router.post("/new-message")
async def send_new_message(request: NewMessageRequest, background_tasks: BackgroundTasks):
    """Отправка уведомления о новом сообщении"""
    try:
        await send_new_message_notification(
            to=request.to,
            sender_name=request.senderName,
            message_preview=request.messagePreview
        )
        return {"status": "success", "message": "New message notification sent"}
    except Exception as e:
        print(f"❌ Email error: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email")

@router.post("/new-rental")
async def send_new_rental(request: NewRentalRequest, background_tasks: BackgroundTasks):
    """Отправка уведомления о новой аренде"""
    try:
        await send_new_rental_notification_to_owner(
            to=request.to,
            renter_name=request.renterName,
            item_title=request.itemName
        )
        return {"status": "success", "message": "New rental notification sent"}
    except Exception as e:
        print(f"❌ Email error: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email")

@router.post("/rental-confirmed")
async def send_rental_confirmed(request: RentalConfirmedRequest, background_tasks: BackgroundTasks):
    """Отправка уведомления о подтверждении аренды"""
    try:
        await send_payment_confirmed_email(
            to=request.to,
            amount=0,  # Если нужно передавать сумму
            item_title=request.itemName,
            owner_name=request.ownerName
        )
        return {"status": "success", "message": "Rental confirmed notification sent"}
    except Exception as e:
        print(f"❌ Email error: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email")

@router.post("/payment-success")
async def send_payment_success(request: PaymentSuccessRequest, background_tasks: BackgroundTasks):
    """Отправка уведомления об успешной оплате"""
    try:
        await send_payment_created_email(
            to=request.to,
            amount=request.amount,
            item_title=request.itemName
        )
        return {"status": "success", "message": "Payment success notification sent"}
    except Exception as e:
        print(f"❌ Email error: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email")

@router.post("/new-review")
async def send_new_review(request: NewReviewRequest, background_tasks: BackgroundTasks):
    """Отправка уведомления о новом отзыве"""
    try:
        await send_review_notification(
            to=request.to,
            reviewer_name=request.reviewerName,
            rating=int(request.rating)
        )
        return {"status": "success", "message": "New review notification sent"}
    except Exception as e:
        print(f"❌ Email error: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email")