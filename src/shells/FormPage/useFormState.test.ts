// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useFormState } from "./useFormState";
import type { FieldDef } from "../../types";

const fields: FieldDef[] = [
  { id: "name", type: "text", label: "Name", required: true },
  { id: "tos", type: "checkbox", label: "Terms" },
  {
    id: "reason",
    type: "text",
    label: "Reason",
    visibleIf: { field: "name", operator: "==", value: "other" },
  },
];

describe("useFormState", () => {
  it("seeds initial values from defaults, checkbox defaults to false", () => {
    const { result } = renderHook(() => useFormState(fields));
    expect(result.current.values).toEqual({ name: "", tos: false, reason: "" });
  });

  it("honours an explicit default value", () => {
    const withDefault: FieldDef[] = [
      { id: "team", type: "text", label: "Team", default: "Design" },
    ];
    const { result } = renderHook(() => useFormState(withDefault));
    expect(result.current.values.team).toBe("Design");
  });

  it("recomputes visibleFields when a visibleIf dependency changes", () => {
    const { result } = renderHook(() => useFormState(fields));
    expect(result.current.visibleFields.map((f) => f.id)).toEqual(["name", "tos"]);

    act(() => result.current.setValue("name", "other"));
    expect(result.current.visibleFields.map((f) => f.id)).toEqual([
      "name",
      "tos",
      "reason",
    ]);
  });

  it("validate() reports errors for visible required fields", () => {
    const { result } = renderHook(() => useFormState(fields));
    let valid = true;
    act(() => {
      valid = result.current.validate();
    });
    expect(valid).toBe(false);
    expect(result.current.errors.name).toBe("Name is required");
  });

  it("validate() skips hidden fields and passes when visible fields are valid", () => {
    const { result } = renderHook(() => useFormState(fields));
    act(() => result.current.setValue("name", "Ada"));
    let valid = false;
    act(() => {
      valid = result.current.validate();
    });
    expect(valid).toBe(true);
    expect(result.current.errors).toEqual({});
  });

  it("setValue clears the error for that field", () => {
    const { result } = renderHook(() => useFormState(fields));
    act(() => {
      result.current.validate();
    });
    expect(result.current.errors.name).toBeDefined();
    act(() => result.current.setValue("name", "Ada"));
    expect(result.current.errors.name).toBeUndefined();
  });
});
