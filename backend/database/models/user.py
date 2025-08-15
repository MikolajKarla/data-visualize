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