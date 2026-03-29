from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.models import User
from services.auth_service import hash_password, verify_password, create_token
from pydantic import BaseModel

router = APIRouter()

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken!")
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    token = create_token({"sub": str(new_user.id), "username": new_user.username, "is_admin": new_user.is_admin})
    return {"token": token, "username": new_user.username, "id": new_user.id, "is_admin": new_user.is_admin}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials!")
    token = create_token({"sub": str(db_user.id), "username": db_user.username, "is_admin": db_user.is_admin})
    return {"token": token, "username": db_user.username, "id": db_user.id, "is_admin": db_user.is_admin}