import type { FieldDef } from "../../types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || value === "";
}

function validateNumber(field: FieldDef, value: unknown): string | null {
  const n = Number(value);
  if (Number.isNaN(n)) return `${field.label} must be a number`;
  if (field.min !== undefined && n < field.min)
    return `${field.label} must be at least ${field.min}`;
  if (field.max !== undefined && n > field.max)
    return `${field.label} must be at most ${field.max}`;
  return null;
}

/**
 * Validates a single field value.
 * Returns an error message, or `null` when the value is valid.
 */
export function validateField(field: FieldDef, value: unknown): string | null {
  if (isEmpty(value)) {
    return field.required ? `${field.label} is required` : null;
  }
  switch (field.type) {
    case "email":
      return EMAIL_PATTERN.test(String(value))
        ? null
        : `${field.label} must be a valid email address`;
    case "number":
      return validateNumber(field, value);
    default:
      return null;
  }
}

/** Validates all visible fields. Returns a map of field id to error message. */
export function validateForm(
  fields: FieldDef[],
  values: Record<string, unknown>
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const error = validateField(field, values[field.id]);
    if (error) errors[field.id] = error;
  }
  return errors;
}
