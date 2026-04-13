import os
from fastapi import Header, HTTPException

def require_admin(x_admin_key: str | None = Header(default=None)):
    expected = os.getenv("ADMIN_KEY")
    if not expected:
        raise HTTPException(status_code=500, detail="Admin key not configured")
    
    if not x_admin_key or x_admin_key != expected:
        raise HTTPException(status_code=401, detail="Unauthorized")