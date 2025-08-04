from typing import Optional
from sqlmodel import Field, SQLModel, Relationship
# Ważne: Importujemy model User z jego pliku
from database.models.user import User

class Profile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    profile_picture_url: Optional[str] = None

    user_id: int = Field(foreign_key="user.id", unique=True)

    # Ważne: Zdefiniowanie relacji zwrotnej do User
    user: User = Relationship(back_populates="profile",ondelete="CASCADE")

    def __repr__(self):
        return f"Profile(id={self.id}, user_id={self.user_id}, first_name='{self.first_name}')"
