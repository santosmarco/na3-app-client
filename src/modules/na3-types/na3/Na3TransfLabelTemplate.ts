import type { Na3ApiLabel } from "../api/ApiLabel";
import type { Na3ApiProduct } from "../api/ApiProduct";

export type Na3TransfLabelTemplate = Pick<
  Na3ApiLabel<"transf">,
  | "batchIdFormat"
  | "customerName"
  | "departmentId"
  | "productCode"
  | "productName"
  | "productUnitAbbreviation"
  | "productUnitName"
> & {
  customerId: string | null;
  id: string;
  name: string;
  productId: string;
  productSnapshot: Na3ApiProduct | null;
};
