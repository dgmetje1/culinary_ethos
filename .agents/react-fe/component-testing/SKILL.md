---
name: fe-component-testing
description: Use when writing or debugging frontend tests. Covers Vitest, React Testing Library, component tests, hook tests, integration tests, and mocking strategies.
---

# FE Component Testing

## Tooling

- **Test runner**: Vitest
- **Rendering**: React Testing Library (`@testing-library/react`)
- **DOM matchers**: `@testing-library/jest-dom` (extended matchers)
- **User events**: `@testing-library/user-event` (preferred over `fireEvent`)
- **Mocking**: `vi.mock`, `vi.spyOn`, `msw` (MSW for API mocking)

## Testing Philosophy

- Test behavior, not implementation
- Avoid testing internal state or private methods
- Prefer integration tests over unit tests for components
- Use `screen.getByRole` / `findByRole` over `getByTestId` (accessible queries first)
- Test user flows, not line-by-line logic

## Component Tests

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

describe('MyComponent', () => {
  it('renders and responds to click', async () => {
    const onClick = vi.fn()
    render(<MyComponent onClick={onClick}>Click me</MyComponent>)

    await userEvent.click(screen.getByRole('button', { name: /click me/i }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
```

### What to test

- Does it render the expected content?
- Do user interactions trigger correct callbacks?
- Does it show loading/error/empty states?
- Does it handle edge cases (long text, missing data, overflow)?
- Accessibility: are roles, labels, and ARIA attributes correct?

### What NOT to test

- Internal implementation details (state variables, CSS classes)
- Third-party library internals
- Exact markup structure (use semantic queries)

## Hook Tests

- Use `renderHook` from `@testing-library/react`
- Test state transitions and side effects
- Use `waitFor` / `act` for async updates

```tsx
import { renderHook, act } from '@testing-library/react'

it('increments counter', () => {
  const { result } = renderHook(() => useCounter(0))
  act(() => result.current.increment())
  expect(result.current.count).toBe(1)
})
```

## Mocking Strategies

- **API calls**: Use `msw` (Mock Service Worker) rather than mocking `fetch`/`axios` directly
- **Module mocks**: `vi.mock('../path/to/module')` at top level
- **Partial mocks**: `vi.importActual` + override specific exports
- **Timers**: `vi.useFakeTimers()` for time-dependent code

## Context / Provider Wrappers

```tsx
function renderWithProviders(ui: React.ReactElement, options = {}) {
  const { wrapper: CustomWrapper, ...renderOptions } = options
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <Auth0Provider>{children}</Auth0Provider>
      </QueryClientProvider>
    )
  }
  return render(ui, { wrapper: CustomWrapper ?? Wrapper, ...renderOptions })
}
```

## Setup / Teardown

- Use `beforeEach` / `afterEach` to reset mocks and query caches
- Wrap tests in `describe` blocks organized by feature or component
- Co-locate test files alongside components (`Component.test.tsx`)
