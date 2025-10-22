# Base image with Node.js
FROM node:20-alpine AS base

# Enable corepack for pnpm
RUN corepack enable

# Dependencies stage
FROM base AS deps
WORKDIR /app

# Copy workspace configuration files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY turbo.json ./
COPY tsconfig.base.json tsconfig.json ./

# Copy package.json files from all workspaces
COPY apps/web/package.json apps/web/
COPY packages/api/package.json packages/api/
COPY packages/auth/package.json packages/auth/
COPY packages/db/package.json packages/db/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pnpm-lock.yaml ./

# Copy all workspace configuration
COPY pnpm-workspace.yaml package.json ./
COPY turbo.json ./
COPY tsconfig.base.json tsconfig.json ./

# Copy package source files
COPY packages ./packages
COPY apps/web ./apps/web

# Build the web app and all dependencies
RUN pnpm build --filter=web

# Runner stage - use Node.js to serve the SSR app
FROM base AS runner
WORKDIR /app

# Copy node_modules from deps (includes vite and all dependencies needed for preview)
COPY --from=deps /app/node_modules ./node_modules

# Copy package.json
COPY --from=builder /app/apps/web/package.json ./package.json

# Copy built app from builder
COPY --from=builder /app/apps/web/dist ./dist

# Set environment to production
ENV NODE_ENV=production

# Expose port 3001 (default web port)
EXPOSE 3001

# Start the web server with vite preview
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "3001"]
