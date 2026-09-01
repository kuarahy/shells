import React from "react";
import type { ComponentMap, FieldDef } from "../../types";

interface RenderProps {
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
}

function missing(fieldType: string, componentName: string): never {
  throw new Error(
    `FormPage: field type "${fieldType}" requires \`${componentName}\` in the ShellsProvider ComponentMap`
  );
}

const renderTextarea: ControlRenderer = ({ field, value, onChange }, { Textarea }) => {
  if (!Textarea) return missing(field.type, "Textarea");
  const props = {
    value: String(value ?? ""),
    onChange,
    placeholder: field.placeholder,
    rows: field.rows,
    id: field.id,
  };
  return <Textarea {...props} />;
};

const renderDropdown: ControlRenderer = ({ field, value, onChange }, { Dropdown }) => {
  if (!Dropdown) return missing(field.type, "Dropdown");
  const options = (field.options ?? []).map((o) => ({ label: o, value: o }));
  return (
    <Dropdown
      value={value}
      options={options}
      onChange={onChange}
      placeholder={field.placeholder}
      id={field.id}
    />
  );
};

const renderCheckbox: ControlRenderer = ({ field, value, onChange }, { Checkbox }) => {
  if (!Checkbox) return missing(field.type, "Checkbox");
  return (
    <Checkbox checked={Boolean(value)} onChange={onChange} label={field.label} />
  );
};

const renderDate: ControlRenderer = ({ field, value, onChange }, { DatePicker }) => {
  if (!DatePicker) return missing(field.type, "DatePicker");
  const props = {
    value: String(value ?? ""),
    onChange,
    placeholder: field.placeholder,
    id: field.id,
  };
  return <DatePicker {...props} />;
};

const renderInput: ControlRenderer = ({ field, value, onChange }, { Input }) => {
  if (!Input) return missing(field.type, "Input");
  const props = {
    value: String(value ?? ""),
    onChange,
    placeholder: field.placeholder,
    type: field.type,
    id: field.id,
  };
  return <Input {...props} />;
};

type ControlRenderer = (
  props: RenderProps,
  components: ComponentMap
) => React.ReactNode;

/** Strategy map — one renderer per FieldType. */
export const controlRenderers: Record<string, ControlRenderer> = {
  textarea: renderTextarea,
  dropdown: renderDropdown,
  checkbox: renderCheckbox,
  date: renderDate,
  number: renderInput,
  email: renderInput,
  text: renderInput,
};

/** Renders the control for a field using the strategy map (defaults to text input). */
export function renderControl(
  components: ComponentMap,
  field: FieldDef,
  value: unknown,
  onChange: (value: unknown) => void
): React.ReactNode {
  const render = controlRenderers[field.type] ?? renderInput;
  return render({ field, value, onChange }, components);
}
