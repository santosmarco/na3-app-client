import type { FirebaseError } from "../../../firebase-errors-pt-br";
import type { Na3ApiPerson } from "../../../na3-types";

export type Na3PeopleState = {
  data: Na3ApiPerson[] | null;
  error: FirebaseError | null;
  loading: boolean;
};

export type Na3PeopleSetDataAction = {
  data: Na3PeopleState["data"];
  type: "NA3_PEOPLE_SET_DATA";
};

export type Na3PeopleSetLoadingAction = {
  loading: Na3PeopleState["loading"];
  type: "NA3_PEOPLE_SET_LOADING";
};

export type Na3PeopleSetErrorAction = {
  error: Na3PeopleState["error"];
  type: "NA3_PEOPLE_SET_ERROR";
};

export type Na3PeopleAction =
  | Na3PeopleSetDataAction
  | Na3PeopleSetErrorAction
  | Na3PeopleSetLoadingAction;
