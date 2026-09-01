import type { Condition } from "../../types";

function compareNumbers(
  actual: unknown,
  expected: unknown,
  compare: (a: number, b: number) => boolean
): boolean {
  const a = Number(actual);
  const b = Number(expected);
  if (Number.isNaN(a) || Number.isNaN(b)) return false;
  return compare(a, b);
}

function compareStrings(
  actual: unknown,
  expected: unknown,
  compare: (a: string, b: string) => boolean
): boolean {
  return compare(String(actual ?? ""), String(expected ?? ""));
}

/** Pure evaluator for `FieldDef.visibleIf` conditions. */
export function evaluateCondition(
  condition: Condition,
  values: Record<string, unknown>
): boolean {
  const actual = values[condition.field];
  const expected = condition.value;
  switch (condition.operator) {
    case "==":
      return actual === expected;
    case "!=":
      return actual !== expected;
    case ">":
      return compareNumbers(actual, expected, (a, b) => a > b);
    case "<":
      return compareNumbers(actual, expected, (a, b) => a < b);
    case ">=":
      return compareNumbers(actual, expected, (a, b) => a >= b);
    case "<=":
      return compareNumbers(actual, expected, (a, b) => a <= b);
    case "contains":
      return compareStrings(actual, expected, (a, b) => a.includes(b));
    case "startsWith":
      return compareStrings(actual, expected, (a, b) => a.startsWith(b));
    case "endsWith":
      return compareStrings(actual, expected, (a, b) => a.endsWith(b));
  }
}
