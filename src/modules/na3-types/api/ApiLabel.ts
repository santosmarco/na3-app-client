import type { Na3DepartmentId } from "../na3";

type LabelId = "transf";

export type Na3ApiLabel<Id extends LabelId = LabelId> = {
  transf: {
    barcodeData: string;
    batchId: string;
    batchIdFormat: "brazil" | "commercial" | "mexico";
    customerName: string;
    date: string;
    departmentId: Na3DepartmentId<"shop-floor"> | null;
    invoiceNumber: string | null;
    productCode: string;
    productName: string;
    productQuantity: number | string;
    productUnitAbbreviation: string;
    productUnitName: string;
    qrData: string;
    transfId: string | null;
  };
}[Id];
