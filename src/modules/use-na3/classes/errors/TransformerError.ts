import { FirebaseError } from "@firebase/util";
import type { LiteralUnion } from "type-fest";

import type {
  TransformerError as ITransformerError,
  TransformerErrorCode,
} from "../../types";
import { TransformerErrorDictionary } from "../../types";

export class TransformerError extends Error implements ITransformerError {
  readonly name: "TransformerError";
  readonly code: LiteralUnion<TransformerErrorCode, string>;

  constructor(code: TransformerErrorCode);
  constructor(code: string, message: string);
  constructor(
    code: LiteralUnion<TransformerErrorCode, string>,
    message?: string
  ) {
    if (TransformerError.isTransformerErrorCode(code)) {
      super(TransformerErrorDictionary[code]);
    } else {
      super(message);
    }

    this.name = "TransformerError";
    this.code = code;
  }

  static handleError(error: unknown): TransformerError {
    if (error instanceof TransformerError) {
      return error;
    }
    if (error instanceof FirebaseError) {
      return new TransformerError(error.code, error.message);
    }

    return new TransformerError("unknown");
  }

  static isTransformerErrorCode(test: unknown): test is TransformerErrorCode {
    return typeof test === "string" && test in TransformerErrorDictionary;
  }
}
