from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
from fastapi import HTTPException, status
from passlib.context import CryptContext
import os
from  dotenv import load_dotenv


load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Funkcje do haszowania/weryfikacji haseł (mogą być też w models.py)
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv('JWT_SECRET_KEY'), algorithm=os.getenv("ALGORITHM"))
    return encoded_jwt

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, os.getenv('JWT_SECRET_KEY'), algorithms=[os.getenv("ALGORITHM")])
        print(f"Token decoded successfully: {payload}")  # Debug log
        return payload
    except JWTError as e:
        print(f"JWT Error: {e}")  # Debug log

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )