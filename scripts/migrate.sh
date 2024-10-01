#!/bin/sh

until pg_isready -h db -p 5432 -U myuser; do
  echo "Waiting for the database to be available..."
  sleep 2
done

echo ""
echo "Database is up! 🐋"
echo ""
echo "Applying migrations..."
echo ""

npx prisma migrate deploy

npm run start:prod
