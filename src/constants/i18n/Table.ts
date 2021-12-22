import { isTouchDevice } from "@utils";

export const TABLE_LOCALE = {
  filterTitle: "Filtros",
  filterConfirm: "OK",
  filterReset: "Resetar",
  filterEmptyText: "Não há filtros",
  emptyText: "Não há dados",
  selectAll: "Selecionar página",
  selectInvert: "Inverter seleção",
  selectNone: "Remover todos",
  selectionAll: "Selecionar tudo",
  sortTitle: "Ordenar",
  expand: "Expandir",
  collapse: "Menos",
  triggerDesc: `${
    isTouchDevice() ? "Toque" : "Clique"
  } para classificar em ordem decrescente`,
  triggerAsc: `${
    isTouchDevice() ? "Toque" : "Clique"
  } para classificar em ordem crescente`,
  cancelSort: `${
    isTouchDevice() ? "Toque" : "Clique"
  } para remover a classificação`,
};
