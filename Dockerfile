# ===============
# Global Aruments
# ===============
ARG APP_NAME=bookmarks-backend
ARG APP_PORT=3000
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
RUN apk add --no-cache build-base python; \
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
# Stage 1: Development Image 
# ==========================
FROM node:${NODE_VERSION} as development

# -----------------
# Stage 1 Arguments
# -----------------
ARG APP_NAME
ARG APP_PORT
ARG DOCKER=true
ARG NODE_ENV=development

# -----------------------------
# Stage 1 Environment Variables
# -----------------------------
ENV APP_DIR=/${APP_NAME}
ENV DOCKER=true
ENV NODE_ENV=${NODE_ENV}
ENV PORT=${APP_PORT}

# --------------------------------------------------------------
# Stage 1, Layer 0: OS config and system dependency installation
# --------------------------------------------------------------
RUN apk add --no-cache build-base python; \
  mkdir -p ${APP_DIR}

# ------------------------------------------
# Stage 1, Layer 1: Application installation
# ------------------------------------------
WORKDIR ${APP_DIR}

# Get installed node_modules from installation stage
COPY --from=install ${APP_DIR}/node_modules ./node_modules

# Get application source
COPY . .

# ------------------------------
# Stage 1, Layer 2: Health check
# ------------------------------
HEALTHCHECK --interval=5m --timeout=3s \
  CMD curl -f http://localhost:${PORT}/healthcheck || exit 1

# ---------------------------------
# Stage 1, Layer 3: Run application
# ---------------------------------
CMD [ "npm", "run", "dev" ]

# ==========================
# Stage 2: Build Application
# ==========================
FROM node:${NODE_VERSION} as build

# -----------------
# Stage 2 Arguments
# -----------------
ARG APP_NAME

# -----------------------------
# Stage 2 Environment Variables
# -----------------------------
ENV APP_DIR=/${APP_NAME}

# --------------------------------------------------------------
# Stage 2, Layer 0: OS config and system dependency installation
# --------------------------------------------------------------
RUN apk add --no-cache build-base python; \
  mkdir -p ${APP_DIR}

# ------------------------------------------
# Stage 2, Layer 1: Application installation
# ------------------------------------------
WORKDIR ${APP_DIR}

# Get installed node_modules from installation stage
COPY --from=install ${APP_DIR}/node_modules ./node_modules

# Get application source
COPY . .

# -----------------------------------
# Stage 2, Layer 2: Application build
# -----------------------------------
RUN npm run build

# ==========================
# Stage 3: Production Image 
# ==========================
FROM node:${NODE_VERSION} as production

# -----------------
# Stage 3 Arguments
# -----------------
ARG APP_NAME
ARG APP_PORT
ARG DOCKER=true
ARG NODE_ENV=development

# -----------------------------
# Stage 3 Environment Variables
# -----------------------------
ENV APP_DIR=/${APP_NAME}
ENV DOCKER=true
ENV NODE_ENV=production
ENV PORT=${APP_PORT}

# --------------------------------------------------------------
# Stage 3, Layer 0: OS config and system dependency installation
# --------------------------------------------------------------
RUN apk add --no-cache build-base python; \
  mkdir -p ${APP_DIR}

# ------------------------------------------
# Stage 3, Layer 1: Application installation
# ------------------------------------------
WORKDIR ${APP_DIR}

# Get installed node_modules from installation stage
COPY --from=install ${APP_DIR}/node_modules ./node_modules

# Get application source
COPY . .

# -----------------------------------
# Stage 3, Layer 2: Application build
# -----------------------------------
COPY --from=build ${APP_DIR}/build ./build

# -----------------------------------
# Stage 3, Layer 3: Application prune
# -----------------------------------
RUN npm prune --production

# ------------------------------
# Stage 3, Layer 4: Health check
# ------------------------------
HEALTHCHECK --interval=5m --timeout=3s \
  CMD curl -f http://localhost:${PORT}/healthcheck || exit 1

# ---------------------------------
# Stage 3, Layer 5: Run application
# ---------------------------------
EXPOSE ${PORT}
CMD [ "npm", "run", "start" ]
