import type { Na3ApiProduct } from "../../na3-types";
import type { ControllerResult, Product, ProductsController } from "../types";
import { formatQueryInput } from "../utils";
import { Na3BaseController } from "./Na3Base.controller";
import { Na3Product } from "./Na3Product.instance";

export class Na3ProductsController
  extends Na3BaseController
  implements ProductsController
{
  readonly utils = {
    fixQuery: (query: string): string => {
      const formatted = formatQueryInput(query);

      if (formatted.startsWith("S") && formatted[1] !== "-") {
        return `S-${formatted.slice(1)}`;
      }
      return query;
    },
  };

  async getById(id: string): Promise<ControllerResult<Product>> {
    const res = await this.getApi<Na3ApiProduct>(
      `/products/${formatQueryInput(id)}`
    );

    if (res.error) return res;
    return { data: new Na3Product(res.data), error: null };
  }

  async getByCode(code: string): Promise<ControllerResult<Product>> {
    const res = await this.getApi<Na3ApiProduct>(
      `/products?code=${formatQueryInput(code)}`
    );

    if (res.error) return res;
    return { data: new Na3Product(res.data), error: null };
  }

  isApiProduct(testProduct: unknown): testProduct is Na3ApiProduct {
    return (
      testProduct instanceof Object &&
      Object.prototype.hasOwnProperty.call(testProduct, "masterProductId") &&
      Object.prototype.hasOwnProperty.call(testProduct, "originProductId") &&
      Object.prototype.hasOwnProperty.call(testProduct, "perCarton")
    );
  }

  isProductId(testId: unknown): testId is `00A000${number}` {
    if (typeof testId !== "string") return false;
    const formatted = formatQueryInput(testId);
    return /^00A000[\dA-Z]{4}$/.test(formatted);
  }

  isProductCode(testCode: unknown): testCode is `${number}` | `S-${number}` {
    if (typeof testCode !== "string") return false;
    const formatted = formatQueryInput(testCode);
    return /^((\d{10})|(S-\d{7}))$/.test(formatted);
  }

  isDartBagCode(testCode: unknown): testCode is `S-${number}` {
    return this.isProductCode(testCode) && testCode.startsWith("S-");
  }
}
