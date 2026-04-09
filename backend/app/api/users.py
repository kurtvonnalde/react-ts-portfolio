from fastapi import APIRouter, HTTPException, Request
from datetime import datetime, timezone
from azure.cosmos import exceptions
from pydantic import BaseModel
from typing import Optional
import os

from app.db.cosmos import get_container
from app.auth.user_context import get_authenticated_user

class UserVisitPayload(BaseModel):
    user_id: str
    email: Optional[str] = None
    name: Optional[str] = None
    provider: Optional[str] = None

router = APIRouter(prefix="/api/users", tags=["users"])
USERS_CONTAINER = os.getenv("COSMOS_CONTAINER_USERS", "users")

def now():
    return datetime.now(timezone.utc).isoformat()

def users_container():
    return get_container(USERS_CONTAINER)

@router.post("/visit")
def visit(request: Request, payload: Optional[UserVisitPayload] = None):
    user = get_authenticated_user(request)
    if not user:
        if payload is None:
            raise HTTPException(status_code=401, detail="Not authenticated")
        user = payload.dict()

    container = users_container()
    user_id = user["user_id"]

    try:
        existing = container.read_item(user_id, partition_key=user_id)
        existing["lastLogin"] = now()
        existing["loginCount"] += 1
        existing["email"] = user["email"]
        existing["name"] = user["name"]
        container.replace_item(user_id, existing)
        return {"status": "updated"}

    except exceptions.CosmosResourceNotFoundError:
        container.create_item({
            "id": user_id,
            "userId": user_id,
            "email": user["email"],
            "name": user["name"],
            "provider": user["provider"],
            "firstLogin": now(),
            "lastLogin": now(),
            "loginCount": 1,
        })
        return {"status": "created"}