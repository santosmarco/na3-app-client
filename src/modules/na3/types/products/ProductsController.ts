import type { Na3ApiProduct } from "../../../na3-types";
import type { ControllerResult } from "../utils/ControllerResult";
import type { Product } from "./Product";

type ControllerUtils = {
  readonly fixQuery: (query: string) => string;
};

export interface ProductsController {
  readonly getByCode: (code: string) => Promise<ControllerResult<Product>>;
  readonly getById: (id: string) => Promise<ControllerResult<Product>>;
  readonly isApiProduct: (testProduct: unknown) => testProduct is Na3ApiProduct;
  readonly isDartBagCode: (testCode: unknown) => testCode is `S-${number}`;
  readonly isProductCode: (
    testCode: unknown
  ) => testCode is `${number}` | `S-${number}`;
  readonly isProductId: (testId: unknown) => testId is `00A000${number}`;
  readonly utils: ControllerUtils;
}
