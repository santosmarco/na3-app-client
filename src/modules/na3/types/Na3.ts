import type { BatchIdController } from "./batchId/BatchIdController";
import type { PeopleController } from "./PeopleController";
import type { ProductsController } from "./products/ProductsController";

export type Na3 = {
  readonly batchId: BatchIdController;
  readonly people: PeopleController;
  readonly products: ProductsController;
}
