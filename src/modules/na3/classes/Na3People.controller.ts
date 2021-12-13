import type { Na3ApiPerson, Na3ApiResponse } from "../../na3-types";
import type { PeopleController } from "../types";
import { formatQueryInput } from "../utils";
import { Na3BaseController } from "./Na3Base.controller";

export class Na3PeopleController
  extends Na3BaseController
  implements PeopleController
{
  async getById(id: string): Promise<Na3ApiResponse<Na3ApiPerson>> {
    return this.getApi<Na3ApiPerson>(`/people/${formatQueryInput(id)}`);
  }
}
