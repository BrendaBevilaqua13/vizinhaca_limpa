from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud
from ..database import SessionLocal
from .. import models
from ..auth import create_access_token
from fastapi import HTTPException
from ..schemas import UserCreate,UserLogin
from .. import security
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    created = crud.create_user(db, user)
    return created

@router.get("/list")
def list_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@router.post("/login")
def login_form(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # 1. Recupera o usuário pelo email
    user = crud.get_user_by_email(db, form_data.username) # Note: OAuth2PasswordRequestForm usa 'username'
    if not user:
        raise HTTPException(status_code=400, detail="Email não encontrado")

    # 2. Verifica a senha usando a senha enviada (form_data.password) e o hash armazenado
    if not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Senha incorreta")

    # 3. Cria o token
    token = create_access_token({
        "user_id": str(user.id), 
        "sub": user.email, # Usamos user.email para o subject
        "role": user.role
    })

    # 4. Retorna o token
    return {"access_token": token, "token_type": "bearer","user_id": user.id}