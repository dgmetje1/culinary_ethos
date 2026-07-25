---
name: software-principles
description: Use when reviewing code, designing architecture, or making design decisions. Covers SOLID, DRY, KISS, YAGNI, composition over inheritance, law of Demeter, and other software engineering principles. Apply these when evaluating code quality and structure.
---

# Software Principles

## SOLID

### Single Responsibility
- A class/module should have one reason to change
- Extract cross-cutting concerns into separate modules
- Each function should do one thing well

### Open/Closed
- Open for extension, closed for modification
- Use polymorphism, strategy pattern, hooks, or plugin systems instead of conditionals
- New behavior via new code, not changes to existing tested code

### Liskov Substitution
- Subtypes must be substitutable for their base types
- Don't strengthen preconditions or weaken postconditions in derived classes
- If overriding a method, ensure callers expecting the base type still work

### Interface Segregation
- Many specific interfaces are better than one general-purpose interface
- Clients should not depend on methods they don't use
- Split large interfaces into smaller, focused ones

### Dependency Inversion
- Depend on abstractions, not concretions
- High-level modules should not depend on low-level modules — both depend on abstractions
- Use dependency injection to decouple

## DRY (Don't Repeat Yourself)
- Extract duplicated logic into shared functions, hooks, or utilities
- Beware of premature abstraction — wait for 3+ occurrences before extracting
- Duplication is cheaper than the wrong abstraction (Sandi Metz rule)

## KISS (Keep It Simple, Stupid)
- Prefer simple, readable solutions over clever or complex ones
- If a solution isn't immediately understandable, it's probably over-engineered
- Flat is better than nested (structure, conditionals, callbacks)

## YAGNI (You Ain't Gonna Need It)
- Don't add functionality until it's actually needed
- Speculative generality adds complexity with no proven value
- Delete dead code — version control keeps history

## Composition Over Inheritance
- Prefer composing small, focused units over deep inheritance hierarchies
- Mixins, HOCs, render props, and hooks over class inheritance trees
- Inheritance creates rigid taxonomies; composition enables flexible behavior

## Law of Demeter (Principle of Least Knowledge)
- A unit should only talk to its immediate dependencies
- Don't chain: `a.b().c().d()` — this couples to the full chain
- Tell, don't ask: give objects commands rather than querying their state

## Command-Query Separation (CQS)
- A method should be either a command (mutates state) or a query (returns data), not both
- Exceptions: stack-like operations (pop returns and mutates)

## Separation of Concerns
- Each layer/module handles one concern: UI, business logic, data access, infrastructure
- Domain logic belongs in domain layer, not in controllers or components
- Keep framework concerns isolated from business logic

## Principle of Least Astonishment
- Code should behave in ways that surprise the reader the least
- Follow language/framework idioms and community conventions
- Name things clearly — a function called `save` should save, not save+sendEmail

## Boy Scout Rule
- Leave the codebase cleaner than you found it
- Small improvements with every change: rename unclear variables, extract magic numbers, simplify conditionals
- Don't let tech debt accumulate incrementally

## Consistency
- Follow existing patterns in the codebase, even if you prefer a different style
- Consistency matters more than which specific convention is chosen
- Use automated formatters (Prettier) and linters to enforce mechanically
