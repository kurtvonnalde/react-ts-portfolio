# backend/app/api/users.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timezone
from azure.cosmos import exceptions
import os

from app.db.cosmos import get_container

router = APIRouter(prefix="/api/users", tags=["users"])

USERS_CONTAINER = os.getenv("COSMOS_CONTAINER_USERS", "users")

def now_iso():
    return datetime.now(timezone.utc).isoformat()

def get_users_container():
    # ✅ only connects when an endpoint is called
    return get_container(USERS_CONTAINER)

class VisitPayload(BaseModel):
    userId: str
    email: str
    name: str | None = ""
    provider: str | None = "google"

@router.post("/visit")
def visit(payload: VisitPayload):
    if not payload.userId or not payload.email:
        raise HTTPException(status_code=400, detail="Missing userId/email")

    container = get_users_container()

    doc_id = payload.userId
    pk = payload.userId

    try:
        existing = container.read_item(item=doc_id, partition_key=pk)
        existing["lastLogin"] = now_iso()
        existing["loginCount"] = int(existing.get("loginCount", 0)) + 1
        existing["email"] = payload.email
        existing["name"] = payload.name or existing.get("name", "")
        existing["provider"] = payload.provider or existing.get("provider", "google")
        container.replace_item(item=doc_id, body=existing)
        return {"ok": True, "mode": "updated", "userId": payload.userId}

    except exceptions.CosmosResourceNotFoundError:
        doc = {
            "id": doc_id,
            "userId": payload.userId,
            "email": payload.email,
            "name": payload.name or "",
            "provider": payload.provider or "google",
            "firstLogin": now_iso(),
            "lastLogin": now_iso(),
            "loginCount": 1,
        }
        container.create_item(body=doc)
        return {"ok": True, "mode": "created", "userId": payload.userId}