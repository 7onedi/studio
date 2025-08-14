#!/bin/sh

pnpm install

if [ "$NODE_ENV" = "production" ]; then
  pnpm run build
  pnpm run start
else
  pnpm run dev
fi