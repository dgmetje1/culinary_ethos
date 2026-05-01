# Migration Plan: Express to NestJS

## Overview
This document outlines the migration strategy for moving from the Express-based backend (`dev/rcp-and-plan/packages/BE`) to a NestJS implementation in `dev/rcp-and-plan-nest`, preserving all existing features and maintaining the bounded context architecture.

## Current Structure Analysis

### Express Backend Structure
```
packages/BE/
├── API_Rcp_and_plan/          # Main API (migrating to NestJS)
├── BC_Content/                # Bounded Context: Content Management
├── BC_Social/                 # Bounded Context: Social Features
├── Commons/                   # Shared utilities and domain concepts
└── package.json               # Root backend package
```

### Key Technical Details
- Clean Architecture with separation of concerns:
  - Application Layer (use cases/commands)
  - Domain Layer (entities, value objects)
  - Infrastructure Layer (repositories, models)
  - API Layer (controllers/routes, middleware)
- Swagger/OpenAPI documentation via annotations
- PostgreSQL database (inferred from entity patterns)
- Redis for caching/user context (from middleware)

## Migration Strategy

### NestJS and DDD Best Practices

Before diving into the migration phases, it's important to establish the best practices that will guide our implementation to ensure a maintainable, scalable, and clean architecture that properly implements Domain-Driven Design principles with NestJS.

#### Domain-Driven Design Principles to Follow
1. **Bounded Contexts as NestJS Modules**: Each bounded context (BC_Content, BC_Social) becomes a dedicated NestJS module with clear boundaries
2. **Entities and Value Objects**: Keep domain entities rich with behavior, not just data carriers
3. **Aggregates**: Implement aggregate roots to control access to child entities (e.g., Recipe as aggregate root for RecipeIngredients, RecipeSteps)
4. **Repositories**: Abstract persistence concerns behind repository interfaces in the domain layer
5. **Domain Services**: Place complex business logic that doesn't belong to entities in domain services
6. **Application Services**: Use cases/commands orchestrate domain objects but don't contain business logic
7. **Value Objects**: Implement immutable value objects for concepts like Money, Email, ID wrappers
8. **Domain Events**: Implement domain events for loose coupling between domain parts

#### NestJS Best Practices for DDD
1. **Module Structure Aligned with Bounded Contexts**:
   ```
   src/
   ├── content/                 # BC_Content Module
   │   ├── domain/              # Domain layer (entities, value objects, interfaces)
   │   ├── application/         # Application layer (use cases, DTOs)
   │   ├── infrastructure/      # Infrastructure layer (persistence, external services)
   │   ├── interfaces/          # REST controllers, GraphQL resolvers
   │   └── content.module.ts
   ```
   
2. **Dependency Injection Strategy**:
   - Use NestJS DI exclusively for all concerns (framework, infrastructure, and application layers)
   - Domain entities, value objects, and services are regular TypeScript classes managed by NestJS container
   - Inject repository interfaces (domain) with TypeORM implementations (infrastructure) via constructor injection

3. **Controller Responsibilities**:
   - Handle HTTP concerns only (validation, authentication, response formatting)
   - Delegate all business logic to application services
   - Use DTOs for data transfer with class-validator
   - Minimal logic - thin controllers

4. **Service Layer Organization**:
   - Application Services (Use Cases): Orchestrate workflows, handle transactions
   - Domain Services: Contain complex business logic involving multiple entities
   - Infrastructure Services: Handle technical concerns (email, file storage, external APIs)

5. **Persistence with TypeORM**:
   - Repository pattern: Inject repositories via constructor
   - Entities: Keep them as rich domain models with behavior
   - Avoid putting persistence concerns in domain entities
   - Use TypeORM events/subscribers for cross-cutting concerns

6. **Validation**:
   - Use class-validator and class-transformer in DTOs
   - Create custom validation decorators for domain-specific validations
   - Validation pipes at controller level

7. **Exception Handling**:
   - Create domain-specific exceptions (EntityNotFound, BusinessRuleViolation)
   - Map domain exceptions to appropriate HTTP responses via exception filters
   - Never leak internal implementation details in error messages

