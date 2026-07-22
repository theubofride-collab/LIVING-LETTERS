#!/bin/sh
# Living Letters Backend — Render startup script
# Converts Render's DATABASE_URL (postgresql://...) to JDBC format (jdbc:postgresql://...)
# Also sets the production profile

if [ -n "$DATABASE_URL" ]; then
  export SPRING_DATASOURCE_URL="jdbc:${DATABASE_URL}"
fi

exec java -jar -Dspring.profiles.active=prod app.jar
