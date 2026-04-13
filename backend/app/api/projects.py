import os 
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from azure.cosmos import exceptions

from app.db.cosmos import get_container
from app.models.projects import ProjectCreate, ProjectUpdate
from app.core.security import require_admin

router = APIRouter(prefix="/projects", tags=["projects"])

CONTAINER = os.getenv("COSMOS_CONTAINER_PROJECTS", "projects")
OWNER_ID = "admin"

def now_iso():
    return datetime.now(timezone.utc).isoformat()

def container():
    return get_container(CONTAINER)


@router.get("/public")
def public_list():
    c = container()
    query = "SELECT * FROM c WHERE c.ownerId = @ownerId ORDER BY c.updatedAt DESC"
    params = [{"name": "@ownerId", "value": OWNER_ID}]
    return list(c.query_items(query=query, parameters=params, enable_cross_partition_query=True))


@router.get("/public/{project_id}")
def public_get(project_id: str):
    c = container()
    try:
        return c.read_item(item=project_id, partition_key=OWNER_ID)
    except exceptions.CosmosResourceNotFoundError:
        raise HTTPException(status_code=404, detail="Project not found")

# ---------- ADMIN ONLY ----------
@router.post("", dependencies=[Depends(require_admin)])
def create_project(payload: ProjectCreate):
    c = container()
    doc = {
        "id": str(uuid.uuid4()),
        "ownerId": OWNER_ID,  # partition key
        "title": payload.title,
        "description": payload.description or "",
        "status": payload.status,
        "techStack": payload.techStack or [],
        "repoUrl": payload.repoUrl or "",
        "demoUrl": payload.demoUrl or "",
        "highlights": payload.highlights,
        "createdAt": now_iso(),
        "updatedAt": now_iso(),
    }
    c.create_item(body=doc)
    return doc

@router.put("/{project_id}", dependencies=[Depends(require_admin)])
def update_project(project_id: str, payload: ProjectUpdate):
    c = container()
    try:
        doc = c.read_item(item=project_id, partition_key=OWNER_ID)
    except exceptions.CosmosResourceNotFoundError:
        raise HTTPException(status_code=404, detail="Project not found")

    if payload.title is not None:
        doc["title"] = payload.title
    if payload.description is not None:
        doc["description"] = payload.description
    if payload.status is not None:
        doc["status"] = payload.status
    if payload.techStack is not None:
        doc["techStack"] = payload.techStack
    if payload.repoUrl is not None:
        doc["repoUrl"] = payload.repoUrl
    if payload.demoUrl is not None:
        doc["demoUrl"] = payload.demoUrl
    if payload.highlights is not None:
        doc["highlights"] = payload.highlights

    doc["updatedAt"] = now_iso()
    c.replace_item(item=project_id, body=doc)
    return doc

@router.delete("/{project_id}", dependencies=[Depends(require_admin)])
def delete_project(project_id: str):
    c = container()
    try:
        c.delete_item(item=project_id, partition_key=OWNER_ID)
        return {"ok": True}
    except exceptions.CosmosResourceNotFoundError:
        raise HTTPException(status_code=404, detail="Project not found")
