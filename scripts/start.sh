#!/bin/sh

set -e

echo "[start] Waiting for database to be ready..."

while ! nc -z "${DB_HOST}" "${DB_PORT:-3306}"; do
  echo "[start] Database at ${DB_HOST}:${DB_PORT:-3306} not ready yet. Retrying in 2s..."
  sleep 2
done

echo "[start] Database is ready."

echo "[start] Running admin seed..."
node ./dist/scripts/create-admin.js

echo "[start] Starting server..."
node dist/src/main.js
