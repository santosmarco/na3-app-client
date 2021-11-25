import type {
  MaintProjectsSetDataAction,
  MaintProjectsSetErrorAction,
  MaintProjectsSetLoadingAction,
  MaintProjectsState,
} from "../../types";

export const setMaintProjectsData = (
  data: MaintProjectsState["data"]
): MaintProjectsSetDataAction => ({
  data,
  type: "MAINT_PROJECTS_SET_DATA",
});

export const setMaintProjectsLoading = (
  loading: MaintProjectsState["loading"]
): MaintProjectsSetLoadingAction => ({
  loading,
  type: "MAINT_PROJECTS_SET_LOADING",
});

export const setMaintProjectsError = (
  error: MaintProjectsState["error"]
): MaintProjectsSetErrorAction => ({
  error,
  type: "MAINT_PROJECTS_SET_ERROR",
});
