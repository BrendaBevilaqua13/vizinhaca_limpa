from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str | None = None
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    class Config:
        orm_mode = True

class ReportOut(BaseModel):
    id: int
    title: str
    description: str
    category: Optional[str]
    status: str
    address_text: Optional[str] = None
    created_at: datetime
    class Config:
        orm_mode = True

class ReportStatusUpdate(BaseModel):
    status: str

class UserLogin(BaseModel):
    email: str
    password: str

class ReportCreate(BaseModel):
    title: str
    description: str
    category: Optional[str] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    address_text: Optional[str] = None