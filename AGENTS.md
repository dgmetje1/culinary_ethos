# AGENTS.md

## Critical Quirks

- Tests use **Vitest** (not default Jest for NestJS). Config: `vitest.config.ts`.
- Package manager: **pnpm** (not npm/yarn).
- TypeScript 6.x (unusual for NestJS, which typically uses 5.x).
- `pnpm run test:e2e` is broken: references missing `./test/vitest-e2e.config.ts` (no `test/` directory exists).
- **Interfaces cannot be used as injection tokens** - NestJS DI relies on runtime tokens. Use concrete classes or `@Inject()` with string tokens for interfaces/repositories.
- When using components from `shadcn/ui` import them using `pnpm dlx shadcn@latest add {componentName}`

**Do not modify files inside `node_modules`**

## Commands

- Install: `pnpm install`
- Dev server: `pnpm run start:dev`
- Build: `pnpm run build` (output: `dist/`)
- Unit tests: `pnpm run test` (vitest run, matches `**/*.spec.ts`)
- Single test: `pnpm exec vitest run <path/to/file.spec.ts>`
- Lint: `pnpm run lint` | Format: `pnpm run format`

## Env & Config

- Requires `.env` with Postgres vars: `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`.
- TypeORM `synchronize: true` is dev-only (per `src/app.module.ts`); use migrations for production.

## Testing

- Vitest requires `src/test-setup.ts` (imports `reflect-metadata` for NestJS DI).
- Test typechecking enabled via `tsconfig.spec.json` (set in `vitest.config.ts`).

## Architecture

- Single app, all source under `src/`. Only feature module: `UsersModule`.
- Entrypoint: `src/main.ts`.
