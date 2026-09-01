<p align="center">
  <img src="assets/logo.png" alt="Shells" width="120" />
</p>

<h1 align="center">shells</h1>

<p align="center">
  Config-driven page shells for React.<br/>
  Define <em>what</em> — shells render <em>how</em>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@kuarahy/shells"><img src="https://img.shields.io/npm/v/@kuarahy/shells" alt="npm" /></a>
  <img src="https://img.shields.io/badge/react-%3E%3D18-blue" alt="React 18+" />
  <img src="https://img.shields.io/badge/typescript-5-blue" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT" />
</p>

---

## The Idea

Every data-grid page has the same anatomy: a title, a table with columns, row actions, and filters. Every form page has fields, validation, and a submit button. You should not write that from scratch each time.

**Shells** turns a typed config object into a full page. One component. Zero repeated layout code.

```tsx
// design-review-page.config.ts  <- this is all a dev touches
export const config: SearchPageConfig = {
  title: "Design Review",
  endpoint: "/api/design-reviews",
  columns: [
    { field: "projectName", header: "Project", sortable: true },
    { field: "status",      header: "Status",  badge: true    },
    { field: "submittedBy", header: "Author"                  },
  ],
  actions: [
    { label: "Approve", endpoint: "/api/design-reviews/:id/approve", variant: "success" },
    { label: "Reject",  endpoint: "/api/design-reviews/:id/reject",  variant: "danger"  },
  ],
  filters: [
    { field: "status", type: "dropdown", options: ["Pending", "Approved", "Rejected"] },
    { field: "team",   type: "dropdown", options: ["Design", "Engineering", "QA"]     },
  ],
};

// page.tsx  <- wired once per app, then never touched again
import { SearchPage } from "@kuarahy/shells";
import { config } from "./design-review-page.config";

export default () => <SearchPage {...config} />;
```

---

## Provider Pattern

Shells are **component-library agnostic**. Wire your UI primitives once at the app root:

```tsx
import { ShellsProvider } from "@kuarahy/shells";
import { MyTable, MyButton, MyDropdown } from "./my-ui-library";

<ShellsProvider
  components={{
    Table:    MyTable,
    Button:   MyButton,
    Dropdown: MyDropdown,
  }}
>
  <App />
</ShellsProvider>
```

Every shell will use those components automatically.

---

## Shells

| Shell | Description |
|---|---|
| `SearchPage` | Data grid with filters, sortable columns, and row actions |
| `FormPage` | Dynamic form with typed fields, conditional visibility, and validation |
| `DetailPage` | Read-only record view with label/value pairs and action buttons |

---

## FormPage

`FormPage` turns a `FormPageConfig` into a validated, conditionally-rendered form. It renders each field through the primitives wired into `ShellsProvider` — `Input`, `Textarea`, `Dropdown`, `Checkbox`, `DatePicker` — so it picks up your component library automatically.

```tsx
import { FormPage, type FormPageConfig } from "@kuarahy/shells";

const config: FormPageConfig = {
  title: "New Design Review",
  endpoint: "/api/design-reviews",
  method: "POST",
  fields: [
    { id: "title",    type: "text",     label: "Title",    required: true },
    { id: "team",     type: "dropdown", label: "Team",      options: ["Design", "Engineering", "QA"] },
    { id: "priority", type: "number",   label: "Priority",  min: 1, max: 5 },
    { id: "due",      type: "date",     label: "Due date" },
    { id: "other",    type: "checkbox", label: "Other team involved" },
    {
      id: "otherDetail",
      type: "textarea",
      label: "Which team?",
      visibleIf: { field: "other", operator: "==", value: true },
    },
  ],
  onSuccess: () => navigate("/reviews"),
  onError:   (err) => toast.error(String(err)),
  onCancel:  () => navigate(-1),
};

export default () => <FormPage {...config} />;
```

**Behavior:**

- **Visibility** — `visibleIf` evaluates against live form values; hidden fields are excluded from the submit payload.
- **Validation** — runs on submit: `required` (checkboxes must be checked), `min`/`max` on numbers, email format. Errors render under each field and clear as the user types.
- **Submit** — sends visible fields as JSON to `endpoint` with `method` (default `POST`) via the provider `fetcher`, then calls `onSuccess(response)` or `onError(error)`.
- **Accessibility** — labels associate with controls via `field.id` (WCAG); required fields are marked `*`.

---

## Install

```bash
npm install @kuarahy/shells
```

**Peer dependencies:** `react >= 18`, `react-dom >= 18`

---

## Golden Rule

**Configuration, not code.**

A new page is a new config file. The shell handles the rest.

---

See [CHANGELOG.md](CHANGELOG.md) for release history.

*Cowabunga, dude!*
