# Stage 1: Build Frontend
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Production Server
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY server.js .
COPY .env .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 3000
CMD ["node", "server.js"]
