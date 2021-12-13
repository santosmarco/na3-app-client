import * as Sentry from "@sentry/react";
import type { StoreEnhancer } from "redux";
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import type { RootState } from "../types";
import { rootReducer } from "./reducers";

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  configureScopeWithState: (scope, state: RootState) => {
    scope.setUser({
      ...state.auth.user,
      email: state.auth.user?.email || undefined,
    });
  },
}) as StoreEnhancer;

export const store = createStore(
  rootReducer,
  process.env.NODE_ENV === "development"
    ? composeWithDevTools(sentryReduxEnhancer)
    : sentryReduxEnhancer
);
