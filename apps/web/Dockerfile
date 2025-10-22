# Base image with Node.js
FROM node:20-alpine AS base

# Enable corepack for pnpm
RUN corepack enable

# Pruner stage - uses Turborepo to prune the monorepo
FROM base AS pruner
WORKDIR /app

# Install turbo globally
RUN pnpm install -g turbo

# Copy the entire monorepo
COPY . .

# Prune the monorepo to only include dependencies for the web app
RUN turbo prune web --docker

# Dependencies stage
FROM base AS deps
WORKDIR /app

# Copy pruned lockfile and package.json files
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies for the pruned workspace
RUN pnpm install --frozen-lockfile

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/ .

# Copy source code from pruned workspace
COPY --from=pruner /app/out/full/ .

# Build the web app using Turbo
RUN pnpm turbo build --filter=web

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
