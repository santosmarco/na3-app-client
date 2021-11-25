import type { Na3ApiImage } from "./ApiImage";
import type { Na3ApiProductGrid } from "./ApiProductGrid";

export type Na3ApiProduct = {
  active: boolean;
  application: string | null;
  attributes: { code: string; id: string; name: string }[];
  classificationCode: string | null;
  code: string;
  conversionFactor: number;
  customerIds: string[];
  dimensions: {
    diameter: number;
    height: number;
    length: number;
    packageType: string;
    width: number;
  };
  family: {
    code: string | null;
    description: string | null;
    id: string | null;
  } | null;
  grid: Na3ApiProductGrid | null;
  group: { code: string; description: string; id: string } | null;
  id: string;
  images: Na3ApiImage[];
  isInventoryProduct: boolean;
  isMexicoProduct: boolean;
  masterProductId: string | null;
  name: string;
  originProductId: string | null;
  perCarton: number;
  taxClassification: {
    classification: string;
    code: string;
    description: string;
    id: string;
    precedingTaxesRate: number;
  } | null;
  unit: { abbreviation: Uppercase<string>; name: string };
  variants: { code: string; id: string; name: string }[];
  weight: { gross: number; net: number };
};
