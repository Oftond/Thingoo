"""Маршруты для rental-requests."""
from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models import RentalRequest
from schemas import (
    RentalRequestCreate,
    RentalRequestRead,
    RentalRequestUpdateStatus,
    RentalRequestStatus,
)

router = APIRouter(tags=["rental-requests"])


def _get_rental_request_or_404(
    rental_request_id: UUID, db: Session
) -> RentalRequest:
    stmt = select(RentalRequest).where(RentalRequest.id == rental_request_id)
    rental_request = db.execute(stmt).scalar_one_or_none()
    if rental_request is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rental request not found",
        )
    return rental_request


@router.post(
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


@router.get("/rental-requests", response_model=list[RentalRequestRead])
def list_rental_requests(db: Session = Depends(get_db)) -> list[RentalRequestRead]:
    stmt = select(RentalRequest).order_by(RentalRequest.created_at.desc().nullslast())
    requests = db.execute(stmt).scalars().all()
    return requests


@router.get("/rental-requests/{rental_request_id}", response_model=RentalRequestRead)
def get_rental_request(
    rental_request_id: UUID, db: Session = Depends(get_db)
) -> RentalRequestRead:
    rental_request = _get_rental_request_or_404(rental_request_id, db)
    return rental_request


@router.patch(
    "/rental-requests/{rental_request_id}",
    response_model=RentalRequestRead,
)
def update_rental_request_status(
    rental_request_id: UUID,
    data: RentalRequestUpdateStatus,
    db: Session = Depends(get_db),
) -> RentalRequestRead:
    rental_request = _get_rental_request_or_404(rental_request_id, db)
    rental_request.status = data.status
    db.add(rental_request)
    db.commit()
    db.refresh(rental_request)
    return rental_request


@router.get(
    "/rental-requests/{rental_request_id}/status",
    response_model=RentalRequestStatus,
)
def get_rental_request_status(
    rental_request_id: UUID, db: Session = Depends(get_db)
) -> RentalRequestStatus:
    rental_request = _get_rental_request_or_404(rental_request_id, db)
    return RentalRequestStatus(id=rental_request.id, status=rental_request.status)

