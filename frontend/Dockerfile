# syntax=docker/dockerfile:1.7

# ─────────────────── builder ───────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Nuxt config + sources. We copy the rest in one shot — sources change often
# but layer cache for node_modules above stays warm.
COPY . .

# NUXT_PUBLIC_* baked at build time. Override at `docker compose build` via
# `--build-arg` or in compose `args:` block.
ARG NUXT_PUBLIC_API_BASE=/api
ARG NUXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NUXT_PUBLIC_HOUSE_TITLE="Novotarmanskiy house"
ARG NUXT_PUBLIC_HOUSE_PRICE_PER_NIGHT=5000
ARG NUXT_PUBLIC_SAUNA_PRICE=3000
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE
ENV NUXT_PUBLIC_SITE_URL=$NUXT_PUBLIC_SITE_URL
ENV NUXT_PUBLIC_HOUSE_TITLE=$NUXT_PUBLIC_HOUSE_TITLE
ENV NUXT_PUBLIC_HOUSE_PRICE_PER_NIGHT=$NUXT_PUBLIC_HOUSE_PRICE_PER_NIGHT
ENV NUXT_PUBLIC_SAUNA_PRICE=$NUXT_PUBLIC_SAUNA_PRICE

RUN npm run build

# ─────────────────── runtime ───────────────────
FROM node:22-alpine AS runtime
WORKDIR /app

RUN apk add --no-cache tini

ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

# Nuxt resolves public runtime config when Nitro starts, not only while the
# client bundle is built. Keep the production values in the final image too.
ARG NUXT_PUBLIC_API_BASE=/api
ARG NUXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NUXT_PUBLIC_HOUSE_TITLE="Novotarmanskiy house"
ARG NUXT_PUBLIC_HOUSE_PRICE_PER_NIGHT=5000
ARG NUXT_PUBLIC_SAUNA_PRICE=3000
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE
ENV NUXT_PUBLIC_SITE_URL=$NUXT_PUBLIC_SITE_URL
ENV NUXT_PUBLIC_HOUSE_TITLE=$NUXT_PUBLIC_HOUSE_TITLE
ENV NUXT_PUBLIC_HOUSE_PRICE_PER_NIGHT=$NUXT_PUBLIC_HOUSE_PRICE_PER_NIGHT
ENV NUXT_PUBLIC_SAUNA_PRICE=$NUXT_PUBLIC_SAUNA_PRICE

# Self-contained Nitro server bundle (.output already has everything it needs).
COPY --from=builder /app/.output ./.output

USER node

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", ".output/server/index.mjs"]
