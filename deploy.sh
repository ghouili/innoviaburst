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
# RUNNING PM2 (SERVE STATIC BUILD)
#############################################
# log "Reloading PM2"
# cd "$APP_DIR"

# # Ensure ecosystem file exists (see ecosystem.config.cjs below)
# if pm2 describe "$PM2_APP" >/dev/null 2>&1; then
#   log "Restarting existing PM2 process: $PM2_APP"
#   pm2 restart "$PM2_APP"
# else
#   log "Starting PM2 process fresh"
#   pm2 start ecosystem.config.cjs
# fi

# pm2 save
# log "Deployment completed successfully 🎉"

#############################################
# RUNNING PM2 (SERVE STATIC BUILD)
#############################################
log "Reloading PM2"

# If it's already running, restart it.
if pm2 describe "$PM2_APP" >/dev/null 2>&1; then
  log "Restarting existing PM2 process"
  pm2 restart "$PM2_APP"
else
  log "Starting PM2 static server"
  pm2 serve "$BUILD_DIR" "$APP_PORT" --spa --name "$PM2_APP"
fi

pm2 save