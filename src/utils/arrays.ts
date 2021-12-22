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

export function compareArrays<T, U>(a: T[], b: U[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return JSON.stringify(a) === JSON.stringify(b);
}
