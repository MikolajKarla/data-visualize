from sqlmodel import Field, Session, SQLModel, create_engine, select



class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True, nullable=False)
    email: str = Field(index=True, unique=True, nullable=False)
    full_name: str = Field(default=None, nullable=True)
    hashed_password: str = Field(nullable=False)
    is_active: bool = Field(default=True, nullable=False)
    is_superuser: bool = Field(default=False, nullable=False)