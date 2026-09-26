---
name: fe-api-handling
description: Use when working on API data fetching, mutations, caching, or the API client layer. Covers TanStack React Query patterns, native fetch setup, optimistic updates, infinite queries, and error handling.
---

# FE API Handling

## Architecture

- Native `fetch` wrapped in a thin `Api` class for auth token injection, error normalization, and query-string serialization
- TanStack React Query wrapping the `Api` layer
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

- Return parsed JSON data directly
- Handle 401/403 centrally in the `Api` class error mapper, not per-query
- Use `queryFn` context (`queryKey`, `signal`) for cancellation

### Hooks

- Create typed custom hooks wrapping `useQuery` / `useSuspenseQuery`
- Set sensible `staleTime` and `gcTime` defaults per domain
- Prefer `useSuspenseQuery` for route-level data that should block rendering

### Mutations

- `useMutation` + `onMutate` for optimistic updates
- `onSettled` to invalidate related queries
- Roll back on error via `queryClient.setQueryData`

## Fetch Setup (Api class)

- All HTTP traffic flows through a single `Api` class at `src/lib/api/api.ts`
- Base URL from `VITE_API_URL` env var
- `RequestConfig` shape: `{ withAuth?: boolean; headers?: Record<string, string>; data?: unknown; params?: Record<string, unknown> }`
    - `withAuth` (default `true`): injects `Authorization: Bearer <token>` header
    - `params`: serialized via `URLSearchParams` and appended to the URL as a query string
    - `data`: auto-stringified as JSON when `Content-Type` is `application/json`; passed through as-is for `FormData`
- `Accept-Language` header injected per request from the current i18n language
- `credentials: 'same-origin'` for cookie-based auth
- Response handling:
    - Non-2xx: map HTTP status to `ApiException` (`bad-request`, `unauthorized`, `forbidden`, `not-found`, `validation-error`, `server-error`, `network-error`)
    - 204 / empty body: resolve with `undefined`
    - Otherwise: `await response.text()` then `JSON.parse`
- Retry: up to 3 attempts with linear backoff for `missing-user-token` errors (token arrives after auth bootstrap)

## Adding New Endpoints

Use the `Api` class — never call `fetch` directly in query/mutation files:

```ts
// queries/<domain>/queries.ts
export const getThing = (id: string) => new Api().get<Thing>(`things/${id}`);

export const listThings = (filters: Filters) =>
    new Api().get<Thing[]>('things', { params: filters });

// mutations
export const createThing = (input: ThingInput) => new Api().post<Thing>('things', input);
```

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
    await queryClient.cancelQueries({ queryKey: keys.all() });
    const previous = queryClient.getQueryData(keys.all());
    queryClient.setQueryData(keys.all(), (old) => [...old, newItem]);
    return { previous };
};
onError: (err, newItem, context) => {
    queryClient.setQueryData(keys.all(), context.previous);
};
onSettled: () => {
    queryClient.invalidateQueries({ queryKey: keys.all() });
};
```
