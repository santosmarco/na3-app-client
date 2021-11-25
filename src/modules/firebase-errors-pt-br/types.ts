type LiteralUnion<LiteralType> = LiteralType | (string & { _?: never });

type FirestoreErrorCode =
  | "aborted"
  | "already-exists"
  | "cancelled"
  | "data-loss"
  | "deadline-exceeded"
  | "failed-precondition"
  | "internal"
  | "invalid-argument"
  | "not-found"
  | "out-of-range"
  | "permission-denied"
  | "resource-exhausted"
  | "unauthenticated"
  | "unavailable"
  | "unimplemented"
  | "unknown";

export type FirebaseErrorCode = LiteralUnion<FirestoreErrorCode>;

export type FirebaseErrorMessage = `${string}.`;

export type FirebaseError = {
  code: LiteralUnion<FirestoreErrorCode>;
  message: string;
  name: string;
  stack?: string;
};
