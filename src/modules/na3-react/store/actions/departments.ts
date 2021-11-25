import type {
  DepartmentsSetDataAction,
  DepartmentsSetErrorAction,
  DepartmentsSetLoadingAction,
  DepartmentsState,
} from "../../types";

export const setDepartmentsData = (
  data: DepartmentsState["data"]
): DepartmentsSetDataAction => ({
  data,
  type: "DEPARTMENTS_SET_DATA",
});

export const setDepartmentsLoading = (
  loading: DepartmentsState["loading"]
): DepartmentsSetLoadingAction => ({
  loading,
  type: "DEPARTMENTS_SET_LOADING",
});

export const setDepartmentsError = (
  error: DepartmentsState["error"]
): DepartmentsSetErrorAction => ({
  error,
  type: "DEPARTMENTS_SET_ERROR",
});
