#!/bin/bash
# Використання: ./resetPass.sh user@example.com newpassword

#!/bin/bash
EMAIL="$1"
PASSWORD="$2"

if [ -z "$EMAIL" ] || [ -z "$PASSWORD" ]; then
  echo "Usage: $0 user@example.com newpassword"
  exit 1
fi

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

DB_USER="${MYSQL_USER:-studio_user}"
DB_PASS="${MYSQL_PASSWORD:-studio_pass}"
DB_NAME="${MYSQL_DATABASE:-studio}"

HASH=$(docker exec studio-app-1 node -e "const b=require('/app/node_modules/bcryptjs');console.log(b.hashSync('$PASSWORD', 10))")

echo "Generated hash: $HASH"

if [ -z "$HASH" ]; then
  echo "Failed to generate hash"
  exit 1
fi

MYSQL_CONTAINER=$(docker ps --filter "name=${DATABASE_HOST}" --format "{{.Names}}" | head -n 1)

if [ -z "$MYSQL_CONTAINER" ]; then
  echo "Cannot find MySQL container"
  exit 1
fi

echo "Using MySQL container: $MYSQL_CONTAINER"

docker exec -i "$MYSQL_CONTAINER" mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" <<EOF
UPDATE \`User\`
SET passwordHash = '$HASH'
WHERE email = '$EMAIL';
SELECT email FROM \`User\` WHERE email = '$EMAIL';
EOF