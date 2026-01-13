#!/bin/sh
set -e

echo "NODE_ENV=$NODE_ENV"

pnpm install

if [ "$NODE_ENV" = "production" ]; then
  pnpm run build
  exec pnpm run start
else
  exec pnpm run dev
fi
