# Dockerfile — indhiraDiputada-api v0.2.0
FROM node:20-alpine

# Dependencias del sistema para bcryptjs y sharp
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Instalar dependencias primero (cache layer)
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar código fuente
COPY . .

# Directorio de uploads (persistido via volume)
RUN mkdir -p uploads

EXPOSE 3001

CMD ["node", "src/index.js"]
