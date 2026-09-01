import { describe, expect, it } from "vitest";
import { validateField, validateForm } from "./validation";
import type { FieldDef } from "../../types";

function field(partial: Partial<FieldDef> & Pick<FieldDef, "id" | "type" | "label">): FieldDef {
  return partial;
}

describe("validateField", () => {
  it("requires a value when required", () => {
    const f = field({ id: "name", type: "text", label: "Name", required: true });
    expect(validateField(f, "")).toBe("Name is required");
    expect(validateField(f, undefined)).toBe("Name is required");
    expect(validateField(f, "Ada")).toBeNull();
  });

  it("allows empty optional fields", () => {
    const f = field({ id: "nick", type: "text", label: "Nickname" });
    expect(validateField(f, "")).toBeNull();
  });

  it("validates email format", () => {
    const f = field({ id: "email", type: "email", label: "Email" });
    expect(validateField(f, "not-an-email")).toBe(
      "Email must be a valid email address"
    );
    expect(validateField(f, "ada@example.com")).toBeNull();
  });

  it("validates number type and min/max bounds", () => {
    const f = field({ id: "age", type: "number", label: "Age", min: 1, max: 10 });
    expect(validateField(f, "abc")).toBe("Age must be a number");
    expect(validateField(f, 0)).toBe("Age must be at least 1");
    expect(validateField(f, 11)).toBe("Age must be at most 10");
    expect(validateField(f, 5)).toBeNull();
  });

  it("enforces required checkboxes must be checked", () => {
    const f = field({ id: "tos", type: "checkbox", label: "Terms", required: true });
    expect(validateField(f, false)).toBe("Terms is required");
    expect(validateField(f, true)).toBeNull();
  });

  it("allows unchecked optional checkboxes", () => {
    const f = field({ id: "tos", type: "checkbox", label: "Terms" });
    expect(validateField(f, false)).toBeNull();
  });
});

describe("validateForm", () => {
  it("collects errors keyed by field id", () => {
    const fields = [
      field({ id: "name", type: "text", label: "Name", required: true }),
      field({ id: "email", type: "email", label: "Email" }),
    ];
    const errors = validateForm(fields, { name: "", email: "bad" });
    expect(errors).toEqual({
      name: "Name is required",
      email: "Email must be a valid email address",
    });
  });

  it("returns an empty map when all fields are valid", () => {
    const fields = [field({ id: "name", type: "text", label: "Name", required: true })];
    expect(validateForm(fields, { name: "Ada" })).toEqual({});
  });
});
