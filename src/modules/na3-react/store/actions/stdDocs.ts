import type {
  StdDocsSetDataAction,
  StdDocsSetErrorAction,
  StdDocsSetLoadingAction,
  StdDocsState,
} from "../../types";

export const setStdDocsData = (
  data: StdDocsState["data"]
): StdDocsSetDataAction => ({
  data,
  type: "STD_DOCS_SET_DATA",
});

export const setStdDocsLoading = (
  loading: StdDocsState["loading"]
): StdDocsSetLoadingAction => ({
  loading,
  type: "STD_DOCS_SET_LOADING",
});

export const setStdDocsError = (
  error: StdDocsState["error"]
): StdDocsSetErrorAction => ({
  error,
  type: "STD_DOCS_SET_ERROR",
});
