import type {
  Na3ApiPerson,
  Na3ApiProduct,
  Na3ApiResponseArray,
  Na3ApiResponseSuccess,
} from "../../na3-types";
import type { Product } from "../types";
import { Na3PeopleController } from "./Na3People.controller";

export class Na3Product implements Product {
  private readonly peopleController = new Na3PeopleController();

  constructor(private readonly _product: Na3ApiProduct) {}

  get(): Na3ApiProduct {
    return this._product;
  }

  async getCustomers(options?: {
    ignoreErrors?: false;
  }): Promise<Na3ApiResponseArray<Na3ApiPerson>>;
  async getCustomers(options?: { ignoreErrors: true }): Promise<Na3ApiPerson[]>;
  async getCustomers(options?: {
    ignoreErrors?: boolean;
  }): Promise<Na3ApiPerson[] | Na3ApiResponseArray<Na3ApiPerson>> {
    const customersRes = await Promise.all(
      this._product.customerIds.map(async (customerId) =>
        this.peopleController.getById(customerId)
      )
    );

    return options?.ignoreErrors
      ? customersRes
          .filter(
            (res): res is Na3ApiResponseSuccess<Na3ApiPerson> => !!res.data
          )
          .map((r) => r.data)
      : {
          data: customersRes.map((response) => response.data),
          errors: customersRes.map((response) => response.error),
        };
  }
}
