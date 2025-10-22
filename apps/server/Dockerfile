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

# Prune the monorepo to only include dependencies for the server
RUN turbo prune server --docker

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

# Build the server using Turbo
RUN pnpm turbo build --filter=server

# Runner stage
FROM base AS runner
WORKDIR /app

# Copy only necessary files for production
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package.json ./package.json

# Set environment to production
ENV NODE_ENV=production

# Expose the server port
EXPOSE 3000

# Start the server
CMD ["node", "dist/index.js"]
