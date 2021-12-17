# --------------------
# Global Configuration
# --------------------
ARG APP_NAME=bookmarks-backend
ARG APP_USER=node
ARG APP_HOME=/home/${APP_USER}/${APP_NAME}
ARG NODE_VERSION=lts-alpine

# ==============
# Stage: Install
# ==============
FROM node:${NODE_VERSION} as install

ARG APP_NAME
ARG APP_HOME
ARG APP_USER
ARG NODE_VERSION

# Install and configure system dependencies
RUN apk add --no-cache build-base; \
  mkdir -p ${APP_HOME}; \
  chown -R ${APP_USER}:${APP_USER} ${APP_HOME};

# Set the working directory
WORKDIR ${APP_HOME}

# Set the active user
USER ${APP_USER}

# Copy base NPM files
COPY --chown=${APP_USER}:${APP_USER} package.json package-lock.json ./

# Install dependencies
RUN npm cache clean --force && npm install

# ============
# Stage: Build
# ============
FROM node:${NODE_VERSION} as build

ARG APP_NAME
ARG APP_HOME
ARG APP_USER
ARG NODE_VERSION

# Install and configure system dependencies
RUN apk add --no-cache build-base; \
  mkdir -p ${APP_HOME}; \
  chown -R ${APP_USER}:${APP_USER} ${APP_HOME};

# Set the working directory
WORKDIR ${APP_HOME}

# Set the active user
USER ${APP_USER}

# Copy base NPM files
COPY --chown=${APP_USER}:${APP_USER} package.json package-lock.json ./

# Copy application dependencies from the "install" stage
COPY --chown=${APP_USER}:${APP_USER} --from=install ${APP_HOME}/node_modules ./node_modules

# Copy application source
COPY --chown=${APP_USER}:${APP_USER} . .

# Build the application
RUN npm run build

# ============
# Stage: Image
# ============
FROM node:${NODE_VERSION}

ARG APP_NAME
ARG APP_HOME
ARG APP_USER
ARG APP_PORT
ARG NODE_VERSION

ENV APP_PORT=${APP_PORT}

# Install and configure system dependencies
RUN apk add --no-cache build-base; \
  mkdir -p ${APP_HOME}; \
  chown -R ${APP_USER}:${APP_USER} ${APP_HOME};

# Set the working directory
WORKDIR ${APP_HOME}

# Set the active user
USER ${APP_USER}

# Copy base NPM files
COPY --chown=${APP_USER}:${APP_USER} package.json package-lock.json ./

# Copy application dependencies from the "install" stage
COPY --chown=${APP_USER}:${APP_USER} --from=install ${APP_HOME}/node_modules ./node_modules

# Copy application build from "build" stage
COPY --chown=${APP_USER}:${APP_USER} --from=build ${APP_HOME}/build ./build

# Copy application source
COPY --chown=${APP_USER}:${APP_USER} . .

# Expose application port
EXPOSE ${APP_PORT}

# Configure healthcheck
HEALTHCHECK --interval=5m --timeout=3s \
  CMD curl -f http://localhost:${PORT}/healthcheck || exit 1

# Run application
CMD [ "node", "build/index.js" ]
