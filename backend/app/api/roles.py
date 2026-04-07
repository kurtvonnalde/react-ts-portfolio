from fastapi import APIRouter

router = APIRouter(tags=["auth"])

@router.get("/getRoles")
def get_roles():
    # Minimal valid response
    return {
        "roles": []
    }