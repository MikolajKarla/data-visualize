# backend/crud/user.py
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import Session, select
from database.models.user import User
from database.models.profile import Profile
from database.models.settings import Settings
from auth.security import get_password_hash, verify_password

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