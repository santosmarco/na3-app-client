import type { Falsy, Primitive } from "utility-types";

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function handleFilterDuplicates<T extends Primitive>(
  el: T,
  idx: number,
  arr: T[]
): boolean {
  return arr.indexOf(el) === idx;
}

export function handleFilterFalsies<T>(el: T): el is Exclude<T, Falsy> {
  return !!el;
}
