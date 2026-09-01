import { useCallback, useMemo, useState } from "react";
import type { FieldDef } from "../../types";
import { evaluateCondition } from "./conditions";
import { validateForm } from "./validation";

function initialValues(fields: FieldDef[]): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const field of fields) {
    values[field.id] = field.default ?? (field.type === "checkbox" ? false : "");
  }
  return values;
}

export interface FormState {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  submitting: boolean;
  visibleFields: FieldDef[];
  setValue: (id: string, value: unknown) => void;
  setSubmitting: (submitting: boolean) => void;
  /** Validates visible fields and updates `errors`. Returns true when valid. */
  validate: () => boolean;
}

/** Owns form values, validation errors, and conditional visibility. */
export function useFormState(fields: FieldDef[]): FormState {
  const [values, setValues] = useState<Record<string, unknown>>(() =>
    initialValues(fields)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const visibleFields = useMemo(
    () =>
      fields.filter(
        (field) => !field.visibleIf || evaluateCondition(field.visibleIf, values)
      ),
    [fields, values]
  );

  const setValue = useCallback((id: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const validate = useCallback((): boolean => {
    const next = validateForm(visibleFields, values);
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [visibleFields, values]);

  return {
    values,
    errors,
    submitting,
    visibleFields,
    setValue,
    setSubmitting,
    validate,
  };
}
