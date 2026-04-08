import base64
import json
from fastapi import Request

def get_authenticated_user(request: Request):
    principal = request.headers.get("x-ms-client-principal")
    if not principal:
        return None

    decoded = base64.b64decode(principal).decode("utf-8")
    data = json.loads(decoded)

    claims = {c["typ"]: c["val"] for c in data.get("claims", [])}

    return {
        "user_id": data.get("userId"),
        "email": claims.get(
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ),
        "name": claims.get("name"),
        "provider": data.get("identityProvider")
    }