import type { FirebaseError } from "@modules/firebase-errors-pt-br";
import type { DocumentReference } from "firebase/firestore";

export type FirebaseNullOperationResult =
  | { error: FirebaseError }
  | { error: null };

export type FirebaseDocOperationResult<T> =
  | { data: DocumentReference<T>; error: null }
  | { data: null; error: FirebaseError };

export type FirebaseOperationResult<T> =
  | { data: null; error: FirebaseError }
  | { data: T; error: null };
