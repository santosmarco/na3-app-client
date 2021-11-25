export function isArray<T>(x: unknown): x is Array<T> {
  return Array.isArray(x);
}
