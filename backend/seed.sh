#!/bin/bash
# seed.sh - Seeds the local D1 database with fixtures

# Ensure we are in the backend directory
cd "$(dirname "$0")"

echo "Clearing existing data..."
# Use a transaction or just delete in order to respect foreign keys
# Note: D1 might need individual deletes if not using a specific migration or tool
npx wrangler d1 execute hobby-tracker-db --local --command "DELETE FROM \"HobbySessionFile\";"
npx wrangler d1 execute hobby-tracker-db --local --command "DELETE FROM \"HobbySession\";"
npx wrangler d1 execute hobby-tracker-db --local --command "DELETE FROM \"Follow\";"
npx wrangler d1 execute hobby-tracker-db --local --command "DELETE FROM \"_HobbyToUser\";"
npx wrangler d1 execute hobby-tracker-db --local --command "DELETE FROM \"Hobby\";"
npx wrangler d1 execute hobby-tracker-db --local --command "DELETE FROM \"User\";"

echo "Applying fixtures..."
for file in fixtures/*.sql; do
  echo "Applying $file..."
  npx wrangler d1 execute hobby-tracker-db --local --file="$file"
done

echo "Seeding complete."
