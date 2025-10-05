from fastapi import FastAPI, File, Response, UploadFile, Depends
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import BytesIO

from crud.user import get_current_user
from crud.chart import create_plot 
from schemas.chart import ChartRequest

from database.database import create_db_and_tables # Database setup
from database.models.user import User # User model

from routers import auth, test

app = FastAPI(
    docs_url="/docs",
    redoc_url="/redoc"
)

# Create database tables on startup
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Allow CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Specific frontend URLs
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Global data storage (consider using Redis for production)
data = pd.DataFrame()


# Protected file upload route
@app.post("/upload/")
async def upload_file(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    file_location = f"uploads/{file.filename}"  # Save in 'uploads' directory (development only)
    with open(file_location, "wb") as buffer:
        buffer.write(await file.read())
    columns = pd.read_csv(file_location).columns.tolist()
    global data
    data = pd.read_csv(file_location)
    print(columns)
    return {"columns": columns, "message": "File uploaded successfully"}

# Protected chart creation route
@app.post("/chart/")
async def create_chart_endpoint(chart_request: ChartRequest, current_user: User = Depends(get_current_user)):
    chart_type = chart_request.chartType 
    columns = chart_request.columns    
    global data
    plot_result = create_plot(data, chart_type, columns) 
    if isinstance(plot_result, str):
        return {"message": plot_result}
    elif isinstance(plot_result, BytesIO):
        return Response(content=plot_result.read(), media_type="image/png")
    else:
        return {"message": "Nie udało się wygenerować wykresu - nieznany błąd"}


app.include_router(auth.router);
app.include_router(test.router);


