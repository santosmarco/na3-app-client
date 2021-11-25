import type { BimerCompany } from "./BimerCompany";

export type BimerDepartment = {
  Ativo: boolean;
  Codigo: string;
  ControlaEstoque: boolean;
  ControlaLote: boolean;
  Descricao: string;
  Empresa: BimerCompany;
  Identificador: string;
  Observacao?: string;
};
