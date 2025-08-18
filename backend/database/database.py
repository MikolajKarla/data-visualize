from sqlmodel import create_engine, Session, SQLModel
from sqlalchemy.orm import sessionmaker

from dotenv import load_dotenv
import os
#DB Models
from database.models.user import User
from database.models.profile import Profile
from database.models.settings import Settings
from database.models.project import Project
from database.models.chart import Chart

load_dotenv()

# Use environment variable for database URL with fallback
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://username:password@localhost/dbname")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def create_db_and_tables():
    print("Tworzenie tabel w bazie danych...")
    # SQLModel.metadata.create_all() przeszukuje wszystkie załadowane modele SQLModel(table=True)
    SQLModel.metadata.create_all(engine)
    print("Tabele utworzone.")

def get_session():
    """Generator sesji do użycia z zależnościami FastAPI lub kontekstem 'with'."""
    with Session(engine) as session:
        yield session