FROM node:18-alpine

# Ustaw katalog roboczy
WORKDIR /app

# Skopiuj pliki
COPY package.json package-lock.json ./
RUN npm install

# Skopiuj resztę plików
COPY . .

# Zbuduj aplikację
RUN npm run dev

# Uruchomienie aplikacji Next.js
CMD ["npm", "run", "start"]
