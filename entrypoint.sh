#!/bin/sh
set -e

echo "MySQL is up - running migrations..."

npx prisma migrate deploy

echo "NODE_ENV=$NODE_ENV"

if [ "$NODE_ENV" = "production" ]; then
  exec pnpm run start
else
  npx prisma studio --browser none &
  exec pnpm run dev
fi