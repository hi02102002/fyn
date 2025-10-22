# Docker Setup Guide

This guide explains how to run the Fyn application using Docker.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine

## Quick Start

1. **Clone the repository** (if you haven't already)

```bash
git clone https://github.com/hi02102002/fyn.git
cd fyn
```

2. **Set up environment variables**

```bash
# Copy the example environment files
cp .env.docker.example .env.docker
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
```

3. **Edit the environment files** with your configuration

Update `apps/server/.env` with your database URL and other settings:
```
DATABASE_URL=postgresql://fyn:fyn_password@db:5432/fyn
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3001
```

Update `apps/web/.env` with your server URL:
```
VITE_SERVER_URL=http://localhost:3000
```

4. **Build and run with Docker Compose**

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

5. **Access the application**

- Web App: http://localhost:3001
- API Server: http://localhost:3000
- Database: localhost:5432

## Individual Docker Images

### Build Server Image

```bash
docker build -f apps/server/Dockerfile -t fyn-server .
```

### Build Web Image

```bash
docker build -f apps/web/Dockerfile -t fyn-web .
```

### Run Server Container

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/db" \
  -e BETTER_AUTH_SECRET="your-secret" \
  -e BETTER_AUTH_URL="http://localhost:3000" \
  -e CORS_ORIGIN="http://localhost:3001" \
  fyn-server
```

### Run Web Container

```bash
docker run -p 3001:3001 \
  -e VITE_SERVER_URL="http://localhost:3000" \
  fyn-web
```

## Docker Compose Commands

```bash
# Start services
docker-compose up

# Start services in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild images
docker-compose build

# Remove volumes (WARNING: This will delete database data)
docker-compose down -v
```

## Database Migration

After starting the services for the first time, you may need to run database migrations:

```bash
# Run migrations through docker-compose
docker-compose exec server pnpm db:push
```

## Troubleshooting

### Port Conflicts

If you encounter port conflicts, you can modify the port mappings in `docker-compose.yml`:

```yaml
services:
  server:
    ports:
      - "3000:3000"  # Change the first port to any available port
```

### Database Connection Issues

Ensure the `DATABASE_URL` in `apps/server/.env` uses `db` as the hostname:
```
DATABASE_URL=postgresql://fyn:fyn_password@db:5432/fyn
```

### Build Failures

If the build fails, try cleaning up Docker cache:

```bash
docker-compose down
docker system prune -a
docker-compose build --no-cache
```

## Production Deployment

For production deployment, consider:

1. Using environment-specific `.env` files
2. Setting proper security secrets
3. Using a managed database service instead of the containerized PostgreSQL
4. Setting up proper SSL/TLS certificates
5. Using a reverse proxy (nginx, traefik) in front of the services
6. Implementing health checks and monitoring

## Architecture

The Docker setup includes:

- **Server**: Node.js application running the Hono API server
- **Web**: Node.js application serving the TanStack Start SSR web app
- **Database**: PostgreSQL 16 database

All services communicate through a Docker bridge network.
