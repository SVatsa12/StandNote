from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.models.user import User
from app.services.auth_service import create_user, get_current_user
from app.database import get_db
from datetime import datetime

router = APIRouter(
    tags=["users"]
)

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str | None = None
    username: str | None = None
    email: EmailStr
    avatar: str | None = None
    facebook: str | None = None
    twitter: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: str | None = None
    username: str | None = None
    email: EmailStr | None = None
    avatar: str | None = None
    facebook: str | None = None
    twitter: str | None = None

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    created_user = create_user(db, user.email, user.password)
    return created_user

@router.get("/profile", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/update", response_model=UserOut)
def update_profile(
    updated: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if updated.name is not None:
        current_user.name = updated.name
    if updated.username is not None:
        current_user.username = updated.username
    if updated.email is not None:
        current_user.email = updated.email
    if updated.avatar is not None:
        current_user.avatar = updated.avatar
    if updated.facebook is not None:
        current_user.facebook = updated.facebook
    if updated.twitter is not None:
        current_user.twitter = updated.twitter

    db.commit()
    db.refresh(current_user)
    return current_user