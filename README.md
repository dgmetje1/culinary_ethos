# Culinary Ethos

A recipe management platform with a NestJS backend and React frontend.

## Project Structure

```
culinary-ethos/
├── packages/
│   ├── BE/          # NestJS backend (TypeScript 6, TypeORM, PostgreSQL)
│   └── FE/          # React frontend (Vite, TanStack Router, MUI + Tailwind)
├── devops/
│   └── docker-compose.yml  # PostgreSQL 15
├── pnpm-workspace.yaml
└── package.json
```

## Tech Stack

### Backend (`packages/BE`)

- **Framework:** NestJS 11 with DDD architecture
- **Language:** TypeScript 6
- **ORM:** TypeORM with PostgreSQL
- **Auth:** Auth0 (JWT via Passport)
- **Storage:** Azure Blob Storage
- **Validation:** class-validator + class-transformer
- **Testing:** Vitest
- **Docs:** Swagger/OpenAPI

### Frontend (`packages/FE`)

- **Framework:** React 19
- **Bundler:** Vite 8
- **Routing:** TanStack Router
- **Data Fetching:** TanStack React Query
- **UI:** MUI 6 + Tailwind CSS + shadcn/ui
- **Forms:** React Hook Form + Zod
- **Auth:** Auth0 React SDK
- **i18n:** i18next

## Prerequisites

- [pnpm](https://pnpm.io/) (package manager)
- Node.js >= 20
- Docker (for local PostgreSQL)

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

```bash
cp packages/BE/.env.example packages/BE/.env
cp packages/FE/.env.example packages/FE/.env
```

Required variables for **backend**: `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `AUTH0_*` values.
Required variables for **frontend**: `VITE_AUTH0_*` values, `VITE_API_URL`.

### 3. Start PostgreSQL

```bash
docker compose -f devops/docker-compose.yml up -d
```

### 4. Start development servers

```bash
# Both backend and frontend in parallel
pnpm run dev:all

# Backend only (http://localhost:3000)
pnpm run dev:be

# Frontend only (http://localhost:5173)
pnpm run dev:fe
```

## Available Commands

| Command             | Description                       |
| ------------------- | --------------------------------- |
| `pnpm run dev:all`  | Start BE + FE in parallel         |
| `pnpm run dev:be`   | Start NestJS backend (watch mode) |
| `pnpm run dev:fe`   | Start Vite frontend               |
| `pnpm run build:be` | Build backend                     |
| `pnpm run build:fe` | Build frontend                    |
| `pnpm run test`     | Run backend unit tests            |
| `pnpm run test:be`  | Run backend unit tests            |
| `pnpm run test:fe`  | Run frontend tests                |
| `pnpm run lint`     | Lint both packages                |
| `pnpm run lint:be`  | Lint backend                      |
| `pnpm run lint:fe`  | Lint frontend                     |

## Backend Architecture

Follows Domain-Driven Design with bounded contexts:

```
packages/BE/src/
├── content/          # Recipes, ingredients, categories, kitchenware, units, meal plans
│   ├── domain/       # Entities, value objects
│   ├── application/  # Use cases / services
│   ├── infrastructure/ # TypeORM repositories
│   └── interfaces/   # REST controllers
├── social/           # User profiles and social features
├── users/            # User management module
├── files/            # File upload (Azure Blob Storage)
└── common/           # Shared interceptors, filters, decorators
```

## License

[MIT](LICENSE)
