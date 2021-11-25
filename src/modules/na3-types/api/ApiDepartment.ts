import type { Na3ApiCompany } from "./ApiCompany";

export type Na3ApiDepartment = {
  active: boolean;
  code: string;
  company: Na3ApiCompany;
  description: string;
  id: string;
  note: string | null;
  permissions: {
    batches: boolean;
    inventory: boolean;
  };
};
