#!/bin/sh
# Living Letters Backend — Render startup script

if [ -n "$DB_HOST" ]; then
  export SPRING_DATASOURCE_URL="jdbc:postgresql://${DB_HOST}:${DB_PORT:-5432}/${DB_NAME:-livingletters}"
  export SPRING_DATASOURCE_USERNAME="$DB_USER"
  export SPRING_DATASOURCE_PASSWORD="$DB_PASSWORD"
fi

exec java -Xmx384m -jar -Dspring.profiles.active=prod app.jar
