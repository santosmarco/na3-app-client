import type { Na3ApiCompany } from "./ApiCompany";
import type { Na3ApiPerson } from "./ApiPerson";
import type { Na3ApiProduct } from "./ApiProduct";

type DocItem = {
  batchSeries: { code: string; id: string; type: "L" | "S" } | null;
  id: string;
  inputDepartmentId: string | null;
  outputDepartmentId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  weight: {
    gross: number;
    net: number;
  };
};

type DocPayment = {
  agreementPersonId: string | null;
  agreementRate: number;
  agreementTacRate: number;
  amount: number;
  amountFees: number;
  amountTacAgreement: number;
  amountTacCompany: number;
  cardAuthorizationNumber: string | null;
  cardUniqueSequentialNumber: string | null;
  cardholderName: string | null;
  checkNumber: string;
  companyTacRate: number;
  days: number;
  daysForFirstInstallment: number;
  daysInterval: number;
  daysReceipt: number;
  dueDate: string;
  financialPersonId: string | null;
  groupingDescription: string;
  id: string;
  installments: number;
  installmentsReceipt: number;
  naturezaLancamentoId: string;
  paymentMethodId: string;
  shouldUpdateFinancial: boolean;
  taxRate: number;
  titleNumber: number;
  writeOffTypeId: string | null;
};

export type Na3ApiDocument = {
  accessKey: string;
  billing: string | null;
  businessUnit: { code: string; description: string; id: string } | null;
  canceled: boolean;
  commDocStatus: string;
  customerId: string;
  documentType: "C" | "F" | "N" | "O" | "S" | "T";
  id: string;
  inventoryBatchId: string;
  issuedAt: string;
  items: DocItem[];
  messages: { code: string; description: string; id: string }[];
  nfStatus: "A" | "C" | "D" | "E" | "I" | "N" | "R" | "S" | "X";
  note: string;
  number: string;
  operationId: string;
  originEntityName: string | null;
  paymentRefDate: string;
  payments: DocPayment[];
  purposeType: string;
  refDate: string;
  released: boolean;
  sellerCompanyCode: string;
};

export type Na3ApiDocumentExpanded = Omit<Na3ApiDocument, "items"> & {
  customer: Na3ApiPerson | null;
  items: (DocItem & { product: Na3ApiProduct | null })[];
  sellerCompany: Na3ApiCompany | null;
};
