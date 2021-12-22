import type { FieldValue } from "firebase/firestore";
import { arrayUnion as _arrayUnion } from "firebase/firestore";

import type { MaybeArray } from "../types";
import { isArray } from "./arrays";

export function arrayUnion<T>(items: MaybeArray<T>): FieldValue {
  const itemsArr = isArray(items) ? [...items] : [items];
  return _arrayUnion(...itemsArr);
}
