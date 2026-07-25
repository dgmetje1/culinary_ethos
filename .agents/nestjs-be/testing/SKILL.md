---
name: be-testing
description: Use when writing or debugging backend tests. Covers Vitest, NestJS testing utilities, unit tests, integration tests, e2e tests, mocking, and test database setup.
---

# BE Testing

## Tooling

- **Test runner**: Vitest
- **NestJS testing**: `@nestjs/testing` (`Test.createTestingModule`)
- **HTTP testing**: Supertest (`@types/supertest`, `supertest`)
- **Mocking**: `vi.mock`, `vi.spyOn`, custom providers for DI overrides
- **Coverage**: `@vitest/coverage-v8`

## Unit Tests

### Service Tests
```ts
import { Test, TestingModule } from '@nestjs/testing'

describe('MyService', () => {
  let service: MyService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MyService,
        { provide: Repository, useValue: mockRepository },
      ],
    }).compile()

    service = module.get<MyService>(MyService)
  })
})
```

- Mock all external dependencies in `providers`
- Use `.compile()` with `useValue` / `useClass` overrides
- Test service methods in isolation — no HTTP or DB

### Controller Tests
- Mock the service layer
- Test request mapping, validation, and status codes
- Use `@nestjs/testing` to get the controller instance

## Integration Tests

### Database Integration
- Use a test database or in-memory alternative
- Wrap tests in transactions and rollback after each test
- Create test data via repositories, not HTTP

### NestJS Testing Module
```ts
const module = await Test.createTestingModule({
  imports: [AppModule],
  providers: [
    { provide: APP_GUARD, useExisting: JwtAuthGuard },
  ],
})
  .overrideProvider(SomeProvider)
  .useValue(mockValue)
  .compile()
```

- Override specific providers without mocking the entire module
- Use `.overrideProvider()` for targeted substitutions

## E2E Tests

```ts
import * as request from 'supertest'

describe('App (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('GET /resource returns 200', () => {
    return request(app.getHttpServer())
      .get('/resource')
      .expect(200)
  })
})
```

- Create full `NestApplication` with real module imports
- Use Supertest for HTTP assertions
- Use `.overrideProvider()` sparingly — e2e should test real integration

## Mocking Strategies

- **Repository**: mock the repository class with a plain object implementing the same methods
- **External HTTP calls**: mock the service or use `msw/node` for intercepting HTTP
- **Auth guards**: override with `APP_GUARD` mock or use `.overrideGuard()`
- **Config**: provide `ConfigService` mock or use in-memory values

## Test Patterns

- `beforeEach` / `afterEach` for test isolation
- `beforeAll` / `afterAll` for app bootstrap
- Use `describe` blocks to organize by feature/method
- Test the happy path, error cases, and edge cases
- Use `it.each` for data-driven parameterized tests

## Config

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/test-setup.ts'],
    include: ['**/*.spec.ts'],
  },
})
```

- `setupFiles` should import `reflect-metadata` for NestJS DI
- Use `globalSetup` / `teardown` for database lifecycle in e2e tests
