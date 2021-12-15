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
