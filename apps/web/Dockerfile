FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache git libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.2 --activate

# ----------- Dependencies pruning -----------
FROM base AS prune
COPY . .
RUN pnpm dlx turbo prune @fyn/web --docker

# ----------- Install dependencies -----------
FROM base AS installer
COPY --from=prune /app/out/json/ ./
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install

# ----------- Build application -----------
FROM base AS builder
ENV TURBO_TELEMETRY_DISABLED=1
COPY --from=prune /app/out/full/ ./
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/web/node_modules ./apps/web/node_modules
RUN pnpm --filter @fyn/web run build

# ----------- Runtime image -----------
FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 web-group && \
    adduser --system --uid 1001 web-user
USER web-user

COPY --from=prune --chown=web-user:web-group /app/out/json/ ./
COPY --from=installer --chown=web-user:web-group /app/node_modules ./node_modules
COPY --from=installer --chown=web-user:web-group /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=builder --chown=web-user:web-group /app/apps/web/.output ./apps/web/.output

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

CMD ["node", "/app/apps/web/.output/server/index.mjs"]
