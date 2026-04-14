import os
import uuid
from datetime import datetime, timezone
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query
from azure.cosmos import exceptions

from app.db.cosmos import get_container
from app.models.projects import ProjectCreate, ProjectUpdate
from app.core.security import require_admin, admin_actor
from app.models.projects import MoveProject



router = APIRouter(prefix="/projects", tags=["projects"])

CONTAINER = os.getenv("COSMOS_CONTAINER_PROJECTS", "projects")
OWNER_ID = "admin"

def now_iso():
    return datetime.now(timezone.utc).isoformat()

def container():
    return get_container(CONTAINER)


@router.get("/public")
def public_list(
    status: Optional[str] = None,
    pinnedOnly: bool = False,
    tech: List[str] = Query(default=[]),  # /public?tech=FastAPI&tech=Cosmos%20DB
    includeDeleted: bool = False
):
    c = container()

    where = ["c.ownerId = @ownerId"]
    params = [{"name": "@ownerId", "value": OWNER_ID}]

    if not includeDeleted:
        where.append("c.isDeleted = false")

    if status:
        where.append("c.status = @status")
        params.append({"name": "@status", "value": status})

    if pinnedOnly:
        where.append("c.pinned = true")

    # techStack filter: match ANY tech tags if tech list provided
    if tech:
        # Build OR conditions using ARRAY_CONTAINS
        or_parts = []
        for idx, t in enumerate(tech):
            pname = f"@t{idx}"
            or_parts.append(f"ARRAY_CONTAINS(c.techStack, {pname}, true)")
            params.append({"name": pname, "value": t})
        where.append("(" + " OR ".join(or_parts) + ")")

    query = f"""
        SELECT * FROM c
        WHERE {" AND ".join(where)}
        ORDER BY c.updatedAt DESC
    """

    return list(c.query_items(query=query, parameters=params, enable_cross_partition_query=True))

@router.get("/board")
def get_board(
    feature: Optional[str] = None,
    tech: List[str] = Query(default=[]),
    includeDeleted: bool = False
):
    c = container()

    where = ["c.ownerId = @ownerId"]
    params = [{"name": "@ownerId", "value": OWNER_ID}]

    if not includeDeleted:
        where.append("c.isDeleted = false")

    if feature:
        where.append("c.feature = @feature")
        params.append({"name": "@feature", "value": feature})

    if tech:
        or_parts = []
        for idx, t in enumerate(tech):
            pname = f"@t{idx}"
            or_parts.append(f"ARRAY_CONTAINS(c.techStack, {pname}, true)")
            params.append({"name": pname, "value": t})
        where.append("(" + " OR ".join(or_parts) + ")")

    query = f"""
      SELECT * FROM c
      WHERE {" AND ".join(where)}
      ORDER BY c.updatedAt DESC
    """

    items = list(c.query_items(query=query, parameters=params, enable_cross_partition_query=True))

    columns = ["Planned", "In-Progress", "Completed", "On-Hold"]
    board: dict[str, dict[str, list]] = {}

    for it in items:
        feat = it.get("feature", "General")
        col = it.get("status", "Planned")

        if feat not in board:
            board[feat] = {x: [] for x in columns}

        board[feat].setdefault(col, [])
        board[feat][col].append(it)

    # ensure fixed columns always exist
    for feat in board:
        for col in columns:
            board[feat].setdefault(col, [])

    return {"columns": columns, "features": list(board.keys()), "board": board}

@router.get("/public/{project_id}")
def public_get(project_id: str, includeDeleted: bool = False):
    c = container()
    try:
        doc = c.read_item(item=project_id, partition_key=OWNER_ID)
        if (not includeDeleted) and doc.get("isDeleted"):
            raise HTTPException(status_code=404, detail="Project not found")
        return doc
    except exceptions.CosmosResourceNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Project not found") from exc


# ---------- ADMIN ONLY ----------

