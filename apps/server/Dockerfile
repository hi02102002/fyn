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
COPY apps/server/package.json apps/server/
COPY packages/api/package.json packages/api/
COPY packages/auth/package.json packages/auth/
COPY packages/db/package.json packages/db/
COPY packages/mail/package.json packages/mail/

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
COPY apps/server ./apps/server

# Build the server and all dependencies
RUN pnpm build --filter=server

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
