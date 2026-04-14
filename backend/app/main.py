# backend/app/main.py
from pathlib import Path
from dotenv import load_dotenv
import os

# Load .env from the backend directory
backend_dir = Path(__file__).resolve().parent.parent
env_path = backend_dir / ".env"
load_dotenv(env_path)

# Also try loading from current working directory as fallback
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.roles import router as roles_router
from app.api.users import router as users_router
from app.api.projects import router as projects_router


app = FastAPI(title="AI Backend", version="0.1.0")

# Allow frontend origins from environment, with localhost defaults for development
frontend_origins = os.getenv("FRONTEND_ORIGINS")
if frontend_origins:
    allow_origins = [origin.strip() for origin in frontend_origins.split(",") if origin.strip()]
else:
    allow_origins = ["http://localhost:5173", "http://localhost:5174"]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(roles_router, prefix="/api")
app.include_router(users_router)
app.include_router(projects_router)

@app.get("/health")
def health():
    return {"status": "ok"}