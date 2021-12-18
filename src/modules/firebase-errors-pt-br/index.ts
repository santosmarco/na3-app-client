import { dictionary } from "./dictionary";
import type { FirebaseError } from "./types";
import { defaultFallbackMessage } from "./utils";

export function translateFirebaseErrorMessage(
  code: string,
  fallbackMessage?: string
): string {
  return code in dictionary
    ? dictionary[code]
    : fallbackMessage || defaultFallbackMessage;
}

export function translateFirebaseError(error: FirebaseError): FirebaseError {
  if (process.env.NODE_ENV === "development") {
    console.error("[FIREBASE ERROR]", error);
  }

  return {
    ...error,
    message: translateFirebaseErrorMessage(error.code, error.message),
  };
}

export default translateFirebaseError;

export type { FirebaseError };
