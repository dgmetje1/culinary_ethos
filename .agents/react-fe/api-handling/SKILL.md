---
name: fe-api-handling
description: Use when working on API data fetching, mutations, caching, or the API client layer. Covers TanStack React Query patterns, Axios setup, optimistic updates, infinite queries, and error handling.
---

# FE API Handling

## Architecture

- Axios client with interceptors for auth token injection and error normalization
- TanStack React Query wrapping the Axios layer
- Separate concerns: query keys, query functions, query hooks, mutations

## React Query Patterns

### Organization

```
src/
  queries/
    <domain>/
      keys.ts         # Query key factories
      queries.ts      # Raw fetch functions
      queryHooks.ts   # useQuery / useSuspenseQuery wrappers
      mutations.ts    # useMutation wrappers
      options.ts      # Prefetch/invalidation options
```

### Query Keys

- Use structured factory functions, not string literals
- Example: `todoKeys.all()`, `todoKeys.detail(id)`, `todoKeys.list(filters)`
- Keys should be hierarchical for partial invalidation

### Query Functions

- Return the Axios response data directly
- Handle 401/403 in interceptors, not per-query
- Use `queryFn` context (`queryKey`, `signal`) for cancellation

### Hooks

- Create typed custom hooks wrapping `useQuery` / `useSuspenseQuery`
- Set sensible `staleTime` and `gcTime` defaults per domain
- Prefer `useSuspenseQuery` for route-level data that should block rendering

### Mutations

- `useMutation` + `onMutate` for optimistic updates
- `onSettled` to invalidate related queries
- Roll back on error via `queryClient.setQueryData`

## Axios Setup

- Base URL from env var
- `withCredentials: true` for cookie-based auth, or Authorization header injection
- Response interceptor: normalize errors, handle 401 (redirect to login)
- Request interceptor: attach auth token, content-type

## Caching Strategy

- `staleTime`: how long data is considered fresh (avoid re-fetch)
- `gcTime`: how long inactive data stays in cache (was `cacheTime`)
- `refetchOnWindowFocus`: enable for data that changes frequently
- `keepPreviousData`: for paginated lists (smooth transitions)

## Error Handling

- Show toast notifications via `sonner` for mutation errors
- Use ErrorBoundary with `useSuspenseQuery` for render errors
- Retry logic: configure `retry` and `retryDelay` globally or per-query
- Network status detection via `navigator.onLine` or Query's `onlineManager`

## Infinite Queries

- `useInfiniteQuery` for paginated/cursor-based lists
- `getNextPageParam` extracts cursor from response
- Flatten pages with `data.pages.flatMap(p => p.items)`

## Optimistic Updates

```ts
onMutate: async (newItem) => {
  await queryClient.cancelQueries({ queryKey: keys.all() })
  const previous = queryClient.getQueryData(keys.all())
  queryClient.setQueryData(keys.all(), (old) => [...old, newItem])
  return { previous }
}
onError: (err, newItem, context) => {
  queryClient.setQueryData(keys.all(), context.previous)
}
onSettled: () => {
  queryClient.invalidateQueries({ queryKey: keys.all() })
}
```
