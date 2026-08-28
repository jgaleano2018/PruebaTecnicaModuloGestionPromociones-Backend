# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json nest-cli.json ./
RUN npm ci

COPY src/ ./src/
RUN npm run build

# Production runtime stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY scripts/ ./scripts/

EXPOSE 3000

CMD ["node", "dist/main.js"]
