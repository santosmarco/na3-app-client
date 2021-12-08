import type { User } from "firebase/auth";
import type { ConditionalExcept } from "type-fest";

import type { FirebaseError } from "../../../firebase-errors-pt-br";
import type { Na3User } from "../../../na3-types";

// eslint-disable-next-line @typescript-eslint/ban-types
type FirebaseUser = ConditionalExcept<User, Function>;

export type AuthState = {
  _firebaseUser: FirebaseUser | null | undefined;
  error:
    | (Omit<FirebaseError, "name"> & Partial<Pick<FirebaseError, "name">>)
    | null;
  loading: boolean;
  user: Na3User | null;
};

export type AuthSetUserAction = {
  type: "AUTH_SET_USER";
  user: AuthState["user"];
};

export type AuthSetFirebaseUserAction = {
  _firebaseUser: AuthState["_firebaseUser"];
  type: "AUTH_SET_FIREBASE_USER";
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
  | AuthSetFirebaseUserAction
  | AuthSetLoadingAction
  | AuthSetUserAction;
