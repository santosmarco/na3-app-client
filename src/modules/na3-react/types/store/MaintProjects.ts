import type { FirebaseError } from "../../../firebase-errors-pt-br";
import type { Na3MaintenanceProject } from "../../../na3-types";

export type MaintProjectsState = {
  data: Na3MaintenanceProject[] | null;
  error: FirebaseError | null;
  loading: boolean;
};

export type MaintProjectsSetDataAction = {
  data: MaintProjectsState["data"];
  type: "MAINT_PROJECTS_SET_DATA";
};

export type MaintProjectsSetLoadingAction = {
  loading: MaintProjectsState["loading"];
  type: "MAINT_PROJECTS_SET_LOADING";
};

export type MaintProjectsSetErrorAction = {
  error: MaintProjectsState["error"];
  type: "MAINT_PROJECTS_SET_ERROR";
};

export type MaintProjectsAction =
  | MaintProjectsSetDataAction
  | MaintProjectsSetErrorAction
  | MaintProjectsSetLoadingAction;
