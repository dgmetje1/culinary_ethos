---
name: design-patterns
description: Use when designing or reviewing code structure, choosing between patterns, or refactoring. Covers creational, structural, and behavioral design patterns with TypeScript-specific examples.
---

# Design Patterns

## Creational

### Factory / Factory Method

- Delegate object creation to a factory method or class
- Useful when creation logic is complex or depends on runtime conditions
- TypeScript: constructors with discriminated unions, `createX` static methods
- Example: `RepositoryFactory.create(type, config)`

### Builder

- Step-by-step construction of complex objects
- Fluent API with method chaining
- TypeScript: class with `set*()` methods returning `this`
- Alternative: object parameter with optional fields for simpler cases

### Singleton

- Single instance shared across the app
- TypeScript: module-level instance, or `static getInstance()` with private constructor
- Use sparingly — often a sign you should use DI instead
- Acceptable for: logger, config registry, connection pools

## Structural

### Adapter

- Converts one interface to another expected by the client
- Wraps a foreign/incompatible object to match a known contract
- TypeScript: class implementing the target interface, delegating to the adaptee
- Common use: wrapping third-party libraries, API response normalization

### Decorator

- Attaches additional responsibilities to an object dynamically
- TypeScript: function wrappers, HOCs in React, `@decorator` syntax for classes
- NestJS example: `@Public()`, `@Roles('admin')` — decorators adding metadata
- Functional alternative: higher-order functions that wrap behavior

### Facade

- Simplified interface over a complex subsystem
- Hides internal complexity behind a single entry point
- TypeScript: service classes that orchestrate multiple internal modules
- Example: `OrderService.facade` coordinating payment, inventory, shipping

### Proxy

- Controls access to another object (lazy loading, caching, access control)
- TypeScript: class implementing the same interface, delegating with interception
- Use cases: lazy initialization, caching, logging, validation middleware

## Behavioral

### Strategy

- Encapsulates interchangeable algorithms behind a common interface
- TypeScript: interface + implementations passed via constructor or method
- Example: `SortStrategy` — `QuickSort`, `MergeSort`, `BubbleSort`

### Observer

- One-to-many notification when state changes
- TypeScript: `EventEmitter`, RxJS `Subject`, NestJS `@nestjs/event-emitter`
- React: TanStack Query's `queryClient.subscribe`, context + useSyncExternalStore

### Command

- Encapsulates a request as an object with all parameters
- Enables queuing, undo/redo, logging, deferred execution
- TypeScript: class with `execute()` method, stored for later replay

### Template Method

- Defines the skeleton of an algorithm, deferring steps to subclasses
- TypeScript: abstract base class with concrete template method + abstract steps
- Alternative: higher-order function accepting callbacks for the variable parts

### Chain of Responsibility

- Passes a request along a chain of handlers until one processes it
- TypeScript: linked handlers with `setNext()`, each decides to handle or pass
- Example: middleware pipelines, Express-style `next()` chains

## Dependency Injection Patterns

### Constructor Injection

- Dependencies passed via constructor (preferred in NestJS)
- Makes dependencies explicit and testable

### Provider Pattern

- Abstracted creation and lifecycle management of dependencies
- TypeScript: DI container (NestJS modules), React Context providers

## React-Specific Patterns

### Compound Components

- Related components that share implicit state via context
- Example: `<Select>` + `<Select.Option>` + `<Select.Trigger>`

### Render Props

- Component receives a function that renders its content
- Largely superseded by hooks in modern React

### Higher-Order Component (HOC)

- Function that takes a component and returns an enhanced component
- Use: adding auth guards, analytics, layout wrappers

## When to Use (and Not Use) Patterns

- A pattern should solve an actual problem, not be applied preemptively
- Over-engineering with patterns is worse than no patterns
- Prefer language/framework built-in mechanisms before reaching for a pattern
- Patterns document intent — name them in code when they clarify structure
