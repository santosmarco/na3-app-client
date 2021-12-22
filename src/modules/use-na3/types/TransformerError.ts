import type { LiteralUnion } from "type-fest";

export enum TransformerErrorDictionary {
  "general/doc-not-found" = "Documento não encontrado.",
  "service-orders/latest-deliver-ev-not-found" = "Não foi possível identificar o evento de transmissão de solução mais recente.",
  "unknown" = "Um erro desconhecido ocorreu. Por favor, tente novamente mais tarde.",
}

export type TransformerErrorCode = keyof typeof TransformerErrorDictionary;

export type TransformerError = {
  readonly code: LiteralUnion<TransformerErrorCode, string>;
  readonly name: "TransformerError";
};
