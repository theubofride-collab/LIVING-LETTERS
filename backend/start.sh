#!/bin/sh
# Living Letters Backend — Render startup script

if [ -n "$DATABASE_HOST" ]; then
  DB_HOST="${DATABASE_HOST}"
  DB_PORT="${DATABASE_PORT:-5432}"
  DB_NAME="${DATABASE_NAME:-livingletters}"
  DB_USER="${DATABASE_USERNAME}"
  DB_PASS="${DATABASE_PASSWORD}"

  # Render internal DNS requires .internal suffix
  if echo "$DB_HOST" | grep -qv '\.'; then
    DB_HOST="${DB_HOST}.internal"
  fi

  export SPRING_DATASOURCE_URL="jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}"
  export SPRING_DATASOURCE_USERNAME="$DB_USER"
  export SPRING_DATASOURCE_PASSWORD="$DB_PASS"

  echo "=== DATABASE CONFIG ==="
  echo "HOST: $DB_HOST"
  echo "PORT: $DB_PORT"
  echo "NAME: $DB_NAME"
  echo "URL: $SPRING_DATASOURCE_URL"
  echo "USER: $SPRING_DATASOURCE_USERNAME"
  echo "========================"
fi

exec java -Xmx384m -jar -Dspring.profiles.active=prod app.jar
