import type React from "react";

// ---------------------------------------------------------------------------
// Primitives shared across shells
// ---------------------------------------------------------------------------

export interface ColumnDef {
  field: string;
  header: string;
  sortable?: boolean;
  badge?: boolean;
}

export type ActionVariant = "primary" | "secondary" | "success" | "danger";

export interface ActionDef {
  label: string;
  /** Supports `:id` token — replaced with `row.id` at runtime */
  endpoint: string;
  variant?: ActionVariant;
  confirmMessage?: string;
}

export type FilterType = "text" | "dropdown" | "date";

export interface FilterDef {
  field: string;
  type: FilterType;
  options?: string[];
  placeholder?: string;
}

// ---------------------------------------------------------------------------
// Minimal component contracts (what shells expects from injected primitives)
// ---------------------------------------------------------------------------

export interface ShellTableProps {
  data: Record<string, unknown>[];
  columns: ColumnDef[];
  actions?: ActionDef[];
  onRowAction?: (actionLabel: string, row: Record<string, unknown>) => void;
  loading?: boolean;
}

export interface ShellButtonProps {
  label: string;
  onClick: () => void;
  variant?: ActionVariant;
  disabled?: boolean;
  /** Defaults to "button". Shells pass "submit" only when the button is the form's native submit control. */
  type?: "button" | "submit";
}

export interface ShellDropdownProps {
  value: unknown;
  options: Array<{ label: string; value: unknown }>;
  onChange: (value: unknown) => void;
  placeholder?: string;
}

export interface ShellInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

export interface ShellTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export interface ShellCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

/** Value is an ISO date string (`yyyy-MM-dd`) or empty. */
export interface ShellDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface ComponentMap {
  Table: React.ComponentType<ShellTableProps>;
  Button?: React.ComponentType<ShellButtonProps>;
  Dropdown?: React.ComponentType<ShellDropdownProps>;
  Input?: React.ComponentType<ShellInputProps>;
  Textarea?: React.ComponentType<ShellTextareaProps>;
  Checkbox?: React.ComponentType<ShellCheckboxProps>;
  DatePicker?: React.ComponentType<ShellDatePickerProps>;
}

/** A fetch-compatible function. Inject at <ShellsProvider> to add auth headers, base URLs, etc. */
export type Fetcher = (url: string, options?: RequestInit) => Promise<unknown>;

// ---------------------------------------------------------------------------
// Shell configs
// ---------------------------------------------------------------------------

export interface SearchPageConfig {
  title: string;
  endpoint: string;
  columns: ColumnDef[];
  actions?: ActionDef[];
  filters?: FilterDef[];
  pageSize?: number;
}

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "dropdown"
  | "checkbox"
  | "date"
  | "email";

export type ConditionOperator =
  | "=="
  | "!="
  | ">"
  | "<"
  | ">="
  | "<="
  | "contains"
  | "startsWith"
  | "endsWith";

export interface Condition {
  field: string;
  operator: ConditionOperator;
  value: unknown;
}

export interface FieldDef {
  id: string;
  type: FieldType;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  default?: unknown;
  min?: number;
  max?: number;
  rows?: number;
  visibleIf?: Condition;
}

export interface FormPageConfig {
  title: string;
  description?: string;
  endpoint: string;
  method?: "POST" | "PUT" | "PATCH";
  fields: FieldDef[];
  submitLabel?: string;
  cancelLabel?: string;
  /** Called with the parsed response body after a successful submit. */
  onSuccess?: (response: unknown) => void;
  /** Called when the user cancels. If omitted, no cancel button is rendered. */
  onCancel?: () => void;
  /** Called when the submit request fails. Defaults to logging to the console. */
  onError?: (error: unknown) => void;
}

export interface DetailField {
  label: string;
  field: string;
  format?: (value: unknown) => string;
}

export interface DetailPageConfig {
  title: string;
  endpoint: string;
  fields: DetailField[];
  actions?: ActionDef[];
}
