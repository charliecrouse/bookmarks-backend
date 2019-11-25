# ===============
# Global Aruments
# ===============
# Name of the application
ARG APP_NAME=backend

# Environment to run the application (development|production|test)
ARG NODE_ENV

# Version of node to build the container
ARG NODE_VERSION=12.13-alpine

# ================
# STAGE 0: Install
# ================
FROM node:${NODE_VERSION} as install

# -----------------
# Stage 0 Arguments
# -----------------
ARG APP_NAME

# -----------------------------
# Stage 0 Environment Variables
# -----------------------------
ENV APP_DIR=/${APP_NAME}

# --------------------------------------------------------------
# Stage 0, Layer 0: OS config and system dependency installation
# --------------------------------------------------------------
RUN apk add --no-cache python build-base; \
  mkdir -p ${APP_DIR}

# ------------------------------------------------------------------
# Stage 0, Layer 1: Application node modules dependency installation
# ------------------------------------------------------------------
WORKDIR ${APP_DIR}

# Copy base npm files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# ==========================
# Stage 1: Build Application
# ==========================
FROM node:${NODE_VERSION} as build

# -----------------
# Stage 1 Arguments
# -----------------
ARG APP_NAME

# -----------------------------
# Stage 1 Environment Variables
# -----------------------------
ENV APP_DIR=/${APP_NAME}

# --------------------------------------------------------------
# Stage 1, Layer 0: OS config and system dependency installation
# --------------------------------------------------------------
RUN apk add --no-cache python build-base; \
  mkdir -p ${APP_DIR}

# ------------------------------------------
# Stage 1, Layer 1: Application installation
# ------------------------------------------
WORKDIR ${APP_DIR}

# Get installed node_modules from installation stage
COPY --from=install ${APP_DIR}/node_modules ./node_modules

# ------------------------------------------
# Stage 1, Layer 2: Application installation
# ------------------------------------------
COPY . .

# -----------------------------------
# Stage 1, Layer 3: Application build
# -----------------------------------
RUN npm run build

# ========================
# Stage 2: Run Application
# ========================
FROM node:${NODE_VERSION}

# -----------------
# Stage 2 Arguments
# -----------------
ARG APP_NAME
ARG NODE_ENV
ARG PORT

# -----------------------------
# Stage 2 Environment Variables
# -----------------------------
ENV APP_DIR=/${APP_NAME}
ENV DOCKER=true
ENV NODE_ENV=${NODE_ENV}
ENV PORT=3000

# --------------------------------------------------------------
# Stage 2, Layer 0: OS config and system dependency installation
# --------------------------------------------------------------
RUN apk add --no-cache python build-base; \
  mkdir -p ${APP_DIR}

# ------------------------------------------
# Stage 2, Layer 1: Application installation
# ------------------------------------------
WORKDIR ${APP_DIR}

# Get installed node_modules from installation stage
COPY --from=install ${APP_DIR}/node_modules ./node_modules

# -----------------------------------
# Stage 2, Layer 2: Application build
# -----------------------------------
COPY --from=build ${APP_DIR}/build ./build
COPY . .

# -----------------------------------
# Stage 2, Layer 3: Application prune
# -----------------------------------
# RUN npm prune --production

# ------------------------------
# Stage 2, Layer 4: Health check
# ------------------------------
HEALTHCHECK --interval=5m --timeout=3s \
  CMD curl -f http://localhost:${PORT}/healthcheck || exit 1

# ---------------------------------
# Stage 2, Layer 5: Run application
# ---------------------------------
EXPOSE ${PORT}
CMD [ "npm", "run", "start" ]
