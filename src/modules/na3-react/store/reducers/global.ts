import type { Reducer } from "redux";

import type { GlobalAction, GlobalState } from "../../types";
import { getDevice } from "../../utils";

const initialState: GlobalState = {
  device: getDevice(null),
  loading: true,
};

export const globalReducer: Reducer<GlobalState, GlobalAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "GLOBAL_SET_LOADING":
      return { ...state, loading: action.loading };
    case "GLOBAL_SET_DEVICE":
      return { ...state, device: action.device };
    default:
      return state;
  }
};
