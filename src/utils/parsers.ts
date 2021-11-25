import type { Falsy } from "utility-types";

export function parseStringId(id: Falsy | string): string {
  return id
    ? {
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
      }[id] || id
    : "";
}
