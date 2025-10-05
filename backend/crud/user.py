# backend/crud/user.py
from typing import Optional, List, TYPE_CHECKING
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select
from database.database import get_session

# Initialize security
security = HTTPBearer()
from database.models.user import User
from database.models.profile import Profile
from database.models.settings import Settings
from auth.security import decode_access_token, get_password_hash, verify_password

if TYPE_CHECKING:
    from schemas.user import UserCreate

# --- Funkcje CRUD dla Użytkowników ---

def create_user(session: Session, email: str, password: str, first_name: Optional[str] = None) -> User:
    hashed_password = get_password_hash(password)
    user = User(email=email, hashed_password=hashed_password)

    session.add(user)
    session.commit()
    session.refresh(user)

    profile = Profile(user_id=user.id, first_name=first_name)
    settings = Settings(user_id=user.id)

    session.add(profile)
    session.add(settings)
    session.commit()
    session.refresh(profile)
    session.refresh(settings)

    return user

def get_user_by_email(session: Session, email: str) -> Optional[User]:
    user = session.exec(select(User).where(User.email == email)).first()
    return user

def get_user_by_id(session: Session, user_id: int) -> Optional[User]:
    user = session.get(User, user_id)
    return user

def authenticate_user(session: Session, email: str, password: str) -> Optional[User]: 
    user = get_user_by_email(session, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def create_user_with_profile_and_settings(session: Session, user_data: "UserCreate") -> User:
    """
    Creates a user with associated profile and settings.
    """
    hashed_password = get_password_hash(user_data.password)
    user = User(email=user_data.email, hashed_password=hashed_password)

    session.add(user)
    session.commit()
    session.refresh(user)

    profile = Profile(user_id=user.id, first_name=user_data.first_name)
    settings = Settings(user_id=user.id)

    session.add(profile)
    session.add(settings)
    session.commit()
    session.refresh(profile)
    session.refresh(settings)

    return user

def get_user_data_with_relations(session: Session, user_id: int) -> Optional[User]:
    user = session.exec(
        select(User)
        .where(User.id == user_id)
        .options(User.profile, User.settings)
    ).first()
    return user

# --- Funkcje CRUD dla Profili ---

def get_profile_by_user_id(session: Session, user_id: int) -> Optional[Profile]:
    profile = session.exec(select(Profile).where(Profile.user_id == user_id)).first()
    return profile

def update_profile(
    session: Session,
    user_id: int,
    first_name: Optional[str] = None,
    last_name: Optional[str] = None,
    bio: Optional[str] = None,
    profile_picture_url: Optional[str] = None
) -> Optional[Profile]:

    profile = get_profile_by_user_id(session, user_id)
    if not profile:
        return None

    if first_name is not None:
        profile.first_name = first_name
    if last_name is not None:
        profile.last_name = last_name
    if bio is not None:
        profile.bio = bio
    if profile_picture_url is not None:
        profile.profile_picture_url = profile_picture_url

    session.add(profile)
    session.commit()
    session.refresh(profile)
    return profile

# --- Funkcje CRUD dla Ustawień ---

    
# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db = Depends(get_session)):
    try:
        token = credentials.credentials
        print(f"Received token: {token[:20]}...") # Debug log (pokazuje tylko pierwsze 20 znaków)
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        print(f"User ID from token: {user_id}")  # Debug log
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user = get_user_by_id(db, int(user_id))
        if user is None:
            print(f"User not found for ID: {user_id}")  # Debug log
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        print(f"User authenticated: {user.email}")  # Debug log
        return user
    except Exception as e:
        print(f"Authentication error: {e}")  # Debug log
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )
    

def get_settings_by_user_id(session: Session, user_id: int) -> Optional[Settings]:
    """
    Pobiera ustawienia użytkownika na podstawie ID użytkownika.
    """
    settings = session.exec(select(Settings).where(Settings.user_id == user_id)).first()
    return settings

def update_settings(
    session: Session,
    user_id: int,
    theme: Optional[str] = None,
    receive_notifications: Optional[bool] = None
) -> Optional[Settings]:
    """
    Aktualizuje ustawienia użytkownika.
    """
    settings = get_settings_by_user_id(session, user_id)
    if not settings:
        return None

    if theme is not None:
        settings.theme = theme
    if receive_notifications is not None:
        settings.receive_notifications = receive_notifications

    session.add(settings)
    session.commit()
    session.refresh(settings)
    return settings

def delete_user(session: Session, user_id: int) -> bool:
    user = get_user_by_id(session, user_id)
    if not user:
        return False
    session.delete(user)
    session.commit()
    return True