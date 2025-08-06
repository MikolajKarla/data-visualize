from fastapi import FastAPI, File, Response, UploadFile, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import BytesIO
from datetime import timedelta

from crud.chart import create_plot 
from schemas.chart import ChartRequest, Columns

from database.database import get_session, create_db_and_tables # Database setup
from database.models.user import User # User model
from auth.security import verify_password, create_access_token, decode_access_token # JWT functions
from schemas.user import UserLogin, Token, UserRead, UserCreate # Pydantic schemas
from crud.user import create_user_with_profile_and_settings, authenticate_user, get_user_by_email, get_user_by_id # CRUD functions

# Initialize security
security = HTTPBearer()

app = FastAPI()

# Create database tables on startup
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Allow CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL for better security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global data storage (consider using Redis for production)
data = pd.DataFrame()

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db = Depends(get_session)):
    token = credentials.credentials
    payload = decode_access_token(token)
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = get_user_by_id(db, int(user_id))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

# Authentication routes
@app.post("/auth/register", response_model=UserRead)
async def register(user: UserCreate, db = Depends(get_session)):
    # Check if user already exists
    existing_user = get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    new_user = create_user_with_profile_and_settings(db, user)
    return new_user

@app.post("/auth/login", response_model=Token)
async def login(user_credentials: UserLogin, db = Depends(get_session)):
    # Authenticate user
    user = authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=30)  # Or from environment variable
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

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