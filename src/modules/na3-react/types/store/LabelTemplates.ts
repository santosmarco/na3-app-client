import type { FirebaseError } from "../../../firebase-errors-pt-br";
import type { Na3TransfLabelTemplate } from "../../../na3-types";

type LabelTemplateState<Data extends Na3TransfLabelTemplate> = {
  data: Data[] | null;
  error: FirebaseError | null;
  loading: boolean;
};

export type LabelTemplatesState = {
  transf: LabelTemplateState<Na3TransfLabelTemplate>;
};

export type LabelTemplatesTransfSetDataAction = {
  data: LabelTemplatesState["transf"]["data"];
  type: "LABEL_TEMPLATES_TRANSF_SET_DATA";
};

export type LabelTemplatesTransfSetLoadingAction = {
  loading: LabelTemplatesState["transf"]["loading"];
  type: "LABEL_TEMPLATES_TRANSF_SET_LOADING";
};

export type LabelTemplatesTransfSetErrorAction = {
  error: LabelTemplatesState["transf"]["error"];
  type: "LABEL_TEMPLATES_TRANSF_SET_ERROR";
};

export type LabelTemplatesAction =
  | LabelTemplatesTransfSetDataAction
  | LabelTemplatesTransfSetErrorAction
  | LabelTemplatesTransfSetLoadingAction;
