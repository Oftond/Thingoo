"""Pydantic-схемы для API."""
from __future__ import annotations
from pydantic import BaseModel, Field
from typing import Optional, List
from decimal import Decimal
from datetime import date, datetime
from uuid import UUID

# --------- Rental requests ---------
class RentalRequestBase(BaseModel):
    item_id: UUID = Field(..., description="ID вещи")
    user_id: UUID = Field(..., description="ID пользователя")
    start_date: date
    end_date: date


class RentalRequestCreate(RentalRequestBase):
    status: Optional[str] = Field(default="pending", description="Начальный статус")


class RentalRequestUpdateStatus(BaseModel):
    status: str = Field(..., description="Новый статус заявки")


class RentalRequestStatus(BaseModel):
    id: UUID
    status: Optional[str]

    class Config:
        from_attributes = True


class RentalRequestRead(RentalRequestBase):
    id: UUID
    status: Optional[str]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


# ---------- Payments ----------
class PaymentBase(BaseModel):
    user_id: UUID
    request_id: Optional[UUID] = Field(
        default=None, description="ID заявки на аренду (если есть)"
    )
    amount: Decimal

class PaymentCreate(PaymentBase):
    status: Optional[str] = Field(default="pending", description="Начальный статус")

class PaymentRead(PaymentBase):
    id: UUID
    status: Optional[str]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


class PaymentStatus(BaseModel):
    id: UUID
    status: Optional[str]

    class Config:
        from_attributes = True

# Auth
class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    full_name: str
    city: str
    email: str
    password: str

    passport_series: str
    passport_number: str
    passport_issued_by: str
    passport_issue_date: date

# Users
class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: UUID
    full_name: str
    city: str
    role_id: int

# Items
class ItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    price_per_day: float
    category: Optional[str] = None
    location: Optional[str] = None
    has_insurance: bool = False
    has_fast_delivery: bool = False
    status: str = "active"
    owner_id: UUID

    class Config:
        from_attributes = True

class ItemCreate(ItemBase):
    pass

class ItemOut(ItemBase):
    id: UUID

# Feedback
class FeedbackBase(BaseModel):
    rating: int
    comment: Optional[str] = None
    user_id: UUID

class FeedbackCreate(FeedbackBase):
    pass

class FeedbackOut(FeedbackBase):
    id: UUID
    created_at: datetime


# ---------- Notifications ----------
class NotificationBase(BaseModel):
    user_id: UUID
    type: Optional[str] = Field(default=None, description="Тип уведомления")
    message: Optional[str] = Field(default=None, description="Текст уведомления")


class NotificationRead(NotificationBase):
    id: UUID
    sent: Optional[bool]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


class NotificationReadStatus(BaseModel):
    id: UUID
    sent: Optional[bool]

    class Config:
        from_attributes = True