8. **Authentication and Authorization**:
   - Use Guards for authentication (JWT strategy)
   - Use decorators and guards for role-based permissions
   - Keep authorization logic in domain/services when it's business logic

9. **Testing Approach**:
   - Unit tests for domain entities and services
   - Integration tests for application services with mocked infrastructure
   - Contract tests for controllers
   - End-to-end tests for critical user journeys

### Phase 1: Project Setup
1. **Initialize NestJS Project** (already done)
   - Nest CLI installed and configured
   - Basic app module, controller, service created
   - Package.json updated with NestJS dependencies

2. **Dependency Mapping**
   ```json
   // Additional dependencies needed:
   "@nestjs/swagger": "^7.0.0",
   "@nestjs/config": "^3.0.0",
   "@nestjs/jwt": "^10.0.0",
   "@nestjs/passport": "^10.0.0",
   "passport": "^0.7.0",
   "passport-jwt": "^4.0.0",
   "passport-auth0": "^1.3.3",
   "typeorm": "^0.3.0",
   "pg": "^8.11.0",

   "ulidx": "^2.4.1"    // Keep existing ID generation
   ```

### Phase 2: Architecture Translation

#### Express → NestJS Concept Mapping (with DDD Best Practices)
| Express Concept | NestJS Equivalent | Implementation Notes (DDD-focused) |
|----------------|-------------------|------------------------------------|
| Express Application | NestJS Application | Main bootstrap in main.ts; configure global validation pipes, exception filters |
| Express Router | NestJS Controller | @Controller() decorator in interfaces layer; thin controllers delegating to application services |
| Route Handlers | Controller Methods | @Get(), @Post(), etc.; validate input with DTOs, delegate business logic |
| Middleware | NestJS Middleware/Pipes/Guards | Implement as NestJS middleware for cross-cutting concerns; use pipes for validation, guards for auth |
| Dependency Injection | NestJS DI | Use NestJS DI exclusively for all concerns (framework, infrastructure, application, and domain layers) |
| Custom Decorators (OpenAPI) | NestJS Swagger Decorators | @ApiTags(), @ApiOperation() in interface layer controllers |
| Service Classes | NestJS Services + Domain Services | Application services (@Injectable) orchestrate use cases; domain services contain business logic (as regular classes) |
| Repository Pattern | TypeORM Repositories | Inject repositories via constructor; domain defines repository interfaces, infrastructure provides implementations |
| Business Logic in Controllers | Application/Domain Services | Move ALL business logic out of controllers into appropriate service layers |
| Direct Database Access | Repository Abstraction | Access data only through repository interfaces; never use EntityManager directly in domain |

#### Bounded Context Preservation
Each Express bounded context becomes a NestJS Module:
- `API_Rcp_and_plan` → `AppModule` (root) + Feature Modules
- `BC_Content` → `ContentModule`
- `BC_Social` → `SocialModule` 
- `Commons` → Shared modules and libraries

### Phase 3: Implementation Approach

#### 1. Core Infrastructure Setup
- Database connection (TypeORM) in app.module.ts
- Configuration service using @nestjs/config
- Authentication strategy (Auth0 JWT) using passport
- Global pipes for validation
- Global exception filters

