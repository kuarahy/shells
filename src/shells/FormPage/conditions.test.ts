import { describe, expect, it } from "vitest";
import { evaluateCondition } from "./conditions";
import type { Condition } from "../../types";

function cond(field: string, operator: Condition["operator"], value: unknown): Condition {
  return { field, operator, value };
}

describe("evaluateCondition", () => {
  const values = { name: "design review", count: 5, status: "Pending" };

  it("evaluates == and !=", () => {
    expect(evaluateCondition(cond("status", "==", "Pending"), values)).toBe(true);
    expect(evaluateCondition(cond("status", "==", "Approved"), values)).toBe(false);
    expect(evaluateCondition(cond("status", "!=", "Approved"), values)).toBe(true);
    expect(evaluateCondition(cond("status", "!=", "Pending"), values)).toBe(false);
  });

  it("evaluates numeric comparisons", () => {
    expect(evaluateCondition(cond("count", ">", 4), values)).toBe(true);
    expect(evaluateCondition(cond("count", ">", 5), values)).toBe(false);
    expect(evaluateCondition(cond("count", "<", 6), values)).toBe(true);
    expect(evaluateCondition(cond("count", ">=", 5), values)).toBe(true);
    expect(evaluateCondition(cond("count", "<=", 4), values)).toBe(false);
  });

  it("returns false for non-numeric operands", () => {
    expect(evaluateCondition(cond("name", ">", 4), values)).toBe(false);
    expect(evaluateCondition(cond("count", ">", "abc"), values)).toBe(false);
  });

  it("evaluates string operators", () => {
    expect(evaluateCondition(cond("name", "contains", "review"), values)).toBe(true);
    expect(evaluateCondition(cond("name", "contains", "audit"), values)).toBe(false);
    expect(evaluateCondition(cond("name", "startsWith", "design"), values)).toBe(true);
    expect(evaluateCondition(cond("name", "endsWith", "review"), values)).toBe(true);
    expect(evaluateCondition(cond("name", "endsWith", "design"), values)).toBe(false);
  });

  it("treats missing values as empty string for string operators", () => {
    expect(evaluateCondition(cond("missing", "contains", "x"), values)).toBe(false);
    expect(evaluateCondition(cond("missing", "==", undefined), values)).toBe(true);
  });
});
