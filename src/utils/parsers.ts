import type { LiteralUnion } from "type-fest";
import type { Falsy } from "utility-types";

const stringIdsDictionary = {
  corretiva: "Corretiva",
  eletrica: "Elétrica",
  high: "Alta",
  low: "Baixa",
  machineAdjustment: "Ajuste de máquina",
  "maint-predprev-complete": "Entregue",
  "maint-predprev-create": "Aberta",
  "maint-predprev-edit": "Editada",
  "maint-predprev-status": "Progresso",
  "maint-project-complete": "Entregue",
  "maint-project-create": "Aberto",
  "maint-project-edit": "Editado",
  "maint-project-status": "Progresso",
  maintainerChanged: "Responsável redefinido",
  mecanica: "Mecânica",
  medium: "Média",
  poke: "Setor cutucado",
  predial: "Predial",
  preditiva: "Preditiva",
  preventiva: "Preventiva",
  priorityChanged: "Prioridade redefinida",
  solutionAccepted: "Solução aceita",
  solutionRefused: "Solução recusada",
  solutionStepAdded: "Progresso",
  solutionTransmitted: "Solução transmitida",
  ticketClosed: "OS encerrada",
  ticketConfirmed: "OS confirmada",
  ticketCreated: "OS criada",
  ticketEdited: "OS editada",
  ticketReopened: "OS reaberta",
  pending: "Pendente",
  solving: "Resolvendo",
  solved: "Solucionada",
  closed: "Encerrada",
  refused: "Recusada",
};

export function parseStringId(
  id: Falsy | LiteralUnion<keyof typeof stringIdsDictionary, string>
): string {
  if (typeof id === "string" && id in stringIdsDictionary) {
    return stringIdsDictionary[id as keyof typeof stringIdsDictionary];
  }
  return "";
}
