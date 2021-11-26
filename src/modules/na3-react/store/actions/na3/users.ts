import type {
  Na3UsersSetDataAction,
  Na3UsersSetErrorAction,
  Na3UsersSetLoadingAction,
  Na3UsersState,
} from "../../../types";

export const setNa3UsersData = (
  data: Na3UsersState["data"]
): Na3UsersSetDataAction => ({
  data,
  type: "NA3_USERS_SET_DATA",
});

export const setNa3UsersLoading = (
  loading: Na3UsersState["loading"]
): Na3UsersSetLoadingAction => ({
  loading,
  type: "NA3_USERS_SET_LOADING",
});

export const setNa3UsersError = (
  error: Na3UsersState["error"]
): Na3UsersSetErrorAction => ({
  error,
  type: "NA3_USERS_SET_ERROR",
});
