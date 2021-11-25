import type { FirebaseErrorMessage } from "./types";

export const defaultFallbackMessage: FirebaseErrorMessage =
  "Um erro desconhecido ocorreu. Por favor, entre em contato com o administrador do sistema.";

export function buildDefaultMessage(
  service: "firestore",
  code: string
): FirebaseErrorMessage {
  return `Algo deu errado. Por favor, entre em contato com o administrador do sistema e informe o seguinte código: "${service}/${code}".`;
}
