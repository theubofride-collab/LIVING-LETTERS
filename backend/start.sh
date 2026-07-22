#!/bin/sh
# Living Letters Backend — Render startup script
# Converts Render's DATABASE_URL to JDBC format with separate credentials

if [ -n "$DATABASE_URL" ]; then
  # Render format: postgresql://user:password@host[:port]/dbname
  URL_BODY="${DATABASE_URL#postgresql://}"

  # Extract user:password
  USER_PASS="${URL_BODY%%@*}"
  HOST_DB="${URL_BODY#*@}"

  DB_USER="${USER_PASS%%:*}"
  DB_PASS="${USER_PASS#*:}"

  # Extract host[:port] and dbname
  SLASH_PART="${HOST_DB#*/}"
  DB_NAME="${SLASH_PART%%\?*}"

  HOST_PORT="${HOST_DB%%/*}"
  if echo "$HOST_PORT" | grep -q ":"; then
    DB_HOST="${HOST_PORT%%:*}"
    DB_PORT="${HOST_PORT#*:}"
  else
    DB_HOST="$HOST_PORT"
    DB_PORT="5432"
  fi

  export SPRING_DATASOURCE_URL="jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}"
  export SPRING_DATASOURCE_USERNAME="$DB_USER"
  export SPRING_DATASOURCE_PASSWORD="$DB_PASS"
fi

exec java -jar -Dspring.profiles.active=prod app.jar
