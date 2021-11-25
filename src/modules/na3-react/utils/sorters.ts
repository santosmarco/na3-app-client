import type { ConditionalPick } from "type-fest";

export function sortStateData<
  T extends Record<string, unknown>,
  U extends null | undefined = null | undefined
>(
  data: Array<T> | U,
  key: Extract<keyof ConditionalPick<T, number | string>, string>,
  options?: { reverse?: boolean }
): Array<T> | U {
  if (!data) return data;

  const dataCopy = [...data];

  const sorted = dataCopy.sort((a, b) => {
    const valA =
      typeof a[key] === "string"
        ? (a[key] as string).trim().toLowerCase()
        : (a[key] as number);
    const valB =
      typeof b[key] === "string"
        ? (b[key] as string).trim().toLowerCase()
        : (b[key] as number);

    if (typeof valA === "string" && typeof valB === "string") {
      return valA.localeCompare(valB);
    } else if (typeof valA === "number" && typeof valB === "number") {
      return +valA - +valB;
    }

    return 0;
  });

  return options?.reverse ? sorted.reverse() : sorted;
}
