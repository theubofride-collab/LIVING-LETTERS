#!/bin/sh
# Living Letters Backend — Render startup script

if [ -n "$DATABASE_URL" ]; then
  # DATABASE_URL = postgresql://user:pass@host/dbname
  # Strip protocol prefix
  STRIPPED=$(echo "$DATABASE_URL" | sed 's|^postgresql://||')
  # Extract user:pass and host/db
  USER_PASS=$(echo "$STRIPPED" | cut -d'@' -f1)
  HOST_DB=$(echo "$STRIPPED" | cut -d'@' -f2)
  DB_USER=$(echo "$USER_PASS" | cut -d':' -f1)
  DB_PASS=$(echo "$USER_PASS" | cut -d':' -f2-)
  DB_HOST=$(echo "$HOST_DB" | cut -d'/' -f1)
  DB_NAME=$(echo "$HOST_DB" | cut -d'/' -f2 | cut -d'?' -f1)

  export SPRING_DATASOURCE_URL="jdbc:postgresql://${DB_HOST}:5432/${DB_NAME}?sslmode=require"
  export SPRING_DATASOURCE_USERNAME="$DB_USER"
  export SPRING_DATASOURCE_PASSWORD="$DB_PASS"
elif [ -n "$DB_HOST" ]; then
  export SPRING_DATASOURCE_URL="jdbc:postgresql://${DB_HOST}:${DB_PORT:-5432}/${DB_NAME:-livingletters}?sslmode=require"
  export SPRING_DATASOURCE_USERNAME="$DB_USER"
  export SPRING_DATASOURCE_PASSWORD="$DB_PASSWORD"
fi

echo "=== URL: ${SPRING_DATASOURCE_URL:-NOT SET} ==="
echo "=== USER: ${SPRING_DATASOURCE_USERNAME:-NOT SET} ==="

exec java -Xmx384m -jar -Dspring.profiles.active=prod app.jar
