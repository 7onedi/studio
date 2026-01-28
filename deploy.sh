#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

git pull origin main

# 1) Спочатку білдимо (без даунтайму)
docker compose build --no-cache

# 2) Потім піднімаємо/оновлюємо (compose сам перезапустить що треба)
docker compose up -d --remove-orphans

# 3) Показати статус (щоб одразу бачити, чи все ок)
docker compose ps

# 4) Чистка сміття (обережніше)
docker image prune -f