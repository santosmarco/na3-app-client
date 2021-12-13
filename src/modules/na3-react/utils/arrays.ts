import type { ConditionalPick } from "type-fest";
import type { Primitive } from "utility-types";

export function removeDuplicates<T extends Primitive>(arr: T[]): T[] {
  return arr.filter((item, idx) => arr.indexOf(item) === idx);
}

export function removeNullables<T>(arr: T[]): Array<NonNullable<T>> {
  return arr.filter((item): item is NonNullable<T> => !!item);
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function sortStateData<
  T extends Record<string, unknown>,
  U extends null | undefined = null | undefined
>(
  data: T[] | U,
  key: Extract<keyof ConditionalPick<T, number | string>, string>,
  options?: { reverse?: boolean; transformToNumber?: boolean }
): T[] | U {
  if (!data) return data;

  const dataCopy = [...data];

  const sorted = dataCopy.sort((a, b) => {
    const valA =
      typeof a[key] === "string" && !options?.transformToNumber
        ? (a[key] as string).trim().toLowerCase()
        : +a[key];
    const valB =
      typeof b[key] === "string" && !options?.transformToNumber
        ? (b[key] as string).trim().toLowerCase()
        : +b[key];

    if (typeof valA === "string" && typeof valB === "string") {
      return valA.localeCompare(valB);
    } else if (typeof valA === "number" && typeof valB === "number") {
      return +valA - +valB;
    }

    return 0;
  });

  return options?.reverse ? sorted.reverse() : sorted;
}
