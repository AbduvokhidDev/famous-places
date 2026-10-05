FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm install
# RUN apt-get update -y && apt-get install -y openssl

COPY . .
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN npx prisma generate

EXPOSE 3000
CMD ["node", "src/server.js"]

