from typing import Optional, TYPE_CHECKING, List
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from database.models.profile import Profile
    from database.models.settings import Settings
    from database.models.project import Project
    

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True, nullable=False)
    hashed_password: str = Field(nullable=False)
    is_active: bool = Field(default=True, nullable=False)
    is_superuser: bool = Field(default=False, nullable=False)
    
    # Relationships
    profile: Optional["Profile"] = Relationship(back_populates="user")
    settings: Optional["Settings"] = Relationship(back_populates="user")
    projects: List["Project"] = Relationship(back_populates="user")
=======
from sqlmodel import Field, Session, SQLModel, select,Relationship
from typing import List, Optional
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], DeprecationWarning="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True, nullable=False)
    email: str = Field(index=True, unique=True, nullable=False)
    full_name: str = Field(default=None, nullable=True)
    hashed_password: str = Field(nullable=False)
    is_active: bool = Field(default=True, nullable=False)
    is_superuser: bool = Field(default=False, nullable=False)

    profile: Optional["Profile"] = Relationship(back_populates="user")
    settings: Optional["Settings"] = Relationship(back_populates="user")

    def __repr__(self):
        return f"User(id={self.id}, email='{self.email}')"
