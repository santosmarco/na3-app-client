import type { Reducer } from "redux";

import type { Na3PeopleAction, Na3PeopleState } from "../../../types";
import { sortStateData } from "../../../utils";

const initialState: Na3PeopleState = {
  data: null,
  error: null,
  loading: true,
};

export const na3PeopleReducer: Reducer<Na3PeopleState, Na3PeopleAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "NA3_PEOPLE_SET_DATA":
      return { ...state, data: sortStateData(action.data, "name") };
    case "NA3_PEOPLE_SET_LOADING":
      return { ...state, loading: action.loading };
    case "NA3_PEOPLE_SET_ERROR":
      return { ...state, error: action.error };

    default:
      return state;
  }
};
