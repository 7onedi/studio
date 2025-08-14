# 1. Build stage
FROM node:22 AS builder
WORKDIR /app

# Увімкнути corepack і активувати pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Копіюємо lockfile та manifest
COPY package.json pnpm-lock.yaml ./

# Встановлюємо всі залежності (dev + prod)
RUN pnpm install --frozen-lockfile

# Копіюємо весь код
COPY . .

# Білдимо проєкт
RUN pnpm build

# 2. Production stage
FROM node:22-slim AS production
WORKDIR /app

# Увімкнути corepack (вже є в Node 22)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Встановити лише необхідні бібліотеки для запуску (можна пропустити, якщо немає native deps)
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Копіюємо тільки необхідне з builder
COPY --from=builder /app ./
COPY --from=builder /app/node_modules ./node_modules

# Установлюємо продакшн-режим
ENV NODE_ENV=production

# Виставляємо порт
EXPOSE 3000

# Копіюємо і активуємо entrypoint
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
