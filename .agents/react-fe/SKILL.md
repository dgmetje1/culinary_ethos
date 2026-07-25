---
name: fe-orchestrator
description: Use when working on a React frontend built with Vite. This is the orchestrator covering the full FE ecosystem. Use sub-skills for deeper dives: best-practices (component architecture, hooks, state, performance), component-testing (Vitest, Testing Library), api-handling (data fetching, mutations, React Query).
---

# FE Orchestrator

## Stack

- **Framework**: React with Vite
- **Routing**: TanStack Router (file-based routing)
- **Data fetching**: TanStack React Query
- **Forms**: TanStack React Form + Zod validation
- **UI**: MUI + Tailwind CSS + shadcn/ui (Radix primitives) + lucide-react icons
- **Styling**: `class-variance-authority` + `clsx` + `tailwind-merge`
- **Auth**: Auth0 React SDK (`@auth0/auth0-react`)
- **i18n**: i18next + `react-i18next` + browser language detector
- **Tables**: TanStack React Table
- **Date**: `date-fns`
- **Utilities**: `radash`, `sonner` (toasts)
- **Rich text**: `react-quill-new`

## Ecosystem Overview

| Concern | Tool |
|---|---|
| Routing | TanStack Router (file-based) |
| Data fetching | TanStack React Query |
| Forms | TanStack React Form + Zod |
| UI components | MUI + shadcn/ui (Radix) |
| Styling | Tailwind CSS + CVA + clsx |
| Auth | Auth0 React SDK |
| i18n | i18next |
| Tables | TanStack React Table |
| Testing | Vitest + Testing Library |
| Build | Vite + TypeScript |

## Conventions

- Path alias `@/` → `src/`
- TanStack Router file-based routing
- i18n translation files co-located or in `src/i18n/`
- shadcn/ui install: `pnpm dlx shadcn@latest add {componentName}`
- Radix primitives used: Dialog, DropdownMenu, Popover, Select, Toast, Tooltip, Checkbox, Separator
