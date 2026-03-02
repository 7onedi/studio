#!/bin/bash
# assignAdminDocker.sh
# Використання: ./assignAdminDocker.sh user@example.com

EMAIL="$1"

if [ -z "$EMAIL" ]; then
  echo "Usage: $0 user@example.com"
  exit 1
fi

# -------------------------------
# Завантажуємо змінні з .env
# -------------------------------
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# -------------------------------
# Дані MySQL з .env
# -------------------------------
DB_USER="${MYSQL_USER:-studio_user}"
DB_PASS="${MYSQL_PASSWORD:-studio_pass}"
DB_NAME="${MYSQL_DATABASE:-studio}"

# -------------------------------
# Автоматичне визначення контейнера MySQL
# -------------------------------
# Використовуємо DATABASE_HOST з .env, наприклад "studio-mysql"
MYSQL_CONTAINER=$(docker ps --filter "name=${DATABASE_HOST}" --format "{{.Names}}" | head -n 1)

if [ -z "$MYSQL_CONTAINER" ]; then
  echo "Cannot find MySQL container matching DATABASE_HOST=$DATABASE_HOST"
  exit 1
fi

echo "Using MySQL container: $MYSQL_CONTAINER"

# -------------------------------
# Виконуємо запит у контейнері з MySQL
# -------------------------------
docker exec -i "$MYSQL_CONTAINER" mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" <<EOF
UPDATE \`User\`
SET role = 'ADMIN'
WHERE email = '$EMAIL';
SELECT email, role FROM \`User\` WHERE email = '$EMAIL';
EOF