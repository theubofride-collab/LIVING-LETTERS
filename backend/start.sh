#!/bin/sh
# Living Letters Backend — Render startup script

if [ -n "$DB_HOST" ]; then
  HOST="$DB_HOST"
  if echo "$HOST" | grep -qv '\.'; then
    HOST="${HOST}.internal"
  fi
  export SPRING_DATASOURCE_URL="jdbc:postgresql://${HOST}:${DB_PORT:-5432}/${DB_NAME:-livingletters}"
  export SPRING_DATASOURCE_USERNAME="$DB_USER"
  export SPRING_DATASOURCE_PASSWORD="$DB_PASSWORD"
elif [ -n "$DATABASE_URL" ]; then
  URL="${DATABASE_URL#postgresql://}"
  CREDS="${URL%%@*}"
  REST="${URL#*@}"
  DB_USER="${CREDS%%:*}"
  DB_PASS="${CREDS#*:}"
  HOST_PORT="${REST%%/*}"
  DB_NAME="${REST#*/}"
  DB_NAME="${DB_NAME%%\?*}"
  if echo "$HOST_PORT" | grep -q ":"; then
    DB_HOST="${HOST_PORT%%:*}"
    DB_PORT="${HOST_PORT#*:}"
  else
    DB_HOST="$HOST_PORT"
    DB_PORT="5432"
  fi
  if echo "$DB_HOST" | grep -qv '\.'; then
    DB_HOST="${DB_HOST}.internal"
  fi
  export SPRING_DATASOURCE_URL="jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}"
  export SPRING_DATASOURCE_USERNAME="$DB_USER"
  export SPRING_DATASOURCE_PASSWORD="$DB_PASS"
fi

echo "=== SPRING_DATASOURCE_URL: ${SPRING_DATASOURCE_URL:-NOT SET} ==="

exec java -Xmx384m -jar -Dspring.profiles.active=prod app.jar
