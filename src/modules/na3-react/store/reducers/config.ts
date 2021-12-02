import type { Reducer } from "redux";

import type { ConfigAction, ConfigState } from "../../types";

const initialState: ConfigState = {
  environment: process.env.NODE_ENV,
  messagingTokensStorageKey: "NA3_APP_MESSAGING_TOKENS",
};

export const configReducer: Reducer<ConfigState, ConfigAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "CONFIG_SET_ENVIRONMENT":
      return { ...state, environment: action.environment };
    case "CONFIG_SET_MSG_TOKENS_STORAGE_KEY":
      return { ...state, messagingTokensStorageKey: action.key };

    default:
      return state;
  }
};
