# =============================================================================
# Kintsugi Web — React/Vite build, served by nginx
# =============================================================================

# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Build-time API URLs (override with --build-arg or docker-compose args:)
ARG VITE_API_BASE_URL=http://localhost:8000/api/v1
ARG VITE_WS_BASE_URL=ws://localhost:8000/api/v1/ws
ARG VITE_APP_TITLE="Kintsugi — Mindfulness & Emotional Sanctuary"
ARG VITE_APP_VERSION=1.0.0
ARG VITE_ENABLE_ANALYTICS=false
ARG VITE_ENABLE_AI_COMPANION=true
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_WS_BASE_URL=$VITE_WS_BASE_URL \
    VITE_APP_TITLE=$VITE_APP_TITLE \
    VITE_APP_VERSION=$VITE_APP_VERSION \
    VITE_ENABLE_ANALYTICS=$VITE_ENABLE_ANALYTICS \
    VITE_ENABLE_AI_COMPANION=$VITE_ENABLE_AI_COMPANION

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:80 >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
