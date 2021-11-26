import type { FirebaseError } from "../../../firebase-errors-pt-br";
import type { Na3User } from "../../../na3-types";

export type Na3UsersState = {
  data: Na3User[] | null;
  error: FirebaseError | null;
  loading: boolean;
};

export type Na3UsersSetDataAction = {
  data: Na3UsersState["data"];
  type: "NA3_USERS_SET_DATA";
};

export type Na3UsersSetLoadingAction = {
  loading: Na3UsersState["loading"];
  type: "NA3_USERS_SET_LOADING";
};

export type Na3UsersSetErrorAction = {
  error: Na3UsersState["error"];
  type: "NA3_USERS_SET_ERROR";
};

export type Na3UsersAction =
  | Na3UsersSetDataAction
  | Na3UsersSetErrorAction
  | Na3UsersSetLoadingAction;
