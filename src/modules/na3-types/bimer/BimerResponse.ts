import type { BimerError } from "./BimerError";

type BimerPagination = {
  Limite: number;
  Pagina: number;
  Total: number;
  TotalPagina: number;
};

export type BimerResponseFail = {
  Erros: BimerError[] & { 0: BimerError };
  ListaObjetos: [];
};

export type BimerResponseSuccess<T> = {
  Erros: [];
  ListaObjetos: T[] & { 0: T };
};

export type BimerResponse<T> =
  | { Paginacao?: BimerPagination } & (
      | BimerResponseFail
      | BimerResponseSuccess<T>
    );
