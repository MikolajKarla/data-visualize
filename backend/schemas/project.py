from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from schemas.chart import Chart


class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_public: bool = False


class ProjectCreate(ProjectBase):
    source_file_path: str


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None
    updated_at: datetime = datetime.utcnow()


class Project(ProjectBase):
    id: int
    source_file_path: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    user_id: int

    class Config:
        from_attributes = True


class ProjectWithCharts(Project):
    """Projekt z wykresami - do szczegółów projektu"""
    charts: List[Chart] = []

    class Config:
        from_attributes = True


class ProjectPublic(BaseModel):
    """Publiczny widok projektu - bez danych wrażliwych"""
    id: int
    title: str
    description: Optional[str] = None
    created_at: datetime
    user_id: int
    charts_count: int = 0  # Liczba wykresów w projekcie

    class Config:
        from_attributes = True
