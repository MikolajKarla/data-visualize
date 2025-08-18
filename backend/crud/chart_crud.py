from typing import List, Optional
from sqlmodel import Session, select
from database.models.chart import Chart
from database.models.project import Project
from schemas.chart import ChartCreate, ChartUpdate


def create_chart(session: Session, chart: ChartCreate, user_id: int) -> Optional[Chart]:
    """Tworzy nowy wykres dla projektu (sprawdza czy użytkownik jest właścicielem projektu)"""
    # Sprawdź czy projekt należy do użytkownika
    project_statement = select(Project).where(Project.id == chart.project_id, Project.user_id == user_id)
    project = session.exec(project_statement).first()
    
    if not project:
        return None
    
    db_chart = Chart(
        title=chart.title,
        description=chart.description,
        chart_image_path=chart.chart_image_path,
        chart_type=chart.chart_type,
        chart_config=chart.chart_config,
        x_columns=chart.x_columns,
        y_columns=chart.y_columns,
        order_index=chart.order_index,
        project_id=chart.project_id
    )
    session.add(db_chart)
    session.commit()
    session.refresh(db_chart)
    return db_chart


def get_chart_by_id(session: Session, chart_id: int) -> Optional[Chart]:
    """Pobiera wykres po ID"""
    statement = select(Chart).where(Chart.id == chart_id)
    return session.exec(statement).first()


def get_charts_by_project(session: Session, project_id: int, user_id: int) -> List[Chart]:
    """Pobiera wszystkie wykresy projektu (sprawdza czy użytkownik jest właścicielem)"""
    # Sprawdź czy projekt należy do użytkownika
    project_statement = select(Project).where(Project.id == project_id, Project.user_id == user_id)
    project = session.exec(project_statement).first()
    
    if not project:
        return []
    
    statement = select(Chart).where(Chart.project_id == project_id).order_by(Chart.order_index, Chart.created_at)
    return session.exec(statement).all()


def get_public_charts_by_project(session: Session, project_id: int) -> List[Chart]:
    """Pobiera wszystkie wykresy publicznego projektu"""
    # Sprawdź czy projekt jest publiczny
    project_statement = select(Project).where(Project.id == project_id, Project.is_public == True)
    project = session.exec(project_statement).first()
    
    if not project:
        return []
    
    statement = select(Chart).where(Chart.project_id == project_id).order_by(Chart.order_index, Chart.created_at)
    return session.exec(statement).all()


def update_chart(session: Session, chart_id: int, chart_update: ChartUpdate, user_id: int) -> Optional[Chart]:
    """Aktualizuje wykres (sprawdza czy użytkownik jest właścicielem projektu)"""
    # Sprawdź czy wykres istnieje i należy do projektu użytkownika
    statement = select(Chart).join(Project).where(
        Chart.id == chart_id, 
        Project.user_id == user_id
    )
    db_chart = session.exec(statement).first()
    
    if not db_chart:
        return None
    
    update_data = chart_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_chart, key, value)
    
    session.add(db_chart)
    session.commit()
    session.refresh(db_chart)
    return db_chart


def delete_chart(session: Session, chart_id: int, user_id: int) -> bool:
    """Usuwa wykres (sprawdza czy użytkownik jest właścicielem projektu)"""
    statement = select(Chart).join(Project).where(
        Chart.id == chart_id, 
        Project.user_id == user_id
    )
    db_chart = session.exec(statement).first()
    
    if not db_chart:
        return False
    
    session.delete(db_chart)
    session.commit()
    return True


def reorder_charts(session: Session, project_id: int, chart_orders: List[dict], user_id: int) -> bool:
    """Zmienia kolejność wykresów w projekcie"""
    # Sprawdź czy projekt należy do użytkownika
    project_statement = select(Project).where(Project.id == project_id, Project.user_id == user_id)
    project = session.exec(project_statement).first()
    
    if not project:
        return False
    
    # Aktualizuj kolejność dla każdego wykresu
    for order_data in chart_orders:
        chart_id = order_data.get('chart_id')
        new_order = order_data.get('order_index')
        
        statement = select(Chart).where(Chart.id == chart_id, Chart.project_id == project_id)
        chart = session.exec(statement).first()
        
        if chart:
            chart.order_index = new_order
            session.add(chart)
    
    session.commit()
    return True


def count_charts_in_project(session: Session, project_id: int) -> int:
    """Zlicza ilość wykresów w projekcie"""
    statement = select(Chart).where(Chart.project_id == project_id)
    return len(session.exec(statement).all())
