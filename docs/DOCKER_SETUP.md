# Docker Setup Guide

This guide explains how to run the **Sunu Mairie** backend using Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd backend-mairie
```

### 2. Configure environment variables

Copy the example environment file and update it with your own values:

```bash
cp .env.example .env
```

At minimum, update these values in `.env`:

```env
# Security
JWT_SECRET=your-secure-secret
JWT_RESET_SECRET=your-secure-reset-secret

# Database (used for local development only)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_NAME=mairiedb

# Default admin user
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_FULL_NAME=Admin
DEFAULT_ADMIN_PHONE=770000000
DEFAULT_ADMIN_PASSWORD=change-me-in-production

# Email (Resend)
RESEND_API_KEY=your-resend-api-key
RESEND_MAIL_DOMAIN=your-domain.com
EMAIL_FROM="Sunu Mairie <hello@your-domain.com>"
```

> **Note:** The `DB_HOST` value in `.env` is only used when running the app outside Docker. Docker Compose automatically overrides it to `db` (the database service name).

### 3. Build and start the services

```bash
docker compose up --build
```

This will:

1. Build the app Docker image.
2. Start a MySQL 8 container.
3. Wait for MySQL to be healthy.
4. Run the admin seed script.
5. Start the NestJS application.

### 4. Access the app

- API base URL: `http://localhost:3000`
- API documentation is not yet available, but endpoints are listed in the controllers.

### 5. Stop the services

```bash
# Stop containers (keeps volumes/data)
docker compose down

# Stop containers and remove all data
 docker compose down -v
```

## Services Overview

| Service | Description | Port |
|---------|-------------|------|
| `db`    | MySQL 8 database | `3306` |
| `app`   | NestJS backend API | `3000` |

## Useful Commands

```bash
# View logs
docker compose logs -f

# View logs for a specific service
docker compose logs -f app
docker compose logs -f db

# Run a command inside the app container
docker compose exec app sh

# Restart the app
docker compose restart app

# Rebuild from scratch
docker compose down -v
docker compose up --build
```

## Admin Seed

On startup, the app checks if a user with `DEFAULT_ADMIN_EMAIL` exists. If not, it creates an admin user with the role `admin`.

You can run the seed script manually:

```bash
docker compose exec app node scripts/create-admin.js
```

Or locally with a running database:

```bash
npx ts-node scripts/create-admin.ts
```

For local development without `ts-node`, run the compiled version after building:

```bash
npm run build
node scripts/create-admin.js
```

## Local Development (without Docker)

If you prefer to run the app locally, make sure you have a running MySQL database and update `.env` accordingly (`DB_HOST=localhost`). Then run:

```bash
npm install
npm run start:dev
```

To seed the admin locally:

```bash
npx ts-node scripts/create-admin.ts
```

## Troubleshooting

### App cannot connect to the database

Make sure `DB_HOST` is not set to `localhost` when running inside Docker. Docker Compose overrides it to `db` automatically. If you changed the override, verify:

```bash
docker compose exec app printenv DB_HOST
```

It should print `db`.

### Port already in use

If port `3306` or `3000` is already used, update the port mappings in `docker-compose.yml` or stop the conflicting services.

### Volumes keep old data

If you want a completely fresh start (including the database):

```bash
docker compose down -v
docker compose up --build
```

## Production Notes

- Change all default secrets and passwords.
- Use a strong `JWT_SECRET` and `JWT_RESET_SECRET`.
- Use a real Resend API key and verified domain.
- Do not expose the MySQL port publicly unless necessary.
- Consider using a reverse proxy (e.g., Nginx or Traefik) with HTTPS.
