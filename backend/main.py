from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
app = FastAPI()

# Allow CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL for better security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
data = ""# maybe i will storage data here, i need to recognize each one
@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    file_location = f"uploads/{file.filename}"  # Save in 'uploads' directory
    with open(file_location, "wb") as buffer:
        buffer.write(await file.read())
    columns = pd.read_csv(file_location).columns.tolist()
    print(columns)
    return {"columns": columns, "message": "File uploaded successfully"}

