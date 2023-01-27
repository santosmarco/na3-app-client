import type { Product } from "@schemas";

import type { FirebaseError } from "../../../firebase-errors-pt-br";

export type ProductsState = {
  data: Array<Product & { id: string }> | null;
  error: FirebaseError | null;
  loading: boolean;
};

export type ProductsSetDataAction = {
  data: ProductsState["data"];
  type: "PRODUCTS_SET_DATA";
};

export type ProductsSetLoadingAction = {
  loading: ProductsState["loading"];
  type: "PRODUCTS_SET_LOADING";
};

export type ProductsSetErrorAction = {
  error: ProductsState["error"];
  type: "PRODUCTS_SET_ERROR";
};

export type ProductsAction =
  | ProductsSetDataAction
  | ProductsSetErrorAction
  | ProductsSetLoadingAction;
