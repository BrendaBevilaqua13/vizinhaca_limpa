import os
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException,status
from sqlalchemy.orm import Session
from .. import schemas, crud
from ..database import SessionLocal
import uuid, os, shutil
from .. import models
from ..deps import require_role,get_current_user


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/create", response_model=schemas.ReportOut)
async def create_report(
    title: str = Form(...),
    description: str = Form(...),
    user_id: int = Form(...),
    category: str = Form(None),
    latitude: str = Form(None),
    longitude: str = Form(None),
    address_text: str = Form(None),
    db: Session = Depends(get_db)
): 
    report_in = schemas.ReportCreate(
        title=title,
        description=description,
        category=category,
        latitude=latitude,
        longitude=longitude,
        address_text=address_text
    )
    created = crud.create_report(db, user_id, report_in)
    return created

@router.get("/")
def get_reports(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db) # Abre a sessão do DB
):
    # Agora 'db' é a sessão correta
    return crud.list_reports(db, skip=skip, limit=limit)


'''
@router.post("/create")
def create_report(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    latitude: str = Form(None),
    longitude: str = Form(None),
    address_text: str = Form(None),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    user=Depends(require_role("citizen"))
):
    image_url = None

    if image:
        file_location = f"uploads/{image.filename}"
        with open(file_location, "wb") as f:
            f.write(image.file.read())
        image_url = file_location

    report_data = schemas.ReportCreate(
        title=title,
        description=description,
        category=category,
        latitude=latitude,
        longitude=longitude,
        address_text=address_text,
    )

    report = crud.create_report(
        db=db,
        user_id=user["id"],
        data=report_data,
        image_url=image_url
    )

    return {"message": "Denúncia registrada", "report": report}
'''

@router.patch("/{report_id}/status")
def update_status(report_id: int, data: schemas.ReportStatusUpdate, db: Session = Depends(get_db)):
    updated = crud.update_report_status(db, report_id, data.status)
    if not updated:
        return {"error": "Report not found"}
    return updated

@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_report_endpoint(
    report_id: int, 
    db: Session = Depends(get_db)
):
    """
    Exclui uma denúncia pelo ID e retorna 204 No Content em caso de sucesso.
    """
    # Chama a função de exclusão do CRUD
    success = crud.delete_report(db, report_id)
    
    if not success:
        # Se o CRUD retornar False, a denúncia não existia
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Denúncia não encontrada para exclusão"
        )
    
    # Se o CRUD retornar True, a função retorna automaticamente 204 No Content
    # por causa do status_code definido no decorator.
    return