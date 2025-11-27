from sqlalchemy.orm import Session
from . import models
from .security import hash_password, verify_password
from .schemas import UserCreate
from sqlalchemy import desc
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.future import select

def create_user(db: Session, user: UserCreate):
    hashed = hash_password(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        password_hash=hashed
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def authenticate_user(db: Session, email: str, password: str):
    db_user = get_user_by_email(db, email)
    if not db_user:
        return None
    if not verify_password(password, db_user.password_hash):
        return None
    return db_user

def list_reports(db: Session, skip: int = 0, limit: int = 100):
    
    stmt = (
        select(models.Report)
        # 🚨 ADIÇÃO 1: Ordenar pela data de criação mais recente
        .order_by(desc(models.Report.created_at)) 
        
        # 🚨 ADIÇÃO 2: Garantir que os dados do usuário sejam carregados (user.name)
        .options(joinedload(models.Report.user)) 
        
        .offset(skip)
        .limit(limit)
    )
    
    # Executa a consulta e retorna os objetos Report
    reports = db.scalars(stmt).unique().all()
    
    return reports
def create_report(db: Session, user_id: int, data, image_url: str | None = None):
    report = models.Report(
        title=data.title,
        description=data.description,
        category=data.category,
        latitude=data.latitude,
        longitude=data.longitude,
        address_text=data.address_text,
        user_id=user_id,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

def update_report_status(db: Session, report_id: int, new_status: str):
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        return None

    report.status = new_status
    db.commit()
    db.refresh(report)
    return report

def delete_report(db: Session, report_id: int) -> bool:
    """
    Localiza e exclui uma denúncia pelo ID.

    Retorna True se a exclusão for bem-sucedida, False caso contrário.
    """
    # 1. Localizar o Report
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    
    if not report:
        # Se a denúncia não for encontrada, retorna False
        return False
        
    # 2. Executar a Exclusão
    db.delete(report)
    
    # 3. Confirmar a transação no banco de dados
    db.commit()
    
    # Nota: Não usamos db.refresh(report), pois o objeto não existe mais.
    
    return True