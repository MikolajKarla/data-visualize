from sqlmodel import create_engine, Session, SQLModel
from dotenv import load_dotenv
import os
#DB Models
from database.models.user import User
from database.models.profile import Profile
from database.models.settings import Settings

load_dotenv()

engine = create_engine(f"postgresql://postgres:{os.getenv('DBUSER')}@{os.getenv('DBPASSWORD')}:{os.getenv('DBPORT')}/{os.getenv("DBNAME")}",echo=True)

def create_db_and_tables():
    print("Tworzenie tabel w bazie danych...")
    # SQLModel.metadata.create_all() przeszukuje wszystkie załadowane modele SQLModel(table=True)
    SQLModel.metadata.create_all(engine)
    print("Tabele utworzone.")

def get_session():
    """Generator sesji do użycia z zależnościami FastAPI lub kontekstem 'with'."""
    with Session(engine) as session:
        yield session