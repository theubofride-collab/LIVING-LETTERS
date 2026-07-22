#!/bin/sh
# Living Letters Backend — Render startup script

if [ -n "$DB_HOST" ]; then
  # Render internal DNS needs .internal suffix
  HOST="$DB_HOST"
  if echo "$HOST" | grep -qv '\.'; then
    HOST="${HOST}.internal"
  fi

  export SPRING_DATASOURCE_URL="jdbc:postgresql://${HOST}:${DB_PORT:-5432}/${DB_NAME:-livingletters}"
  export SPRING_DATASOURCE_USERNAME="$DB_USER"
  export SPRING_DATASOURCE_PASSWORD="$DB_PASSWORD"
fi

exec java -Xmx384m -jar -Dspring.profiles.active=prod app.jar
