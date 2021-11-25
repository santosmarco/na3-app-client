export type Na3ApiContact = {
  email: string | null;
  emailBilling: string | null;
  emailBillingDoc: string | null;
  emailInvoice: string | null;
  fax: string | null;
  id: string;
  isMainContact: boolean;
  mobile: string | null;
  name: string;
  phone: string | null;
  registrationType: "A" | "E" | "I" | null;
  support: string | null;
  website: string | null;
};
