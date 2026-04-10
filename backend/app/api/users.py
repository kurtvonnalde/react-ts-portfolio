from fastapi import APIRouter, HTTPException, Request
from datetime import datetime, timezone
from azure.cosmos import exceptions
from pydantic import BaseModel
from typing import Optional
import os
import logging

from app.db.cosmos import get_container
from app.auth.user_context import get_authenticated_user

logger = logging.getLogger(__name__)

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
    try:
        user = get_authenticated_user(request)
        if not user:
            if payload is None:
                logger.warning("No authenticated user and no payload provided")
                raise HTTPException(status_code=401, detail="Not authenticated")
            user = payload.dict()
            logger.info(f"Using payload user: {user}")
        else:
            logger.info(f"Using authenticated user: {user}")

        if not user.get("user_id"):
            logger.error(f"Missing user_id in user data: {user}")
            raise HTTPException(status_code=400, detail="Missing user_id")

        container = users_container()
        user_id = user["user_id"]

        try:
            existing = container.read_item(user_id, partition_key=user_id)
            existing["lastLogin"] = now()
            existing["loginCount"] = existing.get("loginCount", 0) + 1
            existing["email"] = user.get("email")
            existing["name"] = user.get("name")
            container.replace_item(user_id, existing)
            logger.info(f"Updated user {user_id} in Cosmos DB")
            return {"status": "updated"}

        except exceptions.CosmosResourceNotFoundError:
            container.create_item({
                "id": user_id,
                "userId": user_id,
                "email": user.get("email"),
                "name": user.get("name"),
                "provider": user.get("provider"),
                "firstLogin": now(),
                "lastLogin": now(),
                "loginCount": 1,
            })
            logger.info(f"Created new user {user_id} in Cosmos DB")
            return {"status": "created"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in visit endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")