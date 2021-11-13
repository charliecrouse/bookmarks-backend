# ===============
# Global
# ===============

# ------------------
# Global Environment
# ------------------
ENV APP_NAME=bookmarks-backend
ENV NODE_VERSION=gallium-alpine
ENV APP_DIR=/${APP_NAME}
ENV YARN_DIR=${APP_DIR}/.yarn

# ----------------
# Global Arguments
# ----------------
ARG APP_PORT=8000

# ================
# Stage: Install
# ================
FROM node:${NODE_VERSION} as install

# --------------------------------------------------------------
# [Install] Layer 0: OS config and system dependency installation
# --------------------------------------------------------------
RUN apk add --no-cache build-base python; \
  mkdir -p ${APP_DIR}

# ------------------------------------------------------------------
# [Install] Layer 1: Application node modules dependency installation
# ------------------------------------------------------------------
WORKDIR ${APP_DIR}

# Copy base npm files
COPY package.json yarn.lock .yarn/patches .yarn/plugins .yarn/releases .yarn/sdks .yarn/versions  ./

# Install dependencies
RUN yarn install

# ==========================
# Stage: Build
# ==========================
FROM node:${NODE_VERSION} as build

# --------------------------------------------------------------
# [Build] Layer 0: OS config and system dependency installation
# --------------------------------------------------------------
RUN apk add --no-cache build-base python; \
  mkdir -p ${APP_DIR}; \
  mkdir -p ${YARN_DIR}

# ------------------------------------------
# [Build] Layer 1: Application installation
# ------------------------------------------
WORKDIR ${APP_DIR}

# Copy base npm files
COPY package.json yarn.lock ./

# Move installation
COPY --from=install ${APP_DIR}/.pnp* .
COPY --from=install ${YARN_DIR} .

# Get application source
COPY . .

# -----------------------------------
# [Build], Layer 2: Application build
# -----------------------------------
RUN yarn build

# =========================
# Stage: Image
# =========================
FROM node:${NODE_VERSION} as production

# -----------------
# [Image] Arguments
# -----------------
ARG APP_NAME
ARG APP_PORT
ARG NODE_ENV=development

# -----------------------------
# [Image] Environment Variables
# -----------------------------
ENV APP_DIR=/${APP_NAME}
ENV NODE_ENV=production
ENV PORT=${APP_PORT}

# --------------------------------------------------------------
# [Image] Layer 0: OS config and system dependency installation
# --------------------------------------------------------------
RUN apk add --no-cache build-base python; \
  mkdir -p ${APP_DIR}

# ------------------------------------------
# [Image] Layer 1: Application installation
# ------------------------------------------
WORKDIR ${APP_DIR}

# Get installed node_modules from installation stage
COPY --from=install ${APP_DIR}/node_modules ./node_modules

# Get application source
COPY . .

# -----------------------------------
# [Image] Layer 2: Application build
# -----------------------------------
COPY --from=build ${APP_DIR}/build ./build

# -----------------------------------
# [Image] Layer 3: Application prune
# -----------------------------------
RUN yarn install --production

# ------------------------------
# [Image] Layer 4: Health check
# ------------------------------
HEALTHCHECK --interval=5m --timeout=3s \
  CMD curl -f http://localhost:${PORT}/healthcheck || exit 1

# ---------------------------------
# [Image] Layer 5: Run application
# ---------------------------------
EXPOSE ${PORT}
CMD [ "yarn", "start" ]
