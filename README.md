# novotarmansky

Сайт-лендинг с бронированием загородного дома «Новотарманский». Заявки приходят админу в Telegram, статусы (Ожидает / Подтверждено / Отменено) ведутся прямо из бота.

См. [CLAUDE.md](CLAUDE.md) — подробный контекст проекта для разработки, [BACKLOG.md](BACKLOG.md) — что ещё доделать.

## Стек

- **Backend:** NestJS 11 + Prisma 6 + PostgreSQL 16, встроенный Telegram-бот (long-polling)
- **Frontend:** Nuxt 3 + Vue 3 + Sass
- **Прокси:** nginx + Let's Encrypt
- **Контейнеры:** docker-compose (db + backend + frontend + nginx)

## Локальная разработка

Нужен PostgreSQL (локально или в Docker).

```bash
# 1. Postgres в Docker (один контейнер):
docker run -d --name novotarmansky-pg --restart unless-stopped \
  -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=novotarmansky \
  -p 5432:5432 -v novotarmansky_pg_data:/var/lib/postgresql/data postgres:16-alpine

# 2. Backend:
cd backend
npm install
cp .env.example .env       # отредактировать TELEGRAM_*
npx prisma migrate deploy  # применить миграции
npm run start:dev          # → http://localhost:3001

# 3. Frontend (в другом терминале):
cd frontend
npm install
npm run dev                # → http://localhost:3000
```

## Деплой (VPS + Docker)

Один `docker compose up -d --build` на сервере поднимает всё: postgres, backend, frontend, nginx.

### 1. Подготовка сервера

```bash
# Установить Docker и docker compose plugin (Debian/Ubuntu)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER  # перелогиниться

# Открыть порты
sudo ufw allow 80
sudo ufw allow 443
```

### 2. Клон и конфиг

```bash
git clone <repo-url> /opt/novotarmansky
cd /opt/novotarmansky

# Скопировать пример env и заполнить
cp .env.production.example .env
nano .env                                       # SITE_URL, DB_PASSWORD, TELEGRAM_*

# Подставить домен в nginx-конфиг
sed -i 's/<DOMAIN>/your-domain.com/g' nginx/default.conf
```

### 3. Первый запуск без HTTPS (для выпуска сертификата)

```bash
# Временно закомментировать HTTPS-сервер в nginx/default.conf
# (или просто запустить — порт 443 не отвечает, но 80 уже принимает ACME-challenge)

docker compose up -d db backend frontend nginx
```

### 4. Выпуск Let's Encrypt сертификата

```bash
docker compose run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d your-domain.com -d www.your-domain.com \
  --email you@example.com --agree-tos --no-eff-email
```

### 5. Включить HTTPS

```bash
# Раскомментировать HTTPS-сервер в nginx/default.conf, затем:
docker compose exec nginx nginx -s reload
```

Сайт доступен на `https://your-domain.com`. API — `https://your-domain.com/api/...`.

### 6. Автообновление сертификата

В `cron` (рут):

```cron
0 3 * * * cd /opt/novotarmansky && docker compose run --rm certbot renew --quiet && docker compose exec nginx nginx -s reload
```

## Обновление кода на проде

```bash
cd /opt/novotarmansky
git pull
docker compose up -d --build backend frontend
# Миграции применяются в entrypoint backend-контейнера автоматически.
```

## Полезные команды

```bash
# Логи всех сервисов
docker compose logs -f

# Только backend
docker compose logs -f backend

# Заглянуть в БД
docker compose exec db psql -U "$DB_USER" -d "$DB_NAME"

# Перезапустить только backend (например, после изменения .env)
docker compose up -d --force-recreate backend
```

## Структура

```
novotarmansky/
├── backend/             NestJS + Prisma
│   ├── Dockerfile       multi-stage build
│   ├── prisma/          schema + migrations
│   └── src/             app code (bookings, telegram)
├── frontend/            Nuxt 3
│   ├── Dockerfile       multi-stage build
│   ├── pages/           маршруты сайта
│   └── components/      Vue-компоненты + иконки
├── nginx/
│   └── default.conf     reverse-proxy + TLS
├── docker-compose.yml
└── .env.production.example
```
