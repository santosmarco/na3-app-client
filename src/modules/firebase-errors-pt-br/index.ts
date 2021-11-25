import { dictionary } from "./dictionary";
import type { FirebaseError } from "./types";
import { defaultFallbackMessage } from "./utils";

export function translateFirebaseErrorMessage(
  code: string,
  fallbackMessage?: string
): string {
  return dictionary[code] || fallbackMessage || defaultFallbackMessage;
}

export function translateFirebaseError(error: FirebaseError): FirebaseError {
  return {
    ...error,
    message: dictionary[error.code] || error.message,
  };
}

export default translateFirebaseError;

export type { FirebaseError };
