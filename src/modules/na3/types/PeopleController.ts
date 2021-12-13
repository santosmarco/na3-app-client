import type { Na3ApiPerson, Na3ApiResponse } from "../../na3-types";

export type PeopleController = {
  readonly getById: (id: string) => Promise<Na3ApiResponse<Na3ApiPerson>>;
}
