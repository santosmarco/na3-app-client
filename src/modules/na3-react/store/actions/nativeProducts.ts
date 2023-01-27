import type {
  ProductsSetDataAction,
  ProductsSetErrorAction,
  ProductsSetLoadingAction,
  ProductsState,
} from "../../types";

export const setNativeProductsData = (
  data: ProductsState["data"]
): ProductsSetDataAction => ({
  data,
  type: "PRODUCTS_SET_DATA",
});

export const setNativeProductsLoading = (
  loading: ProductsState["loading"]
): ProductsSetLoadingAction => ({
  loading,
  type: "PRODUCTS_SET_LOADING",
});

export const setNativeProductsError = (
  error: ProductsState["error"]
): ProductsSetErrorAction => ({
  error,
  type: "PRODUCTS_SET_ERROR",
});
