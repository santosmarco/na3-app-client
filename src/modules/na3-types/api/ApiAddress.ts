import type { Na3ApiContact } from "./ApiContact";

export type Na3ApiAddress = {
  active: boolean;
  addressChunks: string[];
  addressFull: string;
  addressLine2: string;
  addressTypes: string[];
  city: {
    areaCode: string;
    code: string;
    ibgeCode: string;
    id: string;
    name: string;
    state: {
      abbreviation: string;
      ibgeCode: number;
      name: string;
    } | null;
  } | null;
  code: string;
  contactPeople: Na3ApiContact[];
  contactPersonMain: Na3ApiContact | null;
  icmsStatus: "1" | "2" | "9";
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  latLong: [number, number];
  neighborhood: { code: string; id: string; name: string } | null;
  note: string;
  stateAbbreviation: string;
  status: string | null;
  street: string;
  streetNumber: string;
  streetType: { id: string; name: string } | null;
  suframaCode: string;
  zipCode: string | null;
};
