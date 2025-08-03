from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from fastapi import HTTPException, status
from passlib.context import CryptContext

# Secret key do podpisywania tokenów JWT
# W środowisku produkcyjnym UŻYJ ZMIENNEJ ŚRODOWISKOWEJ!
SECRET_KEY = "your-super-secret-jwt-key" # Zmień na silny, losowy klucz!
ALGORITHM = "HS256" # Algorytm podpisu JWT
ACCESS_TOKEN_EXPIRE_MINUTES = 30 # Czas wygaśnięcia tokena dostępu

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Funkcje do haszowania/weryfikacji haseł (mogą być też w models.py)
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # Możesz sprawdzić claimy, np. czy token nie wygasł (exp jest sprawdzane automatycznie)
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )