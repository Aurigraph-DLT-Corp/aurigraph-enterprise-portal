#!/bin/bash

set -euo pipefail

# Portal Deployment Script
# Deploys the Aurigraph Enterprise Portal to staging or production

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DEPLOY_ENV="${1:-staging}"
SKIP_HEALTH_CHECK="${2:-false}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() { echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*" >&2; }
warn() { echo -e "${YELLOW}[WARN]${NC} $*"; }

# Configuration
if [ "$DEPLOY_ENV" = "production" ]; then
    PORTAL_HOST="${PORTAL_PROD_HOST:-dlt.aurigraph.io}"
    BACKEND_URL="https://dlt.aurigraph.io/api/v11"
    NODE_ENV="production"
    SKIP_BUILD=${SKIP_BUILD:-false}
else
    PORTAL_HOST="${PORTAL_STAGING_HOST:-staging.dlt.aurigraph.io}"
    BACKEND_URL="http://localhost:9003/api/v11"
    NODE_ENV="development"
    SKIP_BUILD=${SKIP_BUILD:-true}
fi

log "Deploying Aurigraph Enterprise Portal to $DEPLOY_ENV"
log "Portal Host: $PORTAL_HOST"
log "Backend URL: $BACKEND_URL"
log "Node Environment: $NODE_ENV"

# Step 1: Pre-deployment validation
log "Step 1: Pre-deployment validation..."
if [ ! -f "$PROJECT_ROOT/package.json" ]; then
    error "package.json not found in project root"
    exit 1
fi

# Step 2: Install dependencies
log "Step 2: Installing dependencies..."
cd "$PROJECT_ROOT/frontend"
npm install --production

# Step 3: Build for production (if not skipped)
if [ "$SKIP_BUILD" = "false" ]; then
    log "Step 3: Building for production..."
    REACT_APP_API_BASE_URL="$BACKEND_URL" \
    REACT_APP_NODE_ENV="$NODE_ENV" \
    npm run build
else
    log "Step 3: Skipping build (SKIP_BUILD=$SKIP_BUILD)"
fi

# Step 4: Create deployment artifact
log "Step 4: Creating deployment artifact..."
DEPLOY_DATE=$(date +%Y%m%d_%H%M%S)
ARTIFACT_DIR="$PROJECT_ROOT/.deploys/portal-$DEPLOY_DATE"
mkdir -p "$ARTIFACT_DIR"
cp -r "$PROJECT_ROOT/frontend/dist" "$ARTIFACT_DIR/dist"
cp "$PROJECT_ROOT/infrastructure/docker/docker-compose.portal.yml" "$ARTIFACT_DIR/"
cp "$PROJECT_ROOT/infrastructure/nginx/portal.conf" "$ARTIFACT_DIR/"

log "Artifact created: $ARTIFACT_DIR"

# Step 5: Health check (if not skipped)
if [ "$SKIP_HEALTH_CHECK" = "false" ]; then
    log "Step 5: Waiting for backend to be healthy..."
    MAX_RETRIES=30
    RETRY_INTERVAL=5
    RETRIES=0
    
    while [ $RETRIES -lt $MAX_RETRIES ]; do
        if curl -sf "${BACKEND_URL%/api/v11}/q/health" > /dev/null 2>&1; then
            log "Backend is healthy"
            break
        fi
        RETRIES=$((RETRIES + 1))
        if [ $RETRIES -lt $MAX_RETRIES ]; then
            warn "Backend not ready, retrying in ${RETRY_INTERVAL}s... ($RETRIES/$MAX_RETRIES)"
            sleep $RETRY_INTERVAL
        fi
    done
    
    if [ $RETRIES -eq $MAX_RETRIES ]; then
        error "Backend failed to become healthy after ${MAX_RETRIES} attempts"
        exit 1
    fi
fi

# Step 6: Verify deployment
log "Step 6: Verifying deployment..."
if [ -d "$ARTIFACT_DIR/dist" ]; then
    FILE_COUNT=$(find "$ARTIFACT_DIR/dist" -type f | wc -l)
    log "✅ Deployment artifact verified: $FILE_COUNT files"
else
    error "Deployment artifact directory not found"
    exit 1
fi

log "✅ Portal deployment completed successfully"
log "Deploy Environment: $DEPLOY_ENV"
log "Artifact Location: $ARTIFACT_DIR"
log "Backend API: $BACKEND_URL"
log ""
log "Next steps:"
log "  1. Upload artifacts to deployment server"
log "  2. Run: docker-compose -f docker-compose.portal.yml up -d"
log "  3. Verify: curl http://$PORTAL_HOST/health"
