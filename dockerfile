# 1) Build del Frontend
FROM node:18-bullseye-slim AS build-frontend
WORKDIR /app/frontend

COPY undersounds-frontend/package*.json ./
COPY undersounds-frontend/vite.config.js ./
COPY undersounds-frontend/index.html ./

RUN npm ci
COPY undersounds-frontend/src ./src
RUN npm run build

# 2) Imagen final con MongoDB + API + SPA
FROM node:18-bullseye-slim

# Instalar MongoDB-org desde el repo oficial
RUN apt-get update \
 && apt-get install -y gnupg curl \
 && curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc \
    | gpg --dearmor -o /usr/share/keyrings/mongodb-archive-keyring.gpg \
 && echo "deb [ signed-by=/usr/share/keyrings/mongodb-archive-keyring.gpg ] \
    https://repo.mongodb.org/apt/debian bullseye/mongodb-org/6.0 main" \
    > /etc/apt/sources.list.d/mongodb-org.list \
 && apt-get update \
 && apt-get install -y mongodb-org \
 && rm -rf /var/lib/apt/lists/*

# crear carpetas de datos y workdir
RUN mkdir -p /data/db /app
WORKDIR /app

# deps y código del backend
COPY undersounds-backend/package*.json ./
RUN npm ci --only=production
COPY undersounds-backend/. ./

# instalar mongoimport (mongodb-database-tools)
RUN apt-get update \
 && apt-get install -y mongodb-database-tools \
 && rm -rf /var/lib/apt/lists/*

# copiar dump de datos que vive dentro del backend
COPY undersounds-backend/data-dump ./data-dump

# copiar SPA compilada y assets
COPY --from=build-frontend /app/frontend/build ./public
COPY undersounds-frontend/src/assets ./public/assets

EXPOSE 5000

ENTRYPOINT ["bash", "-c", "mongod --dbpath /data/db --bind_ip 127.0.0.1 & exec node server.js"]