# Base image with Node.js
FROM node:20-alpine AS base

# Enable corepack for pnpm
RUN corepack enable

# Pruner stage - uses Turborepo to prune the monorepo
FROM base AS pruner
WORKDIR /app

# Set up pnpm global bin directory
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install turbo globally
RUN pnpm add -g turbo

# Copy the entire monorepo
COPY . .

# Prune the monorepo to only include dependencies for the web app
RUN turbo prune web --docker

# Dependencies stage - install all dependencies for building
FROM base AS deps
WORKDIR /app

# Copy pruned lockfile and package.json files
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install all dependencies (including dev dependencies for build)
RUN pnpm install --frozen-lockfile

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/ .

# Copy source code from pruned workspace
COPY --from=pruner /app/out/full/ .

# Copy root-level TypeScript config files (not included in turbo prune)
COPY tsconfig.base.json tsconfig.json ./

# Build the web app using Turbo
RUN pnpm turbo build --filter=web

# Production dependencies stage - install only production dependencies
FROM base AS prod-deps
WORKDIR /app

# Copy pruned lockfile and package.json files
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install only production dependencies (vite is needed for SSR preview)
RUN pnpm install --frozen-lockfile --prod

# Runner stage - use Node.js to serve the SSR app
FROM base AS runner
WORKDIR /app

# Copy production node_modules
COPY --from=prod-deps /app/node_modules ./node_modules

# Copy only the built output and package.json
COPY --from=builder /app/apps/web/dist ./apps/web/dist
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json

# Set working directory to the web app
WORKDIR /app/apps/web

# Set environment to production
ENV NODE_ENV=production

# Expose port 3001 (default web port)
EXPOSE 3001

# Start the web server with vite preview using the local vite
CMD ["../../node_modules/.bin/vite", "preview", "--host", "0.0.0.0", "--port", "3001"]
