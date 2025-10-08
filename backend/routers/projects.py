from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from crud.user import get_current_user
from database.models.user import User
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from crud.user import get_current_user
from typing import List, Optional, Annotated

router = APIRouter(
    prefix="/projects",
    tags=["projects"],
    
)

class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    is_public: bool = False


security = HTTPBearer()

@router.get("/user/{user_id}", response_model=List[dict])
async def get_user_projects(
    user_id: int, 
    credentials: HTTPAuthorizationCredentials = Depends(security),
    current_user: User = Depends(get_current_user)
):
    """Get projects for a specific user with token authorization"""
    try:
        # Verify the token
        token = credentials.credentials
        # Check if user is authorized to view these projects
        if current_user.id != user_id and not current_user.is_admin:
            raise HTTPException(status_code=403, detail="Access denied")
        
        print(f"Fetching projects for user_id: {user_id}, requested by user_id: {current_user.id}")
        
        # Mock data for now - replace with actual database queries
        mock_projects = [
            {
                "id": 1,
                "title": "Analiza sprzedaży Q4",
                "description": "Analiza danych sprzedażowych za ostatni kwartał",
                "source_file_path": "sales_q4.csv",
                "created_at": "2024-01-15T10:30:00Z",
                "updated_at": "2024-01-20T14:45:00Z",
                "is_public": False,
                "charts_count": 3
            },
            {
                "id": 2,
                "title": "Demografia klientów",
                "description": "Wizualizacja danych demograficznych",
                "source_file_path": "customers.csv",
                "created_at": "2024-01-10T09:15:00Z",
                "updated_at": "2024-01-12T16:20:00Z",
                "is_public": True,
                "charts_count": 5
            }
        ]
        return mock_projects
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch projects: {str(e)}")

@router.post("/save")
async def save_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_user)
):
    """Save a new project"""
    try:
        # Mock implementation - replace with actual database save
        new_project = {
            "id": 999,  # Mock ID
            "title": project_data.title,
            "description": project_data.description,
            "source_file_path": "temp_file.csv",  # This would come from file upload
            "created_at": "2024-01-25T10:00:00Z",
            "updated_at": "2024-01-25T10:00:00Z",
            "is_public": project_data.is_public,
            "charts_count": 0,
            "user_id": current_user.id
        }
        
        print(f"Saving project: {project_data.title} for user {current_user.id}")
        
        return {
            "message": "Project saved successfully",
            "project": new_project
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save project: {str(e)}")