@router.post("", dependencies=[Depends(require_admin)])
def create_project(payload: ProjectCreate):
    c = container()
    actor = admin_actor()
    ts = now_iso()
    feature = payload.feature or "General"
    status = payload.status

    
    if payload.order is None:
        q = """
        SELECT VALUE MAX(c.order)
        FROM c
        WHERE c.ownerId=@ownerId AND c.feature=@feature AND c.status=@status AND c.isDeleted=false
        """
        params = [
            {"name": "@ownerId", "value": OWNER_ID},
            {"name": "@feature", "value": feature},
            {"name": "@status", "value": status},
        ]
        max_list = list(c.query_items(query=q, parameters=params, enable_cross_partition_query=True))
        max_order = max_list[0] if max_list and max_list[0] is not None else 0
        order_val = max_order + 1000
    else:
        order_val = payload.order


    doc = {
        "id": str(uuid.uuid4()),
        "ownerId": OWNER_ID,

        "title": payload.title,
        "description": payload.description or "",
        "status": payload.status,
        "techStack": payload.techStack or [],
        "repoUrl": payload.repoUrl or "",
        "demoUrl": payload.demoUrl or "",

        "pinned": payload.pinned,
        "pinOrder": payload.pinOrder,

        "isDeleted": False,
        "deletedAt": None,
        "deletedBy": None,

        "createdAt": ts,
        "createdBy": actor,
        "updatedAt": ts,
        "updatedBy": actor,

        
        "feature": feature,
        "order": order_val,

    }

    c.create_item(body=doc)
    return doc


@router.put("/{project_id}", dependencies=[Depends(require_admin)])
def update_project(project_id: str, payload: ProjectUpdate):
    c = container()
    actor = admin_actor()
    ts = now_iso()

    try:
        doc = c.read_item(item=project_id, partition_key=OWNER_ID)
    except exceptions.CosmosResourceNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Project not found") from exc

    if doc.get("isDeleted"):
        raise HTTPException(status_code=409, detail="Cannot update a deleted project")

    for field, value in payload.model_dump(exclude_unset=True).items():
        doc[field] = value

    doc["updatedAt"] = ts
    doc["updatedBy"] = actor

    c.replace_item(item=project_id, body=doc)
    return doc

# Soft delete instead of physical delete
@router.delete("/{project_id}", dependencies=[Depends(require_admin)])
def soft_delete_project(project_id: str):
    c = container()
    actor = admin_actor()
    ts = now_iso()

    try:
        doc = c.read_item(item=project_id, partition_key=OWNER_ID)
    except exceptions.CosmosResourceNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Project not found") from exc

    if doc.get("isDeleted"):
        return {"ok": True, "alreadyDeleted": True}

    doc["isDeleted"] = True
    doc["deletedAt"] = ts
    doc["deletedBy"] = actor
    doc["updatedAt"] = ts
    doc["updatedBy"] = actor

    c.replace_item(item=project_id, body=doc)
    return {"ok": True, "deleted": True}

@router.post("/{project_id}/restore", dependencies=[Depends(require_admin)])
def restore_project(project_id: str):
    c = container()
    actor = admin_actor()
    ts = now_iso()

    try:
        doc = c.read_item(item=project_id, partition_key=OWNER_ID)
    except exceptions.CosmosResourceNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Project not found") from exc

    doc["isDeleted"] = False
    doc["deletedAt"] = None
    doc["deletedBy"] = None
    doc["updatedAt"] = ts
    doc["updatedBy"] = actor

    c.replace_item(item=project_id, body=doc)
    return {"ok": True, "restored": True}


@router.patch("/{project_id}/move", dependencies=[Depends(require_admin)])
def move_project(project_id: str, payload: MoveProject):
    c = container()
    actor = admin_actor()
    ts = now_iso()

    try:
        doc = c.read_item(item=project_id, partition_key=OWNER_ID)
    except exceptions.CosmosResourceNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Project not found") from exc

    if doc.get("isDeleted"):
        raise HTTPException(status_code=409, detail="Cannot move a deleted project")

    doc["feature"] = payload.toFeature
    doc["status"] = payload.toStatus
    doc["order"] = payload.toOrder
    doc["updatedAt"] = ts
    doc["updatedBy"] = actor

    c.replace_item(item=project_id, body=doc)
    return {"ok": True}
