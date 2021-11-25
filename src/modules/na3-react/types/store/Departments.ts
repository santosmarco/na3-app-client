import type { FirebaseError } from "../../../firebase-errors-pt-br";
import type { Na3Department } from "../../../na3-types";

export type DepartmentsState = {
  data: Na3Department[] | null;
  error: FirebaseError | null;
  loading: boolean;
};

export type DepartmentsSetDataAction = {
  data: DepartmentsState["data"];
  type: "DEPARTMENTS_SET_DATA";
};

export type DepartmentsSetLoadingAction = {
  loading: DepartmentsState["loading"];
  type: "DEPARTMENTS_SET_LOADING";
};

export type DepartmentsSetErrorAction = {
  error: DepartmentsState["error"];
  type: "DEPARTMENTS_SET_ERROR";
};

export type DepartmentsAction =
  | DepartmentsSetDataAction
  | DepartmentsSetErrorAction
  | DepartmentsSetLoadingAction;
