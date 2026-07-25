---
name: nestjs-be
description: Use when working on a NestJS backend. This orchestrator covers the full BE ecosystem. Use sub-skills for deeper dives: best-practices (NestJS patterns, DI, modules, DDD), testing (Vitest, e2e, unit), data-layer (TypeORM, PostgreSQL, migrations), api-design (Swagger, DTOs, validation, error handling).
---

# BE Orchestrator

## Stack

- **Framework**: NestJS with DDD — `domain/`, `application/`, `infrastructure/`, `interfaces/` per bounded context
- **ORM**: TypeORM with PostgreSQL
- **Auth**: Passport strategies (`passport-jwt`, `passport-auth0`) + `jwks-rsa`
- **Validation**: `class-validator` + `class-transformer`
- **Docs**: Swagger via `@nestjs/swagger`
- **Storage**: Azure Blob Storage (`@azure/storage-blob`)
- **Cache/Events**: ioredis (Redis), `@nestjs/event-emitter`
- **IDs**: `ulidx` (ULID) for entity IDs

## Ecosystem Overview

| Concern | Tool |
|---|---|
| Framework | NestJS 11 |
| ORM | TypeORM + PostgreSQL |
| Auth | Passport (JWT, Auth0) |
| Validation | class-validator + class-transformer |
| API docs | Swagger / OpenAPI |
| Storage | Azure Blob Storage |
| Cache | ioredis (Redis) |
| Events | @nestjs/event-emitter |
| Testing | Vitest + Supertest |
| IDs | ulidx |

## DI Rules

- **Interfaces cannot be injection tokens** — NestJS DI relies on runtime tokens. Use concrete classes or `@Inject('TOKEN')` with string tokens.
- Critical for repository pattern: inject concrete repository classes, not interfaces.

## Conventions

- Single quotes, trailing commas (Prettier)
- TypeScript strict mode
- Module-per-feature organization
