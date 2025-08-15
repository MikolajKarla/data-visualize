from typing import TYPE_CHECKING, Optional, List
from sqlmodel import Field, SQLModel, Relationship
from sqlalchemy import Column, Integer, ForeignKey
from datetime import datetime

if TYPE_CHECKING:
    from database.models.user import User
    from database.models.chart import Chart

class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(max_length=200)  # Tytuł projektu
    description: Optional[str] = Field(default=None, max_length=1000)  # Opis projektu
    source_file_path: str = Field()  # Ścieżka do pliku źródłowego (CSV)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default=None)
    is_public: bool = Field(default=False)  # Czy projekt jest publiczny
    
    # Relacja jeden do wielu z użytkownikiem
    user_id: int = Field(foreign_key="user.id")
    user: "User" = Relationship(back_populates="projects")
    
    # Relacja jeden do wielu z wykresami
    charts: List["Chart"] = Relationship(back_populates="project")