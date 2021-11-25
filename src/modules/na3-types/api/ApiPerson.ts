import type { Na3ApiAddress } from "./ApiAddress";
import type { Na3ApiContact } from "./ApiContact";
import type { Na3ApiImage } from "./ApiImage";

type PersonCategory = {
  active: boolean;
  code: string;
  id: string;
  name: string;
};

export type Na3ApiPerson = {
  addressMain: Na3ApiAddress | null;
  addresses: Na3ApiAddress[];
  birthDate: string | null;
  categories: PersonCategory[];
  code: string;
  commCustomerType: string;
  contactPersonMain: Na3ApiContact | null;
  dataIsRestricted: boolean;
  foundedAt: string;
  id: string;
  irrfRate: number | null;
  isDefaulting: boolean;
  isFederalPublicAdmEntity: boolean;
  isServiceProvider: boolean;
  name: string;
  nickname: string;
  profilePic: Na3ApiImage | null;
  registeredAt: string;
  taxId: string | null;
  type: 0 | 1;
  withHoldsAnyValue: boolean;
  withHoldsContributionTaxes: boolean;
};
