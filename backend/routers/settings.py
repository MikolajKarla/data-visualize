from fastapi import APIRouter




router = APIRouter(
    prefix="/settings",
    tags="settings"
)


router.get("/user/{user_id}")
def get_user_settings(user_id: int):
    return {"message": f"Settings for user {user_id}"}


router.post("/user/{user_id}")
def update_user_settings(user_id: int, settings: dict):
    return {"message": f"Updated settings for user {user_id}", "settings": settings}



