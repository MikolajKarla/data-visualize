from typing import Optional, TYPE_CHECKING, List
from sqlmodel import Field, SQLModel, Relationship
from passlib.context import CryptContext

if TYPE_CHECKING:
    from database.models.profile import Profile
    from database.models.settings import Settings
    from database.models.project import Project

# Password hashing utilities
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: Optional[str] = Field(default=None, index=True, unique=True, nullable=True)
    email: str = Field(index=True, unique=True, nullable=False)
    full_name: Optional[str] = Field(default=None, nullable=True)
    hashed_password: str = Field(nullable=False)
    is_active: bool = Field(default=True, nullable=False)
    is_superuser: bool = Field(default=False, nullable=False)
    
    # Relationships
    profile: Optional["Profile"] = Relationship(back_populates="user")
    settings: Optional["Settings"] = Relationship(back_populates="user")
    projects: List["Project"] = Relationship(back_populates="user")

    def __repr__(self):
        return f"User(id={self.id}, email='{self.email}', username='{self.username}')"
