# backend/database/models/settings.py
from typing import Optional, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship
from sqlalchemy import Column, Integer, ForeignKey

if TYPE_CHECKING:
    from database.models.user import User

class Settings(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    theme: str = Field(default="light")
    receive_notifications: bool = Field(default=True)

    user_id: int = Field(sa_column=Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), unique=True))

    # Ważne: Zdefiniowanie relacji zwrotnej do User
    user: "User" = Relationship(back_populates="settings")

    def __repr__(self):
        return f"Settings(id={self.id}, user_id={self.user_id}, theme='{self.theme}')"