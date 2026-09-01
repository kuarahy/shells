import React, { useCallback } from "react";
import type { FormPageConfig } from "../../types";
import { useShells } from "../../context/ShellsContext";
import { FormField } from "./FormField";
import { useFormState } from "./useFormState";

export function FormPage({
  title,
  description,
  endpoint,
  method = "POST",
  fields,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  onSuccess,
  onCancel,
}: FormPageConfig): React.ReactElement {
  const {
    components: { Button },
    fetcher,
  } = useShells();
  const form = useFormState(fields);

  const handleSubmit = useCallback(async () => {
    if (!form.validate()) return;
    form.setSubmitting(true);
    try {
      const response = await fetcher(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form.values),
      });
      onSuccess?.(response);
    } finally {
      form.setSubmitting(false);
    }
  }, [endpoint, method, fetcher, form, onSuccess]);

  if (!Button) {
    throw new Error(
      "FormPage: `Button` is required in the ShellsProvider ComponentMap"
    );
  }

  return (
    <div data-shell="form-page">
      <h1>{title}</h1>
      {description && <p data-shell="description">{description}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
      >
        {form.visibleFields.map((field) => (
          <FormField
            key={field.id}
            field={field}
            value={form.values[field.id]}
            error={form.errors[field.id]}
            onChange={(v) => form.setValue(field.id, v)}
          />
        ))}

        <div data-shell="form-actions">
          <Button
            label={submitLabel}
            onClick={handleSubmit}
            variant="primary"
            disabled={form.submitting}
          />
          {onCancel && (
            <Button
              label={cancelLabel}
              onClick={onCancel}
              variant="secondary"
              disabled={form.submitting}
            />
          )}
        </div>
      </form>
    </div>
  );
}
