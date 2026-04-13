from pydantic import BaseModel, Field
from typing import Optional, List, Literal

ProjectStatus = Literal["Planned", "In-Progress", "Completed", "On-Hold"]

class ProjectCreate(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=1000)
    status: ProjectStatus = Field(default="Planned")
    techStack: List[str] = Field(default=[])
    repoUrl: Optional[str] = ""
    demoUrl: Optional[str] = ""
    highlights: Optional[bool] = False

class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=120)
    description: Optional[str] = Field(default=None, max_length=3000)
    status: Optional[ProjectStatus] = None
    techStack: Optional[List[str]] = None
    repoUrl: Optional[str] = None
    demoUrl: Optional[str] = None
    highlights: Optional[bool] = None
