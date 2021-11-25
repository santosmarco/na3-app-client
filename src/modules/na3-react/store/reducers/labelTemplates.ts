import type { Reducer } from "redux";

import { translateFirebaseError } from "../../../firebase-errors-pt-br";
import type { LabelTemplatesAction, LabelTemplatesState } from "../../types";
import { sortStateData } from "../../utils";

const initialState: LabelTemplatesState = {
  transf: { data: null, error: null, loading: true },
};

export const labelTemplatesReducer: Reducer<
  LabelTemplatesState,
  LabelTemplatesAction
> = (state = initialState, action) => {
  switch (action.type) {
    case "LABEL_TEMPLATES_TRANSF_SET_DATA":
      return {
        ...state,
        transf: { ...state.transf, data: sortStateData(action.data, "name") },
      };
    case "LABEL_TEMPLATES_TRANSF_SET_LOADING":
      return { ...state, transf: { ...state.transf, loading: action.loading } };
    case "LABEL_TEMPLATES_TRANSF_SET_ERROR":
      return {
        ...state,
        transf: {
          ...state.transf,
          error: action.error ? translateFirebaseError(action.error) : null,
        },
      };

    default:
      return state;
  }
};
