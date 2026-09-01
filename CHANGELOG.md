# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-09-01

### Added

- `FormPage` shell — config-driven dynamic forms via the provider pattern:
  - Field renderer per `FieldType` (`text`, `textarea`, `number`, `dropdown`, `checkbox`, `date`, `email`), dispatched through a strategy map of `ComponentMap` primitives.
  - Conditional visibility via `FieldDef.visibleIf` — operators `==`, `!=`, `>`, `<`, `>=`, `<=`, `contains`, `startsWith`, `endsWith`. Unsupported operators throw at render time instead of silently hiding fields.
  - Validation — `required` (including required checkboxes), `min`/`max` for numbers, email format.
  - Submit to `endpoint` via the provider `fetcher` (`POST`/`PUT`/`PATCH`); only visible fields are included in the payload.
  - Config callbacks: `onSuccess(response)`, `onError(error)`, `onCancel()`.
- New `ComponentMap` primitives: `Textarea`, `Checkbox`, `DatePicker`.
- New prop contract fields: `id` on form control props (label/`htmlFor` association), `type` on `ShellButtonProps`.
- Vitest suite covering the condition evaluator, validators, `useFormState`, and `FormPage` submit wiring.

## [0.1.0] - 2026-08-31

### Added

- `SearchPage` shell — data grid with filters, sortable columns, and row actions.
- `ShellsProvider` with injectable `components` (`ComponentMap`) and `fetcher`.
- Initial type surface: `SearchPageConfig`, `FormPageConfig`, `DetailPageConfig` and component contracts.

[0.2.0]: https://github.com/kuarahy/shells/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/kuarahy/shells/releases/tag/v0.1.0
