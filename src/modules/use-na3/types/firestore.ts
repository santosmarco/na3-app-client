import type { DocumentSnapshot } from "firebase/firestore";

export type ValidDocumentSnapshot<T> = Omit<
  DocumentSnapshot<T>,
  "data" | "exists"
> & {
  data: () => T;
  exists: () => true;
};
