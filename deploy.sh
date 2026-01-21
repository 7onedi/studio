#!/usr/bin/env bash
set -e

git pull origin main

docker compose stop
docker compose build --no-cache
docker compose up -d
docker image prune -f
