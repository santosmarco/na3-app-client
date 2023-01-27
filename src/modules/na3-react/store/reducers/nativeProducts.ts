import type { Reducer } from "redux";

import { translateFirebaseError } from "../../../firebase-errors-pt-br";
import type { ProductsAction, ProductsState } from "../../types";
import { sortStateData } from "../../utils";

const initialState: ProductsState = {
  data: null,
  error: null,
  loading: true,
};

export const nativeProductsReducer: Reducer<ProductsState, ProductsAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "PRODUCTS_SET_DATA":
      return { ...state, data: sortStateData(action.data, "name") };
    case "PRODUCTS_SET_LOADING":
      return { ...state, loading: action.loading };
    case "PRODUCTS_SET_ERROR":
      return {
        ...state,
        error: action.error ? translateFirebaseError(action.error) : null,
      };

    default:
      return state;
  }
};
