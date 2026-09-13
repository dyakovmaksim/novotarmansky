# syntax=docker/dockerfile:1.7

# ─────────────────── deps ───────────────────
# Install all deps (incl. dev) once — used for both build and prisma generate.
FROM node:22-alpine AS deps
WORKDIR /app

# Prisma needs OpenSSL on Alpine.
RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
RUN npm ci

# Generate Prisma client against the schema. We need the schema here because
# `npm ci` doesn't run postinstall hooks for the schema-aware client.
COPY prisma ./prisma
RUN npx prisma generate

# ─────────────────── builder ───────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY package.json package-lock.json tsconfig*.json nest-cli.json ./
COPY src ./src

RUN npm run build && npm prune --omit=dev

# ─────────────────── runtime ───────────────────
FROM node:22-alpine AS runtime
WORKDIR /app

# OpenSSL + tini for proper PID 1 (so SIGTERM reaches Node, shutdown hooks fire).
RUN apk add --no-cache openssl tini

ENV NODE_ENV=production
ENV PORT=3001

# Pruned production deps + compiled JS + Prisma schema (needed by `migrate deploy`).
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package.json ./

# Telegram promotion photos are written here. A named volume is mounted at
# runtime, but this ownership is also used when Docker initializes it.
RUN mkdir -p /app/uploads/promotions /app/uploads/gallery && chown -R node:node /app/uploads

# Run as the non-root user already provided by the node image.
USER node

EXPOSE 3001

# tini → migrate (applies pending migrations on boot) → node.
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
