#!/bin/sh

echo "--- Entrypoint Script ---"

# Check if DB_TYPE is postgres, then run migrations
if [ "$DB_TYPE" = "postgres" ]; then
  echo "Waiting for Database to be ready..."
  
  echo "Running Database Migrations (Postgres)..."
  npm run migration:prod
else
  echo "Using SQLite (or other)."
  echo "Running Database Migrations (SQLite)..."
  npm run migration:prod
fi

echo "Starting Application..."

if [ -f "dist/main.js" ]; then
  exec node dist/main
else
  echo "ERROR: dist/main.js not found. Build likely failed or dist folder was deleted."
  exit 1
fi