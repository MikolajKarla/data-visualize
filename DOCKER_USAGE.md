# Docker Compose - Instrukcje użycia

## Środowisko Developerskie (Zalecane)

### Uruchomienie
```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Uruchomienie w tle
```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

### Uruchomienie z pgAdmin (opcjonalne)
```bash
docker-compose -f docker-compose.dev.yml --profile tools up --build
```

### Funkcje developerskie:
- ✅ **Hot reload** dla backend (FastAPI) i frontend (Next.js)
- ✅ **Live reloading** - zmiany w kodzie są natychmiast widoczne
- ✅ **Volume mapping** - zmiany w plikach na hoście są synchronizowane z kontenerami
- ✅ **pgAdmin** dla zarządzania bazą danych (opcjonalne)
- ✅ **Health checks** dla wszystkich serwisów
- ✅ **Lepsze file watching** na Windows
- ✅ **Debug-friendly** konfiguracja

### Dostęp do serwisów:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Database: localhost:5432
- pgAdmin: http://localhost:5050 (login: admin@admin.com / admin)

---

## Środowisko Produkcyjne

### Uruchomienie
```bash
docker-compose -f docker-compose.prod.yml up --build
```

### Uruchomienie z Nginx (zalecane dla produkcji)
```bash
docker-compose -f docker-compose.prod.yml --profile with-nginx up --build
```

### Funkcje produkcyjne:
- ✅ **Multi-stage builds** - zoptymalizowane obrazy
- ✅ **Non-root users** - zwiększone bezpieczeństwo
- ✅ **Resource limits** - kontrola zasobów
- ✅ **Health checks** - monitoring zdrowia aplikacji
- ✅ **Nginx reverse proxy** - load balancing i caching
- ✅ **Gzip compression** - szybsze ładowanie
- ✅ **Security headers** - zabezpieczenia HTTP
- ✅ **Rate limiting** - ochrona przed atakami

### Dostęp do serwisów:
- Frontend: http://localhost:3000 (lub http://localhost:80 z Nginx)
- Backend: http://localhost:8000
- Database: localhost:5432

---

## Przydatne komendy

### Zatrzymanie kontenerów
```bash
# Development
docker-compose -f docker-compose.dev.yml down

# Production
docker-compose -f docker-compose.prod.yml down
```

### Zatrzymanie z usunięciem woluminów
```bash
# Development
docker-compose -f docker-compose.dev.yml down -v

# Production
docker-compose -f docker-compose.prod.yml down -v
```

### Rebuild konkretnego serwisu
```bash
# Development
docker-compose -f docker-compose.dev.yml up --build backend

# Production
docker-compose -f docker-compose.prod.yml up --build frontend
```

### Sprawdzenie logów
```bash
# Development
docker-compose -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.dev.yml logs -f frontend

# Production
docker-compose -f docker-compose.prod.yml logs -f
```

### Wejście do kontenera
```bash
# Development
docker exec -it backend_dev bash
docker exec -it frontend_dev sh

# Production
docker exec -it backend_prod bash
docker exec -it frontend_prod sh
```

---

## Konfiguracja środowiska

Upewnij się, że masz plik `.env` w katalogu głównym z następującymi zmiennymi:

```env
POSTGRES_DB=data_visualize
POSTGRES_USER=admin
POSTGRES_PASSWORD=your_secure_password
JWT_SECRET_KEY=your_jwt_secret_key
```

---

## Różnice między środowiskami

| Funkcja | Development | Production |
|---------|-------------|------------|
| Hot Reload | ✅ | ❌ |
| Volume Mapping | ✅ | ❌ |
| Multi-stage Build | ❌ | ✅ |
| Resource Limits | ❌ | ✅ |
| Security Headers | ❌ | ✅ |
| Nginx Proxy | ❌ | ✅ (opcjonalne) |
| Non-root Users | ❌ | ✅ |
| Build Optimization | ❌ | ✅ |

---

## Troubleshooting

### Problem z file watching na Windows
Jeśli hot reload nie działa, sprawdź czy w `.env` masz:
```env
CHOKIDAR_USEPOLLING=true
WATCHPACK_POLLING=true
```

### Problem z permissions
Jeśli występują problemy z uprawnieniami, możesz uruchomić:
```bash
docker-compose -f docker-compose.dev.yml exec backend chown -R $(id -u):$(id -g) /app
```

### Czyszczenie cache Dockera
```bash
docker system prune -a
```