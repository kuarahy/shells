import React from "react";
import type { ComponentMap, FieldDef } from "../../types";
import { useShells } from "../../context/ShellsContext";

interface FormFieldProps {
  field: FieldDef;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
}

function missing(fieldType: string, componentName: string): never {
  throw new Error(
    `FormPage: field type "${fieldType}" requires \`${componentName}\` in the ShellsProvider ComponentMap`
  );
}

function renderControl(
  components: ComponentMap,
  field: FieldDef,
  value: unknown,
  onChange: (value: unknown) => void
): React.ReactNode {
  const { Input, Textarea, Checkbox, DatePicker, Dropdown } = components;
  switch (field.type) {
    case "textarea": {
      if (!Textarea) return missing(field.type, "Textarea");
      const props = {
        value: String(value ?? ""),
        onChange,
        placeholder: field.placeholder,
        rows: field.rows,
      };
      return <Textarea {...props} />;
    }
    case "dropdown": {
      if (!Dropdown) return missing(field.type, "Dropdown");
      const options = (field.options ?? []).map((o) => ({ label: o, value: o }));
      return (
        <Dropdown
          value={value}
          options={options}
          onChange={onChange}
          placeholder={field.placeholder}
        />
      );
    }
    case "checkbox": {
      if (!Checkbox) return missing(field.type, "Checkbox");
      return (
        <Checkbox checked={Boolean(value)} onChange={onChange} label={field.label} />
      );
    }
    case "date": {
      if (!DatePicker) return missing(field.type, "DatePicker");
      const props = {
        value: String(value ?? ""),
        onChange,
        placeholder: field.placeholder,
      };
      return <DatePicker {...props} />;
    }
    case "number":
    case "email":
    case "text":
    default: {
      if (!Input) return missing(field.type, "Input");
      const props = {
        value: String(value ?? ""),
        onChange,
        placeholder: field.placeholder,
        type: field.type,
      };
      return <Input {...props} />;
    }
  }
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
