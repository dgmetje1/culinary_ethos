---
name: be-best-practices
description: Use when designing NestJS module structure, services, dependency injection, or applying DDD patterns. Covers module organization, provider scopes, lifecycle hooks, and NestJS idioms.
---

# BE Best Practices

## Module Organization

- One module per bounded context / domain
- Modules import only what they need — keep the dependency graph acyclic
- `@Global()` modules sparingly (shared infra only: config, database)
- Feature modules should be self-contained with their own controllers, services, providers

## DDD Structure

```
module/
  domain/          # Entities, value objects, domain events, repository interfaces
  application/     # Use cases, DTOs, mappers, application services
  infrastructure/  # Repository implementations, external adapters, ORM entities
  interfaces/      # Controllers, GraphQL resolvers, WebSocket gateways
```

- Domain layer has zero framework dependencies
- Application layer depends on domain interfaces, not infrastructure
- Infrastructure implements domain interfaces (Dependency Inversion)

## Services

- **Application services**: orchestrate use cases, no business logic
- **Domain services**: stateless operations on multiple entities (rare)
- **Infrastructure services**: external integrations (email, storage, etc.)
- Keep controllers thin — delegate to application services

## Dependency Injection

- Use constructor injection (`@Injectable()`)
- Prefer class tokens over string tokens (`@Inject('TOKEN')`)
- Custom providers (`useFactory`, `useExisting`, `useValue`) for dynamic dependencies
- Avoid circular imports — restructure or use `forwardRef(() => Module)` as last resort

## Lifecycle Hooks

- `OnModuleInit` / `OnApplicationBootstrap`: startup initialization
- `OnModuleDestroy` / `BeforeApplicationShutdown`: graceful shutdown
- Use for: opening connections, loading config, starting background jobs

## Module Features

- `@Module({ controllers, providers, exports, imports })` is the unit of composition
- `exports` only what other modules need — hide internal providers
- `DynamicModule` for configurable/reusable modules (see `@nestjs/config`, `TypeOrmModule.forRoot`)

## Custom Decorators

- `@SetMetadata` + `Reflector` for custom metadata decorators
- Combine multiple decorators via `applyDecorators`
- Guard/Interceptor/Filter decorators for cross-cutting concerns
- Example: `@Public()`, `@Roles('admin')`, `@CurrentUser()`

## Guards, Interceptors, Pipes, Filters

| Concern | Mechanism |
|---|---|
| Auth / authorization | Guards |
| Request transformation | Pipes (validation, transformation) |
| Response transformation | Interceptors (logging, mapping, caching) |
| Error handling | Exception filters |

- Guards execute before interceptors, pipes run after guards
- Use pipes for input validation and transformation
- Use interceptors for cross-cutting behavior (logging, timing, caching)
- Use exception filters for consistent error responses

## Reusable Modules Pattern

- Accept configuration via `forRoot()` / `forRootAsync()`
- Allow per-feature customization with `forFeature()`
- Use `ConfigurableModuleBuilder` for type-safe dynamic modules
