# Environment Configuration Guide

## 📁 Pliki środowiskowe

### Dostępne pliki:
- `.env` - **Główny plik** (obecnie skonfigurowany dla developmentu)
- `.env.development` - **Konfiguracja developerska** z wszystkimi ustawieniami
- `.env.production` - **Konfiguracja produkcyjna** z zabezpieczeniami
- `.env.example` - **Szablon** z przykładowymi wartościami

---

## 🚀 Jak używać środowisk

### Dla Development (Zalecane):
```bash
# Opcja 1: Użyj głównego pliku .env (już skonfigurowany)
docker-compose -f docker-compose.dev.yml up --build

# Opcja 2: Użyj dedykowanego pliku .env.development
cp .env.development .env
docker-compose -f docker-compose.dev.yml up --build
```

### Dla Production:
```bash
# Skopiuj konfigurację produkcyjną
cp .env.production .env

# WAŻNE: Zmień hasła i klucze na bezpieczne wartości!
# Edytuj .env i zmień:
# - POSTGRES_PASSWORD
# - JWT_SECRET_KEY
# - NEXT_PUBLIC_API_URL
# - NEXT_PUBLIC_APP_URL

# Uruchom w trybie produkcyjnym
docker-compose -f docker-compose.prod.yml up --build
```

---

## ⚙️ Kluczowe ustawienia

### 🔧 Development:
- `NODE_ENV=development`
- `DEBUG=true`
- `LOG_LEVEL=DEBUG`
- `ENABLE_HOT_RELOAD=true`
- Słabe hasła (bezpieczne dla developmentu)
- Dłuższy czas wygaśnięcia tokenów (60 min)

### 🔒 Production:
- `NODE_ENV=production`
- `DEBUG=false`
- `LOG_LEVEL=INFO`
- `ENABLE_HOT_RELOAD=false`
- Silne hasła (MUSISZ ZMIENIĆ!)
- Krótszy czas wygaśnięcia tokenów (15 min)
- Dodatkowe zabezpieczenia SSL

---

## 🛡️ Bezpieczeństwo - WAŻNE!

### ⚠️ Przed wdrożeniem na produkcję:

1. **Zmień hasła:**
   ```env
   POSTGRES_PASSWORD=TWOJE_BARDZO_BEZPIECZNE_HASŁO
   JWT_SECRET_KEY=TWÓJ_BARDZO_BEZPIECZNY_KLUCZ_JWT
   ```

2. **Ustaw domeny:**
   ```env
   NEXT_PUBLIC_API_URL=https://twoja-domena-api.com
   NEXT_PUBLIC_APP_URL=https://twoja-domena-app.com
   ```

3. **Sprawdź ustawienia SSL:**
   ```env
   SECURE_SSL_REDIRECT=true
   SESSION_COOKIE_SECURE=true
   CSRF_COOKIE_SECURE=true
   ```

---

## 🎯 Szybki start

### Nowy developer:
```bash
# 1. Skopiuj szablon
cp .env.example .env

# 2. Wypełnij podstawowe wartości w .env
# 3. Uruchom development
docker-compose -f docker-compose.dev.yml up --build
```

### Deployment na produkcję:
```bash
# 1. Skopiuj konfigurację produkcyjną
cp .env.production .env

# 2. Edytuj .env i zmień wszystkie hasła/klucze
# 3. Ustaw rzeczywiste domeny
# 4. Uruchom produkcję
docker-compose -f docker-compose.prod.yml up --build
```

---

## 📝 Zmienne środowiskowe

| Zmienna | Development | Production | Opis |
|---------|-------------|------------|------|
| `POSTGRES_PASSWORD` | `dev_password_123` | `ZMIEŃ_MNIE!` | Hasło do bazy danych |
| `JWT_SECRET_KEY` | `dev_jwt_secret...` | `ZMIEŃ_MNIE!` | Klucz do JWT |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | `15` | Czas wygaśnięcia tokenu |
| `DEBUG` | `true` | `false` | Tryb debug |
| `LOG_LEVEL` | `DEBUG` | `INFO` | Poziom logowania |
| `MAX_FILE_SIZE` | `50MB` | `20MB` | Maksymalny rozmiar pliku |

---

## 🔍 Troubleshooting

### Problem: "Database connection failed"
```bash
# Sprawdź czy wszystkie zmienne są ustawione
grep -E "(POSTGRES|DB)" .env

# Sprawdź czy kontener bazy danych działa
docker-compose -f docker-compose.dev.yml ps
```

### Problem: "JWT token invalid"
```bash
# Sprawdź czy JWT_SECRET_KEY jest ustawiony
grep JWT_SECRET_KEY .env

# Wygeneruj nowy klucz jeśli potrzeba
openssl rand -hex 32
```

### Problem: Hot reload nie działa
```bash
# Sprawdź czy masz ustawienia polling
grep -E "(CHOKIDAR|WATCHPACK)" .env
```