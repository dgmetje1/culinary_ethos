---
name: be-data-layer
description: Use when working on database entities, TypeORM repositories, migrations, queries, or data modeling. Covers TypeORM, PostgreSQL, entity design, relations, indexes, migrations, and query optimization.
---

# BE Data Layer

## ORM: TypeORM

### Entity Design
```ts
import { Entity, PrimaryColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('table_name')
export class MyEntity {
  @PrimaryColumn('varchar', { length: 26 })
  id: string

  @Column({ type: 'varchar', length: 255 })
  name: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => RelatedEntity, (r) => r.myEntities)
  related: RelatedEntity
}
```

- Use ULID (`ulidx`) for primary keys rather than auto-increment (distributed-friendly)
- `@PrimaryColumn('varchar', { length: 26 })` for ULID strings
- Prefer `@CreateDateColumn` / `@UpdateDateColumn` over manual timestamps
- Use `@DeleteDateColumn` for soft deletes

### Relations

| Decorator | Purpose |
|---|---|
| `@ManyToOne` / `@OneToMany` | Parent-child relationships |
| `@OneToOne` / `@JoinColumn` | One-to-one (owning side has `@JoinColumn`) |
| `@ManyToMany` / `@JoinTable` | Many-to-many (owning side has `@JoinTable`) |

- `eager: true` carefully — can cause N+1 or circular loads
- `lazy: true` for relations that aren't always needed
- Use `relations` option in `find*` methods to control loading

### Repository Pattern

- Create custom repository classes extending `Repository` or using `DataSource`
- Inject via class token (not interface)

```ts
@Injectable()
export class MyRepository {
  constructor(
    @InjectRepository(MyEntity)
    private readonly repo: Repository<MyEntity>,
  ) {}

  async findById(id: string): Promise<MyEntity | null> {
    return this.repo.findOne({ where: { id } })
  }
}
```

## Queries

### Find Options
- `find`, `findOne`, `findAndCount` for basic queries
- `where`, `order`, `take`, `skip` for pagination
- `relations` for eager loading
- `select` to limit columns
- `cache` for query result caching (requires Redis)

### Query Builder
```ts
this.repo.createQueryBuilder('entity')
  .leftJoinAndSelect('entity.relation', 'r')
  .where('entity.status = :status', { status: 'active' })
  .andWhere('r.name ILIKE :name', { name: '%search%' })
  .orderBy('entity.createdAt', 'DESC')
  .skip(0)
  .take(20)
  .getManyAndCount()
```

- Use for complex queries or dynamic conditions
- `getManyAndCount()` for paginated results
- `.getRawMany()` / `.getRawOne()` for aggregated/select-only queries
- Use parameter binding (never string interpolation)

### Indexes
```ts
@Entity()
@Index(['name', 'status'])
@Unique(['email'])
export class MyEntity {
  @Index()
  @Column()
  email: string
}
```

- Index foreign key columns automatically
- Composite indexes for multi-field queries (WHERE a AND b)
- `@Unique` for unique constraints
- `synchronize: true` creates indexes in dev; use migrations for prod

## Migrations

```bash
npx typeorm migration:create src/migrations/MigrationName
npx typeorm migration:run
npx typeorm migration:revert
```

- Always use migrations for production schema changes
- `synchronize: true` is dev-only convenience
- Migration files should be committed to version control
- Test migrations against a copy of production data

## PostgreSQL Specifics

- `ILIKE` for case-insensitive search
- `JSONB` columns for flexible schemas (use `@Column('jsonb')`)
- `ARRAY` type with `@Column('text', { array: true })`
- Full-text search via `tsvector` / `tsquery`
- `uuid-ossp` or `pgcrypto` extensions if not using ULID client-side
- Connection pooling: TypeORM handles via `extra: { max: 20 }`

## Performance

- N+1 prevention: use `relations` or `QueryBuilder` joins
- Add `limit` / `offset` for pagination (never load all rows)
- Use `select` to fetch only needed columns
- `findAndCount` / `getManyAndCount` for pagination metadata
- Batch inserts with `save(array)` or `INSERT ... VALUES` via QueryBuilder
- Monitor slow queries with PostgreSQL `pg_stat_statements`

## DataSource Config

```ts
// typeorm.config.ts
import { DataSource } from 'typeorm'

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: process.env.NODE_ENV !== 'production',
})
```

- Separate `DataSource` for CLI migrations vs NestJS `TypeOrmModule.forRoot()`
- Use `synchronize: false` in production
