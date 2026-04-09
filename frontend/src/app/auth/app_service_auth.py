import base64
import json
from fastapi import Request

def get_authenticated_user(request: Request):
   header = request.headers.get("X-MS-CLIENT-PRINCIPAL")
   if not header:
       return None
   
   decoded = base64.b64decode(header).decode('utf-8')
   principal = json.loads(decoded)

   claims = {c["typ"]: c["val"] for c in principal.get("claims", [])}

   return {
       "user_id": principal.get("user_id"),
       "user_details": principal.get("user_details"),
       "email": claims.get("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")
       or claims.get("email"),
       "name": claims.get("name")
   }