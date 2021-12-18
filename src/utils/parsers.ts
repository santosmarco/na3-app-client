import type { LiteralUnion } from "type-fest";
import type { Falsy } from "utility-types";

const parserDictionary = {
  // General translations
  title: "Título",
  description: "Descrição",
  priority: "Prioridade",
  eta: "Previsão de entrega",

  // General
  "application/pdf": ".pdf",

  // Levels of priority
  low: "Baixa",
  medium: "Média",
  high: "Alta",

  // Types of status
  pending: "Pendente", // Service Orders & StdDocs
  solving: "Resolvendo", // Service Orders
  solved: "Solucionada", // Service Orders
  closed: "Encerrada", // Service Orders
  refused: "Recusada", // Service Orders
  draft: "Rascunho", // StdDocs
  approved: "Aprovado", // StdDocs
  rejected: "Recusado", // StdDocs
  finished: "Finalizado", // MaintProjects
  late: "Atrasado", // MaintProjects
  running: "Em execução", // MaintProjects
  "maint-pred-prev-finished": "Finalizada", // MaintProjects:PredPrev
  "maint-pred-prev-late": "Atrasada", // MaintProjects:PredPrev
  "maint-pred-prev-running": "Em execução", // MaintProjects:PredPrev

  // Service orders
  // Types of maintenance
  corretiva: "Corretiva",
  preditiva: "Preditiva",
  preventiva: "Preventiva",
  // Types of cause
  machineAdjustment: "Ajuste de máquina",
  // Types of team
  predial: "Predial",
  // Types of cause AND team
  eletrica: "Elétrica",
  mecanica: "Mecânica",
  // Types of event
  ticketCreated: "OS criada",
  ticketConfirmed: "OS confirmada",
  solutionStepAdded: "Progresso",
  solutionTransmitted: "Solução transmitida",
  solutionAccepted: "Solução aceita",
  solutionRefused: "Solução recusada",
  ticketClosed: "OS encerrada",
  ticketReopened: "OS reaberta",
  ticketEdited: "OS editada",
  priorityChanged: "Prioridade redefinida",
  maintainerChanged: "Responsável redefinido",
  poke: "Setor cutucado",

  // MaintProjects
  // Types of event
  "maint-project-create": "Aberto",
  "maint-project-status": "Progresso",
  "maint-project-complete": "Entregue",
  "maint-project-edit": "Editado",
  // `Edit` event payload key translations
  teamManager: "Responsável",
  teamOthers: "Equipe",

  // MaintProjects:PredPrev
  // Types of event
  "maint-predprev-create": "Aberta",
  "maint-predprev-status": "Progresso",
  "maint-predprev-complete": "Entregue",
  "maint-predprev-edit": "Editada",

  // DocsStd
  // Types of event
  acknowledge: "Confirmação de leitura",
  approve: "Versão aprovada",
  create: "Versão lançada",
  download: "Download",
  edit: "Versão editada",
  reject: "Versão rejeitada",
  upgrade: "Documento atualizado",
};

type StringId = keyof typeof parserDictionary;

export function parseStringId(
  id: Falsy | LiteralUnion<StringId, string>
): string {
  if (typeof id === "string") {
    if (id in parserDictionary) {
      // If it's a string and is in the parser's dictionary, return its
      // definition.
      return parserDictionary[id as StringId];
    }
    // If it's a string, but it's not in the parser's dictionary, return it
    // unparsed.
    return id;
  }
  // Else, return the empty string.
  return "";
}
