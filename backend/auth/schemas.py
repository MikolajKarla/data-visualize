from typing import Optional
from sqlmodel import SQLModel

# Schemat dla danych logowania
class UserLogin(SQLModel):
    email: str
    password: str

# Schemat dla odpowiedzi tokena (po zalogowaniu)
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"

# Schemat dla danych użytkownika bez hasła (do zwracania)
class UserRead(SQLModel):
    id: int
    email: str

# Schemat dla rejestracji (może być rozszerzony)
class UserCreate(SQLModel):
    email: str
    password: str
    first_name: Optional[str] = None # Zgodnie z funkcją create_user_with_profile_and_settings