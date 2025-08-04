from fastapi import FastAPI, File, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import BytesIO

from pydantic import BaseModel, Field
from backend.crud.chart import create_plot 
from backend.schemas.chart import ChartRequest, Columns

from database.database import get_session, create_db_and_tables # Twoje pliki
from database.models.user import User # Importuj model User
from auth.security import verify_password, create_access_token, decode_access_token # JWT functions
from schemas.user import UserLogin, Token, UserRead, UserCreate # Schematy Pydantic
from crud.user import create_user_with_profile_and_settings, authenticate_user, get_user_data # Funkcje CRUD


app = FastAPI()

# Allow CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL for better security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
data =pd.DataFrame() 

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    file_location = f"uploads/{file.filename}"  # Save in 'uploads' directory (development only)
    with open(file_location, "wb") as buffer:
        buffer.write(await file.read())
    columns = pd.read_csv(file_location).columns.tolist()
    global data
    data = pd.read_csv(file_location)
    print(columns)
    return {"columns": columns, "message": "File uploaded successfully"}

@app.post("/chart/")
async def create_chart_endpoint(chart_request: ChartRequest):
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