set -e

echo "NODE_ENV=$NODE_ENV"

if [ "$NODE_ENV" = "production" ]; then
  pnpm install --frozen-lockfile
  pnpm run build
  pnpm run start
else
  pnpm run dev
fi