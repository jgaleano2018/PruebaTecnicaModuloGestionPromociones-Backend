# ---------------------------------------------------------------------------
# Etapa 1: Compilación (Builder)
# ---------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# 1. Copiar manifiestos de dependencias e interfaces de TypeScript
COPY package*.json tsconfig.json nest-cli.json ./

# 2. Instalar dependencias utilizando la caché de paquetes de npm en BuildKit
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# 3. Copiar código fuente y compilar
COPY src/ ./src/
RUN npm run build

# ---------------------------------------------------------------------------
# Etapa 2: Entorno de Producción (Runner)
# ---------------------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# 1. Copiar manifiestos para dependencias de producción
COPY package*.json ./

# 2. Instalar únicamente dependencias de producción usando la caché de npm
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# 3. Copiar la app compilada y scripts necesarios
COPY --from=builder /app/dist ./dist
COPY scripts/ ./scripts/

EXPOSE 3000

CMD ["node", "dist/main.js"]