#### 2. Module Structure (DDD-Aligned)
```
src/
├── content/                  # BC_Content Module (Bounded Context)
│   ├── domain/               # Domain Layer: Entities, Value Objects, Domain Services, Repository Interfaces
│   │   ├── models/           # Entities and Value Objects
│   │   │   ├── recipe/
│   │   │   │   ├── recipe.entity.ts          # Rich entity with behavior
│   │   │   │   ├── recipe-aggregate.ts       # Aggregate root implementation
│   │   │   │   ├── recipe-id.value-object.ts # Value Object example
│   │   │   │   └── ...
│   │   │   ├── ingredient/
│   │   │   ├── kitchenware/
│   │   │   └── unit/
│   │   ├── services/         # Domain Services (business logic)
│   │   │   ├── recipe-domain.service.ts
│   │   │   └── ...
│   │   ├── repositories/     # Repository Interfaces (domain contracts)
│   │   │   ├── i-recipe.repository.ts
│   │   │   ├── i-ingredient.repository.ts
│   │   │   └── ...
│   │   └── events/           # Domain Events
│   │       ├── recipe-created.event.ts
│   │       └── ...
│   │
│   ├── application/          # Application Layer: Use Cases, DTOs, Application Services
│   │   ├── dto/              # Data Transfer Objects with validation
│   │   │   ├── requests/
│   │   │   │   ├── create-recipe.dto.ts
│   │   │   │   └── ...
│   │   │   └── responses/
│   │   │       ├── recipe-response.dto.ts
│   │   │       └── ...
│   │   ├── services/         # Application Services (Use Cases/Commands)
│   │   │   ├── create-recipe.use-case.ts
│   │   │   ├── add-ingredients.use-case.ts
│   │   │   └── ...
│   │   └── exceptions/       # Application-specific exceptions
│   │
│   ├── infrastructure/       # Infrastructure Layer: Persistence, External Services
│   │   ├── repositories/     # Repository Implementations
│   │   │   ├── recipe.repository.ts          # TypeORM implementation
│   │   │   ├── ingredient.repository.ts
│   │   │   └── ...
│   │   ├── models/           # TypeORM Entities (persistence models)
│   │   │   ├── recipe-entity.ts
│   │   │   └── ...
│   │   ├── migrations/       # Database Migrations
│   │   └── external/         # Third-party service integrations
│   │
│   ├── interfaces/           # Interface Layer: Controllers, Presenters
│   │   ├── controllers/      # REST Controllers (thin layer)
│   │   │   ├── recipes.controller.ts
│   │   │   ├── ingredients.controller.ts
│   │   │   ├── kitchenware.controller.ts
│   │   │   └── units.controller.ts
│   │   └── dtos/             # Interface-specific DTOs if needed
│   │
│   └── content.module.ts     # NestJS Module definition
│
├── social/                   # BC_Social Module (similar structure to content/)
├── commons/                  # Shared libraries (kernels, utilities, shared domain concepts)
│   ├── kernel/               # Shared kernel (DDD concept)
│   │   ├── domain/           # Shared domain entities, value objects
│   │   └── ...
│   ├── exceptions/           # Shared exceptions
│   ├── headers-propagation/  # Shared headers propagation logic
│   ├── sql/                  # Shared SQL utilities
│   └── utils/                # Shared utilities
│
├── app.controller.ts         # Root controller (health checks, etc.)
├── app.service.ts            # Root service
└── main.ts                   # Application bootstrap
```

#### 3. Migration Order
1. **Shared Infrastructure** (Commons, database, auth)
2. **Content Bounded Context** (most complex, has most endpoints)
3. **Social Bounded Context** 
4. **API Gateway/Integration** (if needed for cross-context communication)
5. **Testing** (unit, integration, e2e)

#### 4. Specific Component Migration (DDD Approach)

##### Controllers from Routes (Interface Layer)
- Each `.route.ts` file becomes a controller in the `interfaces/` layer
- Route paths become controller prefix (`@Controller('recipes')`) and method decorators (`@Get()`, `@Post()`)
- Controllers are thin: validate input with DTOs, delegate to application services, format output
- Dependency injection via constructor (NestJS DI) for application services
- Apply validation pipes, auth guards, and interceptors as needed

##### Services Migration (Application and Domain Layers)
- **Application Services**: Express service orchestration logic becomes NestJS `@Injectable()` services in `application/services/`
  - These are use cases/commands that orchestrate domain objects
  - Example: `CreateRecipeUseCase`, `AddIngredientsUseCase`
  - Inject domain services and repository interfaces via constructor
  
- **Domain Services**: Complex business logic moves to domain services in `domain/services/`
  - Contains business rules that span multiple entities
  - Example: `RecipePricingService`, `RecipeValidationService`
  - No NestJS decorators - pure TypeScript classes
  - Injected via constructor when needed by application services
  
