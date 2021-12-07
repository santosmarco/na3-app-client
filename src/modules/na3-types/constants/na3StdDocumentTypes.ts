import type { Na3StdDocumentType, Na3StdDocumentTypeId } from "../na3";

export const NA3_STD_DOCUMENT_TYPES: Record<
  Na3StdDocumentTypeId,
  Na3StdDocumentType
> = {
  form: {
    id: "form",
    color: "cyan",
    name: "Formulário",
    shortName: "Formulário",
  },
  instructions: {
    id: "instructions",
    color: "blue",
    name: "Instrução de trabalho",
    shortName: "Instrução",
  },
  manual: {
    id: "manual",
    color: "geekblue",
    name: "Manual",
    shortName: "Manual",
  },
  procedure: {
    id: "procedure",
    color: "purple",
    name: "Procedimento",
    shortName: "Procedimento",
  },
};
