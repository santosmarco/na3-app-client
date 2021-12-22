export function isArray<T>(test: unknown): test is T[] {
  return Array.isArray(test);
}
