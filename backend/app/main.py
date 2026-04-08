# backend/app/main.py
from pathlib import Path
from dotenv import load_dotenv

ENV_PATH = Path(__file__).resolve().parents[1] / ".env"  # -> backend/.env
load_dotenv(ENV_PATH)

from fastapi import FastAPI
from app.api.roles import router as roles_router
from app.api.users import router as users_router

app = FastAPI(title="AI Backend", version="0.1.0")

app.include_router(roles_router, prefix="/api")
app.include_router(users_router)

@app.get("/health")
def health():
    return {"status": "ok"}