export type Na3ApiProductGrid = {
  horizontal: {
    abbreviation: string;
    code: number;
    id: string;
    type: { code: string; id: string };
  };
  id: string;
  productName: string;
  vertical: {
    abbreviation: string;
    code: number;
    id: string;
    type: { code: string; id: string };
  };
};
