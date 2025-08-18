from typing import List, Optional
from sqlmodel import Session, select
from database.models.project import Project
from database.models.chart import Chart
from schemas.project import ProjectCreate, ProjectUpdate


def create_project(session: Session, project: ProjectCreate, user_id: int) -> Project:
    """Tworzy nowy projekt dla użytkownika"""
    db_project = Project(
        title=project.title,
        description=project.description,
        source_file_path=project.source_file_path,
        is_public=project.is_public,
        user_id=user_id
    )
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    return db_project


def get_project_by_id(session: Session, project_id: int) -> Optional[Project]:
    """Pobiera projekt po ID"""
    statement = select(Project).where(Project.id == project_id)
    return session.exec(statement).first()


def get_project_with_charts(session: Session, project_id: int, user_id: int) -> Optional[Project]:
    """Pobiera projekt z wykresami (tylko dla właściciela)"""
    statement = select(Project).where(Project.id == project_id, Project.user_id == user_id)
    project = session.exec(statement).first()
    
    if not project:
        return None
    
    # Pobierz wykresy w odpowiedniej kolejności
    charts_statement = select(Chart).where(Chart.project_id == project_id).order_by(Chart.order_index, Chart.created_at)
    charts = session.exec(charts_statement).all()
    
    # Dodaj wykresy do projektu (jeśli SQLModel to obsługuje)
    project.charts = charts
    return project


def get_public_project_with_charts(session: Session, project_id: int) -> Optional[Project]:
    """Pobiera publiczny projekt z wykresami"""
    statement = select(Project).where(Project.id == project_id, Project.is_public == True)
    project = session.exec(statement).first()
    
    if not project:
        return None
    
    # Pobierz wykresy w odpowiedniej kolejności
    charts_statement = select(Chart).where(Chart.project_id == project_id).order_by(Chart.order_index, Chart.created_at)
    charts = session.exec(charts_statement).all()
    
    project.charts = charts
    return project


def get_projects_by_user(session: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Project]:
    """Pobiera wszystkie projekty użytkownika"""
    statement = select(Project).where(Project.user_id == user_id).offset(skip).limit(limit)
    return session.exec(statement).all()


def get_public_projects(session: Session, skip: int = 0, limit: int = 100) -> List[Project]:
    """Pobiera wszystkie publiczne projekty"""
    statement = select(Project).where(Project.is_public == True).offset(skip).limit(limit)
    return session.exec(statement).all()


def update_project(session: Session, project_id: int, project_update: ProjectUpdate, user_id: int) -> Optional[Project]:
    """Aktualizuje projekt (tylko właściciel)"""
    statement = select(Project).where(Project.id == project_id, Project.user_id == user_id)
    db_project = session.exec(statement).first()
    
    if not db_project:
        return None
    
    update_data = project_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_project, key, value)
    
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    return db_project


def delete_project(session: Session, project_id: int, user_id: int) -> bool:
    """Usuwa projekt z wszystkimi wykresami (tylko właściciel)"""
    statement = select(Project).where(Project.id == project_id, Project.user_id == user_id)
    db_project = session.exec(statement).first()
    
    if not db_project:
        return False
    
    # Usuń najpierw wszystkie wykresy (cascade_delete powinno to zrobić automatycznie)
    charts_statement = select(Chart).where(Chart.project_id == project_id)
    charts = session.exec(charts_statement).all()
    for chart in charts:
        session.delete(chart)
    
    # Usuń projekt
    session.delete(db_project)
    session.commit()
    return True


def check_project_ownership(session: Session, project_id: int, user_id: int) -> bool:
    """Sprawdza czy użytkownik jest właścicielem projektu"""
    statement = select(Project).where(Project.id == project_id, Project.user_id == user_id)
    project = session.exec(statement).first()
    return project is not None


def get_projects_with_charts_count(session: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[dict]:
    """Pobiera projekty użytkownika z liczbą wykresów"""
    statement = select(Project).where(Project.user_id == user_id).offset(skip).limit(limit)
    projects = session.exec(statement).all()
    
    result = []
    for project in projects:
        charts_count = len(session.exec(select(Chart).where(Chart.project_id == project.id)).all())
        project_dict = project.model_dump()
        project_dict['charts_count'] = charts_count
        result.append(project_dict)
    
    return result
