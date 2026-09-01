import React from "react";
import type { FieldDef } from "../../types";
import { useShells } from "../../context/ShellsContext";
import { renderControl } from "./controlRenderers";

interface FormFieldProps {
  field: FieldDef;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
}

/** Renders a labelled form control for a single `FieldDef`. */
export function FormField({
  field,
  value,
  error,
  onChange,
}: FormFieldProps): React.ReactElement {
  const { components } = useShells();
  return (
    <div data-shell="field" data-field={field.id} data-invalid={error ? true : undefined}>
      {field.type !== "checkbox" && (
        <label htmlFor={field.id}>
          {field.label}
          {field.required ? " *" : ""}
        </label>
      )}
      {renderControl(components, field, value, onChange)}
      {error && <p data-shell="field-error">{error}</p>}
    </div>
  );
}
