import type { Reducer } from "redux";

import type { ConfigAction, ConfigState } from "../../types";

const initialState: ConfigState = {
  environment: process.env.NODE_ENV,
};

export const configReducer: Reducer<ConfigState, ConfigAction> = (
  state = initialState,
  action
) => {
  if (action.type === "CONFIG_SET_ENVIRONMENT") {
    return { ...state, environment: action.environment };
  }
  return state;
};
