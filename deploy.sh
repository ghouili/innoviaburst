#!/usr/bin/env bash
set -euo pipefail

#############################################
# CONFIG (all overridable from SSH env vars)
#############################################
APP_DIR="${APP_DIR:-/var/www/innoviaburst}"
BRANCH="${BRANCH:-production}"
REPO_URL="${REPO_URL:-}"
BUILD_DIR="${BUILD_DIR:-dist}"

ENV_FILE="$APP_DIR/.env"
ENV_PAYLOAD_PATH="${ENV_PAYLOAD_PATH:-/tmp/innoviaburst.env}"

PM2_APP="${PM2_APP:-innoviaburst}"
APP_PORT="${APP_PORT:-8000}"

# Lead-capture API (server/index.mjs). Holds the SMTP credentials and sends
# the notification mail; nginx proxies /api/ to it.
API_DIR="$APP_DIR/server"
API_PM2_APP="${API_PM2_APP:-innoviaburst-api}"
API_PORT="${API_PORT:-3000}"
# Delivered separately from the client .env: this one holds real secrets and
# is gitignored, so `git reset --hard` never supplies it.
API_ENV_FILE="$API_DIR/.env"
API_ENV_PAYLOAD_PATH="${API_ENV_PAYLOAD_PATH:-/tmp/innoviaburst.server.env}"

# If you have nvm installed, pass NVM_DIR from workflow vars.NVM_DIR or default to $HOME/.nvm
NVM_DIR="${NVM_DIR:-$HOME/.nvm}"

#############################################
# Logger
#############################################
log() { printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"; }

#############################################
# LOAD NODE (NVM)
#############################################
if [ -f "$NVM_DIR/nvm.sh" ]; then
  log "Loading NVM from $NVM_DIR"
  # shellcheck disable=SC1090
  source "$NVM_DIR/nvm.sh"
else
  log "NVM not found at $NVM_DIR, using system node"
fi

log "Node: $(node -v || echo 'Not found')"
log "NPM:  $(npm -v || echo 'Not found')"

#############################################
# FIRST DEPLOY OR UPDATE
#############################################
log "Using app directory: $APP_DIR"
mkdir -p "$APP_DIR"
cd "$APP_DIR"

if [[ ! -d "$APP_DIR/.git" || ! -f "$APP_DIR/package.json" ]]; then
  if [[ -z "$REPO_URL" ]]; then
    log "ERROR: REPO_URL is empty. Provide REPO_URL via workflow."
    exit 1
  fi

  TMP_CLONE="/tmp/innoviaburst_clone_$$"
  log "First deploy → cloning into: $TMP_CLONE"
  git clone --branch "$BRANCH" "$REPO_URL" "$TMP_CLONE"

  log "Copying project to $APP_DIR"
  rsync -a "$TMP_CLONE/" "$APP_DIR/"
  rm -rf "$TMP_CLONE"
else
  log "Updating existing repo"
  git fetch --all
  git reset --hard "origin/$BRANCH"
fi

cd "$APP_DIR"

#############################################
# ENV SYNC (optional)
#############################################
if [[ -f "$ENV_PAYLOAD_PATH" ]]; then
  log "Applying .env updates"
  mv "$ENV_PAYLOAD_PATH" "$ENV_FILE"
else
  log "No env file provided (skipped)"
fi

# The API secrets. Kept in a separate file so the SMTP password never lands
# in the tracked, publicly-inlined client .env.
if [[ -f "$API_ENV_PAYLOAD_PATH" ]]; then
  log "Applying server/.env updates"
  mkdir -p "$API_DIR"
  mv "$API_ENV_PAYLOAD_PATH" "$API_ENV_FILE"
  chmod 600 "$API_ENV_FILE"
else
  log "No server env file provided (skipped)"
fi

#############################################
# ENSURE .env EXISTS + SET OWNER
#############################################
OWNER="${OWNER:-}"

# Create .env if missing (even if no payload was uploaded)
touch "$ENV_FILE"

# If a payload replaced the file, ensure it still exists
if [[ ! -f "$ENV_FILE" ]]; then
  touch "$ENV_FILE"
fi

# If OWNER is provided, upsert it (remove old line then append)
if [[ -n "$OWNER" ]]; then
  log "Setting OWNER in .env"
  # Remove existing OWNER lines (safe on Linux)
  sed -i '/^OWNER=/d' "$ENV_FILE"
  printf "OWNER=%s\n" "$OWNER" >> "$ENV_FILE"
else
  log "OWNER not provided (skipped)"
fi


#############################################
# BUILD PROJECT
#############################################
log "Cleaning old artifacts"
rm -rf node_modules "$BUILD_DIR" package-lock.json

log "Installing dependencies"
npm install --legacy-peer-deps

log "Building app"
npm run build

#############################################
# LEAD API DEPENDENCIES
#############################################
# Separate package.json, so the root install above does not cover it.
if [[ -f "$API_DIR/package.json" ]]; then
  log "Installing lead-api dependencies"
  ( cd "$API_DIR" && npm install --omit=dev --no-audit --no-fund )
fi

#############################################
# RESOLVE WEB ROOT
#############################################
# Vike pre-renders the servable site into "$BUILD_DIR/client" and its SSR bundle
# into "$BUILD_DIR/server"; a plain Vite SPA build writes straight into
# "$BUILD_DIR". Detect which one we got so the same script keeps working either
# way. Do NOT test for a root index.html: "/" is a locale negotiation handled by
# nginx, so the pre-render starts at en/index.html and fr/index.html and there is
# no index.html at the web root.
if [[ -d "$APP_DIR/$BUILD_DIR/client" ]]; then
  SERVE_DIR="$BUILD_DIR/client"
else
  SERVE_DIR="$BUILD_DIR"
fi

if [[ -z "$(find "$APP_DIR/$SERVE_DIR" -name '*.html' -print -quit 2>/dev/null)" ]]; then
  log "ERROR: no HTML documents under $APP_DIR/$SERVE_DIR — build produced nothing servable."
  exit 1
fi
log "Web root: $APP_DIR/$SERVE_DIR"

#############################################
# RUNNING PM2 (SERVE STATIC BUILD)
#############################################
log "Reloading PM2"

# `pm2 restart` replays the args the process was first created with, so it would
# keep serving the old web root forever. Recreate it instead — nginx serves the
# static files directly, so this process is not on the critical path.
if pm2 describe "$PM2_APP" >/dev/null 2>&1; then
  log "Removing existing PM2 process so it picks up $SERVE_DIR"
  pm2 delete "$PM2_APP"
fi

log "Starting PM2 static server on $SERVE_DIR:$APP_PORT"
pm2 serve "$SERVE_DIR" "$APP_PORT" --name "$PM2_APP"

#############################################
# RUNNING PM2 (LEAD API)
#############################################
# Only started when the API is present AND configured. A process that boots
# without SMTP credentials exits immediately by design, and pm2 would then
# restart-loop it.
if [[ -f "$API_DIR/index.mjs" ]]; then
  if [[ -f "$API_ENV_FILE" ]]; then
    if pm2 describe "$API_PM2_APP" >/dev/null 2>&1; then
      log "Removing existing PM2 process $API_PM2_APP"
      pm2 delete "$API_PM2_APP"
    fi
    log "Starting lead API on 127.0.0.1:$API_PORT"
    ( cd "$API_DIR" && PORT="$API_PORT" pm2 start index.mjs --name "$API_PM2_APP" )
  else
    log "WARNING: $API_ENV_FILE missing — lead API NOT started, forms will 404"
  fi
fi

pm2 save
log "Deployment completed successfully 🎉"
