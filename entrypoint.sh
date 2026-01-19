#!/bin/sh
set -e

echo "NODE_ENV=$NODE_ENV"

if [ "$NODE_ENV" = "production" ]; then
  exec pnpm run start
else
  exec pnpm run dev
fi