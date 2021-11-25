import type {
  Na3PeopleSetDataAction,
  Na3PeopleSetErrorAction,
  Na3PeopleSetLoadingAction,
  Na3PeopleState,
} from "../../../types";

export const setNa3PeopleData = (
  data: Na3PeopleState["data"]
): Na3PeopleSetDataAction => ({
  data,
  type: "NA3_PEOPLE_SET_DATA",
});

export const setNa3PeopleLoading = (
  loading: Na3PeopleState["loading"]
): Na3PeopleSetLoadingAction => ({
  loading,
  type: "NA3_PEOPLE_SET_LOADING",
});

export const setNa3PeopleError = (
  error: Na3PeopleState["error"]
): Na3PeopleSetErrorAction => ({
  error,
  type: "NA3_PEOPLE_SET_ERROR",
});
