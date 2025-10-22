# fyn

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Start** - SSR framework with TanStack Router
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Hono** - Lightweight, performant server framework
- **oRPC** - End-to-end type-safe APIs with OpenAPI integration
- **Node.js** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth
- **Biome** - Linting and formatting
- **Turborepo** - Optimized monorepo build system

## Getting Started

### Option 1: Local Development

First, install the dependencies:

```bash
pnpm install
```

### Option 2: Docker

For running the application in Docker containers, see [DOCKER.md](./DOCKER.md) for detailed instructions.

Quick start with Docker Compose:

```bash
# Copy environment files
cp .env.docker.example .env.docker
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env

# Edit the .env files with your configuration
# Then start all services
docker-compose up --build
```

## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/server/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:

```bash
pnpm db:push
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
The API is running at [http://localhost:3000](http://localhost:3000).

## Project Structure

```ts
fyn/
├── apps/
│   ├── web/            # Frontend application (React + TanStack Start)
│   │   └── Dockerfile  # Docker configuration for web app
│   └── server/         # Backend API (Hono, ORPC)
│       └── Dockerfile  # Docker configuration for server
├── packages/
│   ├── api/            # API layer / business logic
│   ├── auth/           # Authentication configuration & logic
│   └── db/             # Database schema & queries
├── docker-compose.yml  # Docker Compose orchestration
└── DOCKER.md           # Docker setup documentation
```

## Available Scripts

- `pnpm dev`: Start all applications in development mode
- `pnpm build`: Build all applications
- `pnpm dev:web`: Start only the web application
- `pnpm dev:server`: Start only the server
- `pnpm check-types`: Check TypeScript types across all apps
- `pnpm db:push`: Push schema changes to database
- `pnpm db:studio`: Open database studio UI
- `pnpm check`: Run Biome formatting and linting