- **Domain Objects**: Use regular TypeScript classes for domain entities, value objects, and services
  - These are managed by the NestJS dependency injection container
  - No special decorators needed for basic dependency injection
  - Infrastructure services (repositories, external integrations) use NestJS DI

##### DTOs (Application Layer)
- Request/Response DTOs reside in `application/dto/`
- Add class-validator decorators for automatic validation (`@IsString()`, `@IsInt()`, `@Min()`, etc.)
- Use class-transformer for transformation needs (`@Transform()`, `@Exclude()`, etc.)
- Keep OpenAPI annotations in DTOs for Swagger documentation (`@ApiProperty()`)
- Create specific DTOs for each use case rather than reusing generic ones

##### Middleware (Infrastructure/Cross-cutting Concerns)
- **Authentication**: Convert express-oauth2-jwt-bearer to NestJS AuthGuard (`@UseGuards(AuthGuard)`)
- **Authorization**: Create custom guards for business logic-based permissions (can inject services)
- **Validation**: Use ValidationPipe globally or at controller level with DTOs
- **Error Handling**: Create exception filters that map domain exceptions to HTTP responses
- **Logging/Context**: Create interceptors for cross-cutting concerns like request logging, user context
- **User Context**: Create custom decorator (`@CurrentUser()`) or request-scoped provider instead of middleware attaching to request

##### Database Layer (Infrastructure Layer)
- **Repositories**: 
  - Domain defines repository interfaces in `domain/repositories/` (e.g., `IRecipeRepository`)
  - Infrastructure provides TypeORM implementations in `infrastructure/repositories/` (e.g., `RecipeRepository`)
  - Inject repository interfaces into application/services via constructor (NestJS DI)
  
- **Entity Models**:
  - Create TypeORM entities in `infrastructure/models/` that mirror domain entities
  - Keep domain entities rich with behavior in `domain/models/`
  - Use mappers to convert between domain entities and TypeORM entities when needed
  - OR embed persistence concerns carefully in domain entities if simplicity is preferred
  
- **ID Generation**: 
  - Keep Ulidx for ID generation in entity constructors or factory methods
  - Consider using database-generated IDs with Ulidx as backup
  
- **Migrations**: 
  - Create initial migration from current schema using TypeORM CLI
  - Use migration files for schema evolution
  
- **Transactions**: 
  - Handle transactions in application services using EntityManager
  - Consider transactional decorators for common patterns

##### Factories and Builders
- Consider implementing factory patterns for complex object creation
- Use builders for objects with many optional parameters
- Keep creation logic in domain services or dedicated نظرية

### Phase 4: Feature Preservation Checklist

#### API Endpoints (from API_Rcp_and_plan)
✓ **Recipes**
- GET /recipes (list with filtering)
- GET /recipes/daily
- GET /recipes/{id}
- POST /recipes (create)
- PUT /recipes/{id}/ingredients
- PUT /recipes/{id}/kitchenware
- PUT /recipes/{id}/steps

✓ **Ingredients**
- Similar CRUD operations (inferred from routes)

✓ **Kitchenware**
- Similar CRUD operations

✓ **Units**
- Similar CRUD operations

✓ **Users/Social**
- From BC_Social and API_Social routes

#### Non-Functional Requirements
- Authentication (Auth0 JWT bearer tokens)
- Request validation
- Response formatting
- Error handling (consistent error responses)
- Logging
- Swagger/OpenAPI documentation
- Rate limiting (if present)
- CORS handling
- Compression
- Helmet security headers

### Phase 5: Testing Strategy (DDD-focused)

#### Unit Tests
- **Domain Layer**: Test entities, value objects, and domain services for business logic correctness
  - Test invariants and business rules
  - Test state transitions and behavior
  - No dependencies on infrastructure (pure unit tests)
  
- **Application Layer**: Test use cases/application services with mocked domain repositories
  - Verify orchestration logic
  - Test transaction boundaries
  - Test error handling and edge cases
  
- **Infrastructure Layer**: Test repository implementations with real database (testcontainers)
  - ORM mapping correctness
  - Query performance
  - Transaction handling
  
