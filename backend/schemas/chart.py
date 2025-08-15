from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime


class Columns(BaseModel):
    x_column: list[str] = Field(..., min_items=1)
    y_columns: list[str] = Field(..., min_items=1)


class ChartRequest(BaseModel):
    chartType: str
    columns: Columns


class ChartBase(BaseModel):
    title: str
    description: Optional[str] = None
    chart_type: str
    chart_config: Optional[str] = None
    x_columns: Optional[str] = None
    y_columns: Optional[str] = None
    order_index: int = 0


class ChartCreate(ChartBase):
    chart_image_path: str
    project_id: int


class ChartUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    chart_config: Optional[str] = None
    x_columns: Optional[str] = None
    y_columns: Optional[str] = None
    order_index: Optional[int] = None
    updated_at: datetime = datetime.utcnow()


class Chart(ChartBase):
    id: int
    chart_image_path: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    project_id: int

    class Config:
        from_attributes = True


class ChartWithProject(Chart):
    """Wykres z informacją o projekcie"""
    project_title: str
    project_user_id: int

    class Config:
        from_attributes = True