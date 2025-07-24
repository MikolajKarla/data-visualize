FROM node:18-alpine

# Ustaw katalog roboczy
WORKDIR /app

# Skopiuj pliki package.json i package-lock.json
# Robimy to jako pierwszy krok, aby wykorzystać cache Dockera.
# Zależności instalowane są tylko, gdy te pliki się zmienią.
COPY package.json package-lock.json ./
RUN npm install

# Skopiuj resztę plików aplikacji
# Dzięki mapowaniu woluminów w docker-compose.yml,
# zmiany w tych plikach na hoście będą widoczne w kontenerze.
COPY . .

# W trybie deweloperskim, to jest komenda, która uruchamia serwer deweloperski
CMD ["npm", "run", "dev"]