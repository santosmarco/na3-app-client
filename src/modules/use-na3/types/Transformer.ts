import type { ConditionalKeys } from "type-fest";

import type { TransformerError } from "./TransformerError";

export type TransformerData = Record<PropertyKey, unknown>;

export type TransformerSetDataOptions<T extends TransformerData> = {
  idField?: ConditionalKeys<T, string>;
};

export type TransformerRefreshOptions<T extends TransformerData> =
  TransformerSetDataOptions<T>;

export type TransformerOptions<T extends TransformerData> =
  TransformerSetDataOptions<T>;

export type TransformerResultOk<T> = { data: T; error: null };

export type TransformerResultFail = { data: null; error: TransformerError };

export type TransformerResult<T> =
  | TransformerResultFail
  | TransformerResultOk<T>;
