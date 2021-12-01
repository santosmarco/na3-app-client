import type firebase from "firebase";

import type { FirebaseError } from "../../../firebase-errors-pt-br";

export type FirebaseNullOperationResult =
  | { error: FirebaseError }
  | { error: null };

export type FirebaseDocOperationResult<T> =
  | { data: firebase.firestore.DocumentReference<T>; error: null }
  | { data: null; error: FirebaseError };

export type FirebaseOperationResult<T> =
  | { data: null; error: FirebaseError }
  | { data: T; error: null };
