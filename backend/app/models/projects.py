from pydantic import BaseModel, Field
from typing import Optional, List, Literal

ProjectStatus = Literal["Planned", "In-Progress", "Completed", "On-Hold"]

class ProjectCreate(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=1000)

    # fixed columns (Kanban)
    status: ProjectStatus = Field(default="Planned")

    # tags/filter
    techStack: List[str] = Field(default=[])

    repoUrl: Optional[str] = ""
    demoUrl: Optional[str] = ""
    highlights: Optional[bool] = False

    # pinned
    pinned: bool = False
    pinOrder: int = 0

    # ✅ NEW: swimlane grouping
    feature: str = Field(default="General", min_length=1, max_length=80)

    # ✅ NEW: ordering inside a column (drag/drop persistence)
    # Let backend set this if not provided
    order: Optional[int] = Field(default=None, ge=0)


class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=120)
    description: Optional[str] = Field(default=None, max_length=3000)

    status: Optional[ProjectStatus] = None
    techStack: Optional[List[str]] = None
    repoUrl: Optional[str] = None
    demoUrl: Optional[str] = None
    highlights: Optional[bool] = None

    pinned: Optional[bool] = None
    pinOrder: Optional[int] = None

    # ✅ NEW: swimlane grouping
    feature: Optional[str] = Field(default=None, min_length=1, max_length=80)

    # ✅ NEW: drag/drop ordering
    order: Optional[int] = Field(default=None, ge=0)

class MoveProject(BaseModel):
    toFeature: str = Field(min_length=1, max_length=80)
    toStatus: ProjectStatus
    toOrder: int = Field(ge=0)
