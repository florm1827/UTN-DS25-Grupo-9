# Backend Dockerfile
FROM node:20-slim
# Instalar dependencias del sistema para Prisma
RUN apt-get update -y && apt-get install -y openssl
# Directorio de trabajo dentro del contenedor
WORKDIR /app
# Copiar solo archivos de dependencias
COPY package*.json ./
# Instalar dependencias en la imagen
RUN npm install
# Copiar archivos de Prisma
COPY prisma ./prisma/
# Generar Prisma Client
RUN npx prisma generate
# Copiar el resto del código
COPY . .
# Exponer puerto del servidor
EXPOSE 3000
# Comando por defecto al iniciar el contenedor
CMD ["npm", "run", "dev"]