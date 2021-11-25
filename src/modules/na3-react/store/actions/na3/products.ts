import type {
  Na3ProductsSetDataAction,
  Na3ProductsSetErrorAction,
  Na3ProductsSetLoadingAction,
  Na3ProductsState,
} from "../../../types";

export const setNa3ProductsData = (
  data: Na3ProductsState["data"]
): Na3ProductsSetDataAction => ({
  data,
  type: "NA3_PRODUCTS_SET_DATA",
});

export const setNa3ProductsLoading = (
  loading: Na3ProductsState["loading"]
): Na3ProductsSetLoadingAction => ({
  loading,
  type: "NA3_PRODUCTS_SET_LOADING",
});

export const setNa3ProductsError = (
  error: Na3ProductsState["error"]
): Na3ProductsSetErrorAction => ({
  error,
  type: "NA3_PRODUCTS_SET_ERROR",
});
