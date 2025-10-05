from fastapi import APIRouter, Depends
from database.models.user import User
from crud.user import get_current_user


router = APIRouter(
    prefix="/test",
    tags=['testing']
)


# Test endpoint without authentication
@router.get("/")
async def test_endpoint():
    return {"message": "Test endpoint works - no authentication required"}

# Test endpoint with authentication
@router.get("/auth")
async def test_auth_endpoint(current_user: User = Depends(get_current_user)):
    return {"message": f"Authentication works for user: {current_user.email}"}
