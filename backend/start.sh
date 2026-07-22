#!/bin/sh
# Living Letters Backend — Render startup script
# If SPRING_DATASOURCE_URL is already set via env vars on Render, just run
# If DATABASE_URL is set, parse it as fallback

if [ -z "$SPRING_DATASOURCE_URL" ] && [ -n "$DATABASE_URL" ]; then
  STRIPPED=$(echo "$DATABASE_URL" | sed 's|^postgresql://||' | sed 's|^postgres://||')
  DB_USER=$(echo "$STRIPPED" | sed 's/:.*//')
  DB_PASS=$(echo "$STRIPPED" | sed 's/[^:]*://;s/@.*//')
  HOST_DB=$(echo "$STRIPPED" | sed 's/.*@//')
  DB_HOST=$(echo "$HOST_DB" | cut -d'/' -f1 | cut -d'?' -f1)
  DB_NAME=$(echo "$HOST_DB" | cut -d'/' -f2 | cut -d'?' -f1)

  export SPRING_DATASOURCE_URL="jdbc:postgresql://${DB_HOST}:5432/${DB_NAME}?sslmode=require"
  export SPRING_DATASOURCE_USERNAME="$DB_USER"
  export SPRING_DATASOURCE_PASSWORD="$DB_PASS"
fi

echo "=== URL: ${SPRING_DATASOURCE_URL:-NOT SET} ==="
echo "=== USER: ${SPRING_DATASOURCE_USERNAME:-NOT SET} ==="

exec java -Xmx384m -jar -Dspring.profiles.active=prod app.jar
