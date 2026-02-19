"""Маршруты для notifications."""
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models import Notification, User
from schemas import NotificationRead, NotificationReadStatus

router = APIRouter(tags=["notifications"])


def _get_notification_or_404(notification_id: UUID, db: Session) -> Notification:
    stmt = select(Notification).where(Notification.id == notification_id)
    notification = db.execute(stmt).scalar_one_or_none()
    if notification is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found",
        )
    return notification


@router.get(
    "/users/{user_id}/notifications",
    response_model=list[NotificationRead],
)
def get_user_notifications(
    user_id: UUID,
    db: Session = Depends(get_db),
) -> list[NotificationRead]:
    user_stmt = select(User).where(User.id == user_id)
    user = db.execute(user_stmt).scalar_one_or_none()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    stmt = (
        select(Notification)
        .where(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc().nullslast())
    )
    notifications = db.execute(stmt).scalars().all()
    return notifications


@router.patch(
    "/notifications/{notification_id}/read",
    response_model=NotificationReadStatus,
)
def mark_notification_read(
    notification_id: UUID,
    db: Session = Depends(get_db),
) -> NotificationReadStatus:
    notification = _get_notification_or_404(notification_id, db)
    # используем поле sent как "прочитано/отправлено"
    notification.sent = True
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return NotificationReadStatus(id=notification.id, sent=notification.sent)

