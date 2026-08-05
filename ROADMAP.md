# Roadmap

## 1. `FormPage`

Implement the form shell.

- [ ] Condition evaluator for `visibleIf` (`==`, `!=`, `>`, `contains`, etc.)
- [ ] Field renderer per `FieldType` (`text`, `textarea`, `number`, `dropdown`, `checkbox`, `date`, `email`)
- [ ] Validation — required fields, min/max, email format
- [ ] Submit → POST/PUT/PATCH to `endpoint` via the provider `fetcher`
- [ ] Optional `onSuccess` / `onCancel` callbacks in config

## 2. Demo App

Add `apps/demo` — a Vite + React workspace app for developing shells without a real backend.

- [ ] Scaffold `apps/demo` with Vite + React + TypeScript
- [ ] Add [MSW](https://mswjs.io/) for API mocking
- [ ] Wire `ShellsProvider` with a minimal component set (native HTML or headless)
- [ ] Add demo pages for each shell (`SearchPage`, `FormPage`, `DetailPage`)
- [ ] Use demo as the primary development and visual test environment

## 3. `SearchPage` Polish

- [ ] Pagination — pass `?page=N&pageSize=N` from `pageSize` config to the fetch; propagate `total` back to `Table` for pagination UI
- [ ] Error handling — add `onError` to `ShellsProvider` so consumers can handle 401s, network failures, etc.
- [ ] Empty state — render a slot or message when `data` is empty

## 4. `DetailPage`

Implement the detail shell.

- [ ] Fetch a single record from `endpoint`
- [ ] Render `fields` as label/value pairs
- [ ] Support `format` function on `DetailField` for value transforms
- [ ] Wire `actions` as buttons (reuses `ActionDef`)

## 5. CI Pipeline

- [ ] GitHub Actions — typecheck + build on every PR
- [ ] Auto-publish to npm on version tag push (`v*.*.*`) using an automation token

## 6. Consumer Integration Test

Wire `shells` into a real app using an existing component library as the `ComponentMap`.

- [ ] Confirm `ShellTableProps` contract works end-to-end with a real Table component
- [ ] Validate `fetcher` injection with real auth headers
- [ ] Note any contract gaps and adjust `ComponentMap` types accordingly
