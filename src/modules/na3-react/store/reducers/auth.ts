import type { Reducer } from "redux";

import type { AuthAction, AuthState } from "../../types";

const initialState: AuthState = {
  error: null,
  loading: true,
  user: null,
  _firebaseUser: undefined,
};

export const authReducer: Reducer<AuthState, AuthAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "AUTH_SET_USER":
      return { ...state, user: action.user };
    case "AUTH_SET_FIREBASE_USER":
      return { ...state, _firebaseUser: action._firebaseUser };
    case "AUTH_SET_LOADING":
      return { ...state, loading: action.loading };
    case "AUTH_SET_ERROR":
      return { ...state, error: action.error };

    default:
      return state;
  }
};
