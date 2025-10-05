from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException,status
from typing import Optional
from database.models.user import User
from crud.user import create_user_with_profile_and_settings, authenticate_user, get_current_user, get_user_by_email, get_user_by_id # CRUD functions
from schemas.user import UserLogin, Token, UserRead, UserCreate # Pydantic schemas
from database.database import get_session
from auth.security import create_access_token # JWT functions


router = APIRouter(
    prefix="/auth",
    tags=['authorization']
)



# Authentication routes
@router.post("/register", response_model=UserRead)
async def register(user: UserCreate, db = Depends(get_session)):
    # Check if user already exists
    existing_user = get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    new_user = create_user_with_profile_and_settings(db, user)
    return new_user

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db = Depends(get_session)):
    # Authenticate user
    user = authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=30)  # Or from environment variable
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
