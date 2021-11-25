import type firebase from "firebase";

import type { FirebaseError } from "../../../firebase-errors-pt-br";

export type FirebaseNullOperationResult =
  | { error: FirebaseError }
  | { error: null };

export type FirebaseOperationResult<T> =
  | { data: firebase.firestore.DocumentReference<T>; error: null }
  | { data: null; error: FirebaseError };
