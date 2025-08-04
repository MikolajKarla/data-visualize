# backend/database/models/settings.py
from typing import Optional
from sqlmodel import Field, SQLModel, Relationship
# Ważne: Importujemy model User z jego pliku
from database.models.user import User

class Settings(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    theme: str = Field(default="light")
    receive_notifications: bool = Field(default=True)

    user_id: int = Field(foreign_key="user.id", unique=True)

    # Ważne: Zdefiniowanie relacji zwrotnej do User
    user: User = Relationship(back_populates="settings", ondelete="CASCADE")

    def __repr__(self):
        return f"Settings(id={self.id}, user_id={self.user_id}, theme='{self.theme}')"