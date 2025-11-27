from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from .security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Token inválido")
    return payload

def require_role(*roles):
    def role_checker(payload = Depends(get_current_user)):
        if payload["role"] not in roles:
            raise HTTPException(status_code=403, detail="Acesso negado")
        return payload
    return role_checker

