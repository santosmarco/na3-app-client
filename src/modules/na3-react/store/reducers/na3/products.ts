import type { Reducer } from "redux";

import type { Na3ProductsAction, Na3ProductsState } from "../../../types";
import { sortStateData } from "../../../utils";

const initialState: Na3ProductsState = {
  data: null,
  error: null,
  loading: true,
};

export const na3ProductsReducer: Reducer<Na3ProductsState, Na3ProductsAction> =
  (state = initialState, action) => {
    switch (action.type) {
      case "NA3_PRODUCTS_SET_DATA":
        return { ...state, data: sortStateData(action.data, "name") };
      case "NA3_PRODUCTS_SET_LOADING":
        return { ...state, loading: action.loading };
      case "NA3_PRODUCTS_SET_ERROR":
        return { ...state, error: action.error };

      default:
        return state;
    }
  };
