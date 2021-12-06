import { translateFirebaseError } from "@modules/firebase-errors-pt-br";
import type { Reducer } from "redux";

import type { StdDocsAction, StdDocsState } from "../../types";
import { sortStateData } from "../../utils";

const initialState: StdDocsState = {
  data: null,
  error: null,
  loading: true,
};

export const stdDocsReducer: Reducer<StdDocsState, StdDocsAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "STD_DOCS_SET_DATA":
      return {
        ...state,
        data: sortStateData(action.data, "title"),
      };
    case "STD_DOCS_SET_LOADING":
      return { ...state, loading: action.loading };
    case "STD_DOCS_SET_ERROR":
      return {
        ...state,
        error: action.error ? translateFirebaseError(action.error) : null,
      };

    default:
      return state;
  }
};
