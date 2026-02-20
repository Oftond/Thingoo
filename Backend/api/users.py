from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserOut

router = APIRouter(prefix="/api/v1/users", tags=["Users"])

@router.get("/", response_model=list[UserOut])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    return user


# @router.put("/{user_id}", dependencies=[Depends(admin_required)])
# def update_user(user_id: UUID_t, user_data: UserUpdate, db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.id == user_id).first()
#     if not user:
#         raise HTTP Exception(404, "User not found")

#     for field, value in user_data.dict(exclude_unset=True).items():
#         if value is not None:
#             setattr(user, field, value)

#     db.commit()
#     db.refresh(user)
#     return user



# @router.delete("/{user_id}", dependencies=[Depends(admin_required)])
# def delete_user(user_id: UUID_t, db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.id == user_id).first()
#     if not user:
#         raise HTTPException(404, "User not found")

#     db.delete(user)
#     db.commit()
#     return {"detail": "User deleted"}