#!/bin/sh
# Living Letters Backend — Render startup script

if [ -n "$DATABASE_URL" ]; then
  export SPRING_DATASOURCE_URL="jdbc:${DATABASE_URL}&sslmode=require"
  export SPRING_DATASOURCE_USERNAME=""
  export SPRING_DATASOURCE_PASSWORD=""
elif [ -n "$DB_HOST" ]; then
  export SPRING_DATASOURCE_URL="jdbc:postgresql://${DB_HOST}:${DB_PORT:-5432}/${DB_NAME:-livingletters}?sslmode=require"
  export SPRING_DATASOURCE_USERNAME="$DB_USER"
  export SPRING_DATASOURCE_PASSWORD="$DB_PASSWORD"
fi

echo "=== URL: ${SPRING_DATASOURCE_URL:-NOT SET} ==="

exec java -Xmx384m -jar -Dspring.profiles.active=prod app.jar
