from typing import TYPE_CHECKING, Optional, List
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime

if TYPE_CHECKING:
    from database.models.project import Project

class Chart(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(max_length=200)  # Tytuł wykresu
    description: Optional[str] = Field(default=None, max_length=500)  # Opis wykresu
    chart_image_path: str = Field()  # Ścieżka do pliku z wykresem
    chart_type: str = Field(max_length=50)  # Typ wykresu (bar, line, scatter, etc.)
    chart_config: Optional[str] = Field(default=None)  # JSON z konfiguracją wykresu (kolumny, ustawienia)
    x_columns: Optional[str] = Field(default=None)  # JSON z kolumnami X
    y_columns: Optional[str] = Field(default=None)  # JSON z kolumnami Y
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default=None)
    order_index: int = Field(default=0)  # Kolejność wyświetlania w projekcie
    
    # Relacja wiele do jeden z projektem
    project_id: int = Field(foreign_key="project.id")
    project: "Project" = Relationship(back_populates="charts")
