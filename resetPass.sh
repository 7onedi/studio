#!/bin/bash
# Використання: ./resetPass.sh user@example.com newpassword

EMAIL="$1"
PASSWORD="$2"

if [ -z "$EMAIL" ] || [ -z "$PASSWORD" ]; then
  echo "Usage: $0 user@example.com newpassword"
  exit 1
fi

# -------------------------------
# Завантажуємо .env
# -------------------------------
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

DB_USER="${MYSQL_USER:-studio_user}"
DB_PASS="${MYSQL_PASSWORD:-studio_pass}"
DB_NAME="${MYSQL_DATABASE:-studio}"

# -------------------------------
# Генеруємо bcrypt хеш через node
# -------------------------------
HASH=$(node -e "console.log(require('bcryptjs').hashSync('$PASSWORD', 10))")

echo "Generated hash: $HASH"

# -------------------------------
# Знаходимо контейнер
# -------------------------------
MYSQL_CONTAINER=$(docker ps --filter "name=${DATABASE_HOST}" --format "{{.Names}}" | head -n 1)

if [ -z "$MYSQL_CONTAINER" ]; then
  echo "Cannot find MySQL container"
  exit 1
fi

echo "Using MySQL container: $MYSQL_CONTAINER"

# -------------------------------
# Оновлюємо пароль
# -------------------------------
docker exec -i "$MYSQL_CONTAINER" mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" <<EOF
UPDATE \`User\`
SET passwordHash = '$HASH'
WHERE email = '$EMAIL';

SELECT email FROM \`User\` WHERE email = '$EMAIL';
EOF