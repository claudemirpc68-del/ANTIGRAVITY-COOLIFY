# Estágio 1: Build do React
FROM node:20-alpine AS build-frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Instalar dependências do servidor Node.js
FROM node:20-alpine AS build-server
WORKDIR /server
COPY server/package*.json ./
RUN npm install --production

# Estágio 3: Imagem final com Nginx + Node.js
FROM nginx:stable-alpine

# Instalar Node.js na imagem Nginx
RUN apk add --no-cache nodejs npm

# Copiar o build do React para o Nginx
COPY --from=build-frontend /app/dist /usr/share/nginx/html

# Copiar a configuração do Nginx com proxy /api/*
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar o servidor Node.js
COPY --from=build-server /server/node_modules /server/node_modules
COPY server/ /server/

EXPOSE 80

# Script de inicialização: roda o Node.js em background e depois o Nginx
CMD ["sh", "-c", "node /server/index.js & nginx -g 'daemon off;'"]
