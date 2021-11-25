import type { Reducer } from "redux";

import { translateFirebaseError } from "../../../firebase-errors-pt-br";
import type { MaintProjectsAction, MaintProjectsState } from "../../types";
import { sortStateData } from "../../utils";

const initialState: MaintProjectsState = {
  data: null,
  error: null,
  loading: true,
};

export const maintProjectsReducer: Reducer<
  MaintProjectsState,
  MaintProjectsAction
> = (state = initialState, action) => {
  switch (action.type) {
    case "MAINT_PROJECTS_SET_DATA":
      return { ...state, data: sortStateData(action.data, "internalId") };
    case "MAINT_PROJECTS_SET_LOADING":
      return { ...state, loading: action.loading };
    case "MAINT_PROJECTS_SET_ERROR":
      return {
        ...state,
        error: action.error ? translateFirebaseError(action.error) : null,
      };

    default:
      return state;
  }
};
