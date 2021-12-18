export function isArray<T>(test: unknown): test is T[] {
  return Array.isArray(test);
}

export function isObject<T extends Record<PropertyKey, unknown>>(
  test: unknown
): test is T {
  return typeof test === "object" && test !== null;
}
