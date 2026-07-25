---
name: fe-best-practices
description: Use when writing or reviewing React components, hooks, state management, or performance optimizations. Covers component architecture, hook patterns, state management, and React 19 best practices.
---

# FE Best Practices

## Component Architecture

- Prefer functional components with hooks
- Keep components small and single-responsibility
- Use composition over inheritance
- Extract reusable logic into custom hooks
- Co-locate styles, tests, and types with the component

## Hooks

- Custom hooks should start with `use` and return a stable interface
- Avoid `useEffect` for data fetching — use TanStack React Query instead
- `useMemo` and `useCallback` only for expensive computations or stable references
- Prefer `useReducer` over `useState` for complex state logic
- Use React 19 `use()` hook for reading context and promises in render

## State Management

- Server state: TanStack React Query (cache, refetch, optimistic updates)
- UI state: `useState` / `useReducer` locally
- Shared global state: React Context (sparingly — avoid over-rendering)
- Form state: TanStack React Form (not raw useState)

## Performance

- Lazy load route components with `React.lazy` / TanStack Router
- Virtualize long lists (consider libraries like `@tanstack/react-virtual`)
- Avoid prop drilling — compose or use context
- Memoize expensive child components with `React.memo`
- Use `Suspense` boundaries for data-fetching and code-splitting

## React 19 Specifics

- `use()` hook: unwrap promises and context in render
- `useActionState` for form actions (if using server actions)
- `useOptimistic` for optimistic UI updates
- Improved `ref` prop — no longer need `forwardRef` in most cases
- Document metadata via built-in `<title>`, `<meta>` support

## Styling Patterns

- Tailwind utility classes for most styling
- CVA (`class-variance-authority`) for component variants
- `clsx` + `tailwind-merge` for conditional classes
- MUI components for complex UI (tables, date pickers, etc.)
- Avoid CSS-in-JS runtime solutions — prefer Tailwind compile-time
