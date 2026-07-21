# AGENTS.md

## Code discovery

Prefer `codebase-memory-mcp` MCP tools over grep/glob/file-search for code discovery — it has a full AST-based index of the codebase.
ALWAYS use `search_graph`, `trace_path`, or `get_code_snippet` before reaching for native file tools.

## Monorepo

pnpm workspace with 2 packages under `packages/`: `@culinary-ethos/be` (NestJS) and `@culinary-ethos/fe` (React). Root scripts delegate via `--filter`.

**Do not modify files inside `node_modules`**

## Commands

| Action       | Command                                                                      |
| ------------ | ---------------------------------------------------------------------------- |
| Install      | `pnpm install`                                                               |
| Dev (both)   | `pnpm run dev:all`                                                           |
| Dev BE only  | `pnpm run dev:be` (port 3000, HTTPS)                                         |
| Dev FE only  | `pnpm run dev:fe` (port 5173)                                                |
| Build BE     | `pnpm run build:be`                                                          |
| Build FE     | `pnpm run build:fe` (`tsc && vite build`)                                    |
| Run BE tests | `pnpm run test` or `pnpm run test:be` (vitest, matches `**/*.spec.ts`)       |
| Single test  | `pnpm exec vitest run <path>` (run from `packages/BE`)                       |
| Run FE tests | `pnpm run test:fe` (no tests exist yet)                                      |
| Typecheck BE | `pnpm run typecheck` (from `packages/BE`)                                    |
| Typecheck FE | `pnpm run typecheck` (from `packages/FE`)                                    |
| Lint         | `pnpm run lint` (both; BE lint is **broken** — ESLint v10 needs flat config) |
| Format       | `pnpm run format` (BE only, prettier)                                        |

## Setup

- Requires PostgreSQL running — use `docker compose -f devops/docker-compose.yml up -d`
- Copy `.env` from `.env.example` for both packages (no `.env.example` files exist yet; check the README or AGENTS.md for required vars)
- Required BE vars: `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `AUTH0_*`
- Required FE vars: `VITE_AUTH0_*`, `VITE_API_URL`
- BE dev server requires local HTTPS certs at `packages/BE/.cert/key.pem` and `packages/BE/.cert/cert.pem`

## BE architecture

- **Framework**: NestJS 11 with DDD: each bounded context has `domain/`, `application/`, `infrastructure/`, `interfaces/`
- **Active modules** (imported in `AppModule`): `AuthModule`, `CommonModule`, `ContentModule`, `SocialModule`, `FilesModule`, `BackofficeModule`
- **Dead module**: `UsersModule` at `src/users/` is defined but NOT imported in `AppModule`. Its entity `users/user.entity.ts` is **not** the active User model
- **Active User model**: `social/domain/models/user.entity.ts` (table `users`, varchar PK, no `age` field)
- TypeORM `synchronize: true` dev-only; use migrations for production
- Swagger docs at `/api`
- Seeds: `src/seeds.ts` — standalone script (not NestJS command), creates its own `DataSource`. Run with `npx ts-node src/seeds.ts` from `packages/BE`

## FE architecture

- **Framework**: React 19, Vite 8, TanStack Router (file-based routing in `src/config/routing/`)
- **Data fetching**: TanStack React Query via `src/middleware/api/react-query.tsx` (custom `useApiQuery`/`useApiMutation` wrappers)
- **UI stack**: MUI 6 + Tailwind CSS 3 + shadcn/ui (Radix primitives) + lucide-react icons
- **Forms**: TanStack React Form + Zod
- **i18n**: i18next, translations in `src/i18n/`
- **Auth**: Auth0 React SDK
- **Path alias**: `@/` → `src/`
- **shadcn/ui components**: install via `pnpm dlx shadcn@latest add {componentName}`

## Testing quirks

- BE tests use **Vitest** (not Jest). Config: `packages/BE/vitest.config.ts`
- Test setup: `src/test-setup.ts` (imports `reflect-metadata` for NestJS DI)
- `pnpm run test:e2e` is **broken** — references missing `./test/vitest-e2e.config.ts` (no `test/` directory)
- FE has **zero tests** (no `*.spec.*` or `*.test.*` files exist)

## NestJS DI rules

- **Interfaces cannot be injection tokens** — NestJS DI relies on runtime tokens. Use concrete classes or `@Inject('TOKEN')` with string tokens
- This matters for repositories and DDD ports/adapters

## Style

- Prettier: single quotes, trailing commas
- ESLint: `@typescript-eslint` recommended + prettier (config: root `.eslintrc.js`)
- TypeScript: strict mode, `strictPropertyInitialization: false`, `strictNullChecks: true`
