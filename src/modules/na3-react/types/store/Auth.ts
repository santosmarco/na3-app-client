import type { FirebaseError } from "../../../firebase-errors-pt-br";
import type { Na3User } from "../../../na3-types";

export type AuthState = {
  error: FirebaseError | null;
  loading: boolean;
  user: Na3User | null | undefined;
};

export type AuthSetUserAction = {
  type: "AUTH_SET_USER";
  user: AuthState["user"];
};

export type AuthSetLoadingAction = {
  loading: AuthState["loading"];
  type: "AUTH_SET_LOADING";
};

export type AuthSetErrorAction = {
  error: AuthState["error"];
  type: "AUTH_SET_ERROR";
};

export type AuthAction =
  | AuthSetErrorAction
  | AuthSetLoadingAction
  | AuthSetUserAction;
