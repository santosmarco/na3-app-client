import type {
  LabelTemplatesState,
  LabelTemplatesTransfSetDataAction,
  LabelTemplatesTransfSetErrorAction,
  LabelTemplatesTransfSetLoadingAction,
} from "../../types";

export const setTransfLabelTemplatesData = (
  data: LabelTemplatesState["transf"]["data"]
): LabelTemplatesTransfSetDataAction => ({
  data,
  type: "LABEL_TEMPLATES_TRANSF_SET_DATA",
});

export const setTransfLabelTemplatesLoading = (
  loading: LabelTemplatesState["transf"]["loading"]
): LabelTemplatesTransfSetLoadingAction => ({
  loading,
  type: "LABEL_TEMPLATES_TRANSF_SET_LOADING",
});

export const setTransfLabelTemplatesError = (
  error: LabelTemplatesState["transf"]["error"]
): LabelTemplatesTransfSetErrorAction => ({
  error,
  type: "LABEL_TEMPLATES_TRANSF_SET_ERROR",
});
