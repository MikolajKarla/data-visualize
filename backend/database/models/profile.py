from typing import Optional, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship
from sqlalchemy import Column, Integer, ForeignKey

if TYPE_CHECKING:
    from database.models.user import User

class Profile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    profile_picture_url: Optional[str] = None

    user_id: int = Field(sa_column=Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), unique=True))

    # Ważne: Zdefiniowanie relacji zwrotnej do User
    user: "User" = Relationship(back_populates="profile")

    def __repr__(self):
        return f"Profile(id={self.id}, user_id={self.user_id}, first_name='{self.first_name}')"
