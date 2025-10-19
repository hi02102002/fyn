FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache git libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.2 --activate

FROM base AS prune
COPY . .
RUN pnpm dlx turbo prune @fyn/server --docker

FROM base AS installer
COPY --from=prune /app/out/json/ ./
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install

FROM base AS installer-production
COPY --from=prune /app/out/json/ ./
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --prod --frozen-lockfile

FROM base AS builder
COPY --from=installer /app/node_modules ./node_modules
COPY --from=prune /app/out/full/ ./
RUN pnpm dlx turbo run build --filter=@fyn/server

# ---------- Runner ----------
FROM base AS runner
RUN addgroup --system --gid 1001 server-group && adduser --system --uid 1001 server-user
USER server-user

WORKDIR /app
COPY --from=installer-production --chown=server-user:server-group /app/node_modules ./node_modules
COPY --from=prune --chown=server-user:server-group /app/out/json/ ./
COPY --from=builder --chown=server-user:server-group /app/apps/server/dist ./apps/server/dist

WORKDIR /app/apps/server

EXPOSE 3000


CMD ["node", "dist/index.js"]
