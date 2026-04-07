from fastapi import FastAPI
from app.api.roles import router as roles_router

app = FastAPI(
    title="AI Backend",
    version="0.1.0"
)

app.include_router(roles_router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok"}