- **Interface Layer**: Test controllers in isolation with mocked application services
  - Input validation
  - Output formatting
  - HTTP status codes
  
- Use Jest with appropriate test organization (unit, integration, e2e)

#### Integration Tests
- **Application Service Tests**: Test use cases with real repositories against test database
  - Verify complete use case flows
  - Test database transactions
  - Test repository implementations
  
- **API Endpoint Tests**: Test controller interfaces with real application services
  - Test authentication and authorization
  - Test validation and error handling
  - Test happy paths and edge cases
  
- Use testcontainers or dedicated test database for realistic testing

#### Contract Tests
- Test API contracts against OpenAPI/Swagger specifications
- Ensure backward compatibility
- Validate request/response formats

#### End-to-End Tests
- Critical user journeys (recipe creation, browsing, shopping list generation, etc.)
- Test complete system including authentication
- Validate business outcomes, not just API responses
- Using supertest or similar tools

### Phase 6: Deployment Considerations

#### Environment Variables
- Map existing .env variables to NestJS ConfigService
- Required: DATABASE_URL, JWT secrets, Auth0 configuration, etc.

#### Build Process
- NestJS build outputs to dist/
- Same PM2/docker deployment processes should work
- Health check endpoints

#### Monitoring
- Maintain existing logging format if required
- Add NestJS-specific metrics if needed

## Risk Mitigation

### Backward Compatibility
- Maintain identical API contracts (request/response formats)
- Preserve error response structures
- Keep same endpoint paths and HTTP methods
- Version APIs if breaking changes are unavoidable

### Data Migration
- No schema changes planned initially
- If needed, create TypeORM migrations
- Backup strategy for production data

### Rollback Plan
- Keep existing Express backend deployable
- Feature flag or routing layer to switch between implementations
- Database schema compatibility maintained

## Estimated Effort
- Setup and infrastructure: 1-2 days
- Content BC migration: 3-4 days
- Social BC migration: 2-3 days
- Testing and validation: 2-3 days
- Total: 8-12 days (depending on familiarity with NestJS)

## Success Criteria
1. All existing API endpoints return identical responses for identical requests
2. Authentication and authorization work identically
3. Database operations produce same results
4. Error handling maintains same format and HTTP status codes
5. Swagger documentation is generated and matches existing annotations
6. Performance characteristics are maintained or improved
7. Code follows NestJS best practices and DDD principles
8. Domain layer is independent of framework and infrastructure details
9. Clear separation of concerns: Domain, Application, Infrastructure, Interface layers
10. Business logic is properly encapsulated in domain entities and services
11. Application services orchestrate use cases without containing business logic
12. Infrastructure concerns (persistence, external services) are properly abstracted
13. Interfaces layer (controllers) handles only HTTP concerns and delegates to application layer

## Next Steps Immediate (DDD Approach)
1. **Set up core infrastructure**
   - Configure TypeORM database connection in app.module.ts
   - Set up @nestjs/config for environment variables
   - Configure global validation pipes and exception filters

2. **Establish DDD foundations for Content Bounded Context**
   - Create domain layer structure: Content/domain/{models,services,repositories,events}
   - Define repository interfaces in domain/repositories (e.g., IRecipeRepository)
   - Create basic entity structures with behavior in domain/models

3. **Implement infrastructure layer**
   - Create TypeORM entity models in Content/infrastructure/models/
   - Implement repository interfaces in Content/infrastructure/repositories/
   - Set up database migrations

4. **Create application layer**
   - Define DTOs with validation in Content/application/dto/
   - Implement use cases/services in Content/application/services/

5. **Build interface layer**
   - Create controllers in Content/interfaces/controllers/ that delegate to application services
   - Apply validation pipes and auth guards

6. **Verify with a simple endpoint**
   - Implement a read-only endpoint (e.g., GET units) to validate the full stack
   - Test end-to-end: controller → application service → domain service → repository → database

7. **Expand to full bounded context**
   - Implement all Content bounded context features following the DDD structure
   - Repeat for Social bounded context