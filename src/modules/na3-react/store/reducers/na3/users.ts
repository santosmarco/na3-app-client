import type { Reducer } from "redux";

import type { Na3UsersAction, Na3UsersState } from "../../../types";
import { sortStateData } from "../../../utils";

const initialState: Na3UsersState = {
  data: null,
  error: null,
  loading: true,
};

export const na3UsersReducer: Reducer<Na3UsersState, Na3UsersAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "NA3_USERS_SET_DATA":
      return { ...state, data: sortStateData(action.data, "registrationId") };
    case "NA3_USERS_SET_LOADING":
      return { ...state, loading: action.loading };
    case "NA3_USERS_SET_ERROR":
      return { ...state, error: action.error };

    default:
      return state;
  }
};
