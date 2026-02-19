"""Pydantic-схемы для API."""
from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


# ---------- Rental requests ----------


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
