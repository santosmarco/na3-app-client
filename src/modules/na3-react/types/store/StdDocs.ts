import type { FirebaseError } from "@modules/firebase-errors-pt-br";
import type { Na3StdDocument } from "@modules/na3-types";

export type StdDocsState = {
  data: Na3StdDocument[] | null;
  error: FirebaseError | null;
  loading: boolean;
};

export type StdDocsSetDataAction = {
  data: StdDocsState["data"];
  type: "STD_DOCS_SET_DATA";
};

export type StdDocsSetLoadingAction = {
  loading: StdDocsState["loading"];
  type: "STD_DOCS_SET_LOADING";
};

export type StdDocsSetErrorAction = {
  error: StdDocsState["error"];
  type: "STD_DOCS_SET_ERROR";
};

export type StdDocsAction =
  | StdDocsSetDataAction
  | StdDocsSetErrorAction
  | StdDocsSetLoadingAction;
