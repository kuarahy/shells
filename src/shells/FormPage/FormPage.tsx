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
  onError,
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
      // Submit only visible fields — hidden (visibleIf) fields keep no payload.
      const payload = Object.fromEntries(
        form.visibleFields.map((f) => [f.id, form.values[f.id]])
      );
      const response = await fetcher(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      onSuccess?.(response);
    } catch (error) {
      if (onError) onError(error);
      else console.error(error);
    } finally {
      form.setSubmitting(false);
    }
  }, [endpoint, method, fetcher, form, onSuccess, onError]);

  if (!Button) {
    throw new Error(
      "FormPage: `Button` is required in the ShellsProvider ComponentMap"
    );
  }

  return (
    <div data-shell="form-page">
      <h1>{title}</h1>
      {description && <p data-shell="description">{description}</p>}

      {/* Plain div — the Button's onClick is the single submit trigger,
          avoiding a double-submit with a native form onSubmit. */}
      <div data-shell="form">
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
      </div>
    </div>
  );
}
