

class Columns(BaseModel):
    x_column: list[str] = Field(..., min_items=1)
    y_columns: list[str] = Field(..., min_items=1)


class ChartRequest(BaseModel):
    chartType: str
    columns: Columns