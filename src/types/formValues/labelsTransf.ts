import type { Na3TransfLabelTemplate } from "../../modules/na3-types";

export type LabelsTransfPrintFormOnSubmitValues = Omit<
  Na3TransfLabelTemplate,
  "id"
> & {
  batchId: string;
  copies: number;
  date: string;
  invoiceNumber: string;
  productQuantity: string;
  templateId: Na3TransfLabelTemplate["id"];
};
