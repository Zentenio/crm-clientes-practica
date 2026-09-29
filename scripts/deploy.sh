#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/var/www/crm-clientes-practica"
BRANCH="main"
APP_NAME="crm-clientes-practica"

cd "$APP_DIR"

PREVIOUS_SHA=$(git rev-parse HEAD)

git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

npm ci
npm run build

pm2 restart "$APP_NAME"

sleep 5

curl --fail --silent http://localhost:3000 >/dev/null || {
  echo "Healthcheck failed, rolling back to $PREVIOUS_SHA"
  git reset --hard "$PREVIOUS_SHA"
  npm ci
  npm run build
  pm2 restart "$APP_NAME"
  exit 1
}

echo "Deploy OK: $(git rev-parse HEAD)"
