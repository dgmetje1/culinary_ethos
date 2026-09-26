---
name: be-api-design
description: Use when designing API endpoints, DTOs, validation rules, Swagger/OpenAPI docs, or error handling. Covers REST conventions, request/response patterns, validation, and documentation.
---

# BE API Design

## REST Conventions

- Plural nouns for resources: `/recipes`, `/users`, `/categories`
- Nested routes for sub-resources: `/recipes/:id/comments`
- Query params for filtering, sorting, pagination: `?status=active&sort=createdAt&page=1&limit=20`
- HTTP methods: GET (read), POST (create), PATCH (partial update), PUT (full replace), DELETE (remove)
- Return proper status codes: 201 for creation, 204 for deletion, 400/404/409 for errors

## DTOs

### Request DTOs

```ts
import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecipeDto {
    @ApiProperty({ example: 'Spaghetti Carbonara' })
    @IsString()
    name: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ minimum: 1, maximum: 999 })
    @IsInt()
    @Min(1)
    @Max(999)
    servings: number;
}
```

- Use `class-validator` decorators for validation rules
- Use `@ApiProperty` for Swagger schema generation
- Separate DTOs for create, update, and response

### Response DTOs

```ts
export class RecipeResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    createdAt: Date;
}
```

- Never expose internal entities directly as responses
- Map entities to DTOs via dedicated mapper functions
- Use `@nestjs/swagger` decorators for response documentation

## Validation

### Global Validation Pipe

```ts
app.useGlobalPipes(
    new ValidationPipe({
        whitelist: true, // strip unknown properties
        forbidNonWhitelisted: true, // throw on unknown properties
        transform: true, // auto-transform types
        transformOptions: {
            enableImplicitConversion: true,
        },
    }),
);
```

- `whitelist: true` prevents mass-assignment vulnerabilities
- `transform: true` converts string params to numbers, etc.
- Custom validation decorators for reusable rules

### Validation Groups

```ts
@IsString({ groups: ['create'] })
@IsOptional({ groups: ['update'] })
name: string
```

- Use `@ValidateBy` / custom validators for complex business rules

## Pagination

```ts
export class PaginationQueryDto {
    @ApiProperty({ default: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiProperty({ default: 20 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 20;
}

export class PaginatedResponseDto<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
```

## Error Handling

### Exception Filters

```ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        response.status(status).json({
            statusCode: status,
            message: exception.message,
            timestamp: new Date().toISOString(),
            path: ctx.getRequest().url,
        });
    }
}
```

- Global exception filter for consistent error shape
- Custom exception classes for domain-specific errors
- Never expose stack traces in production

```ts
export class EntityNotFoundError extends HttpException {
    constructor(entity: string, id: string) {
        super(`${entity} with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
}
```

## Swagger / OpenAPI

```ts
const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('recipes')
    .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```

- Use `@ApiTags`, `@ApiOperation`, `@ApiResponse` decorators
- `@ApiBearerAuth()` for protected endpoints
- `@ApiQuery`, `@ApiParam` for query/param documentation
- Group endpoints by tag (usually matching module/controller name)
- Enable `SwaggerModule` only in development

## Content Negotiation

- JSON by default (NestJS Platform Express sends `Content-Type: application/json`)
- Accept `Content-Type: application/json` on requests
- File uploads via `@UseInterceptors(FileInterceptor('file'))` with `multer`

## Versioning

```ts
app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
});
```

- URI versioning: `/v1/recipes`
- Keep backward-compatible responses within a version
- Deprecate old versions with warning headers before removal
