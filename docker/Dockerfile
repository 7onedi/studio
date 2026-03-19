FROM node:22 AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN npx prisma generate

# Dev зупиняється тут
FROM base AS development
EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]

# Prod білдить далі
FROM base AS builder
RUN pnpm build

FROM node:22-slim AS production
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apt-get update && apt-get install -y ca-certificates openssl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/trace-exec.cjs ./

EXPOSE 3000
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]