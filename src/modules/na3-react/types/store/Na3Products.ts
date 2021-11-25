import type { FirebaseError } from "../../../firebase-errors-pt-br";
import type { Na3ApiProduct } from "../../../na3-types";

export type Na3ProductsState = {
  data: Na3ApiProduct[] | null;
  error: FirebaseError | null;
  loading: boolean;
};

export type Na3ProductsSetDataAction = {
  data: Na3ProductsState["data"];
  type: "NA3_PRODUCTS_SET_DATA";
};

export type Na3ProductsSetLoadingAction = {
  loading: Na3ProductsState["loading"];
  type: "NA3_PRODUCTS_SET_LOADING";
};

export type Na3ProductsSetErrorAction = {
  error: Na3ProductsState["error"];
  type: "NA3_PRODUCTS_SET_ERROR";
};

export type Na3ProductsAction =
  | Na3ProductsSetDataAction
  | Na3ProductsSetErrorAction
  | Na3ProductsSetLoadingAction;
