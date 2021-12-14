import type {
  Na3ApiPerson,
  Na3ApiProduct,
  Na3ApiResponseArray,
} from "../../../na3-types";

export type Product = {
  get: () => Na3ApiProduct;
  getCustomers: ((options?: {
    ignoreErrors?: false;
  }) => Promise<Na3ApiResponseArray<Na3ApiPerson>>) &
    ((options?: { ignoreErrors: true }) => Promise<Na3ApiPerson[]>);
};
