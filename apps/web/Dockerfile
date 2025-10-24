FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache git libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.2 --activate

FROM base AS prune
COPY . .
RUN pnpm dlx turbo prune @fyn/web --docker

FROM base AS installer
COPY --from=prune /app/out/json/ ./
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install

FROM base AS installer-production
COPY --from=prune /app/out/json/ ./
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --prod 

FROM base AS builder
COPY --from=prune /app/out/full/ ./
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=installer /app/packages/ ./packages/
RUN pnpm dlx turbo run build --filter=@fyn/web

# ---------- Runner ----------
FROM base AS runner
RUN addgroup --system --gid 1001 web-group && adduser --system --uid 1001 web-user
USER web-user

WORKDIR /app
COPY --from=prune --chown=web-user:web-group /app/out/json/ ./
COPY --from=installer-production --chown=web-user:web-group /app/node_modules ./node_modules
COPY --from=installer-production --chown=web-user:web-group /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=builder --chown=web-user:web-group /app/apps/web/.output ./apps/web/.output

WORKDIR /app/apps/web

EXPOSE 3001

CMD ["node", ".output/server/index.mjs"]
