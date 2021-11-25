export type BimerProductGrid = {
  GradeHorizontal: {
    Codigo: number;
    Identificador: string;
    Sigla: string;
    Tipo: { Codigo: string; Identificador: string };
  };
  GradeVertical: {
    Codigo: number;
    Identificador: string;
    Sigla: string;
    Tipo: { Codigo: string; Identificador: string };
  };
  Identificador: string;
  NmProduto: string;
};
