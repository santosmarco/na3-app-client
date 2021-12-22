import type { Na3AppDevice } from "../Na3App";
import type { Na3MaintenancePerson } from "./Na3MaintenancePerson";

export type Na3ServiceOrderStatus =
  | "closed"
  | "pending"
  | "refused"
  | "solved"
  | "solving";

export type Na3ServiceOrderPriority = "high" | "low" | "medium";

export type Na3ServiceOrderEventType =
  | "maintainerChanged"
  | "poke"
  | "priorityChanged"
  | "solutionAccepted"
  | "solutionRefused"
  | "solutionStepAdded"
  | "solutionTransmitted"
  | "ticketClosed"
  | "ticketConfirmed"
  | "ticketCreated"
  | "ticketEdited"
  | "ticketReopened";

export type Na3ServiceOrderEventPayload = {
  assignedMaintainer?: Na3ServiceOrder["assignedMaintainer"];
  changes?: Na3ServiceOrderEventEditChanges;
  poke?: { from: string; to: string };
  priority?: Na3ServiceOrder["priority"];
  refusalReason?: Na3ServiceOrder["refusalReason"];
  solution?:
    | Na3ServiceOrder["solution"]
    | { content?: string; who?: Na3MaintenancePerson | string };
  solutionStep?: {
    content?: string;
    type:
      | "solutionAccepted"
      | "solutionRefused"
      | "solutionTransmitted"
      | "step";
    who?: Na3MaintenancePerson | string;
  };
} | null;

export type Na3ServiceOrderEventOrigin = {
  device: Na3AppDevice;
  user?: Na3MaintenancePerson;
};

export type Na3ServiceOrderEvent = Na3ServiceOrderEventOrigin & {
  id: string;
  payload: Na3ServiceOrderEventPayload;
  timestamp: string;
  type: Na3ServiceOrderEventType;
};

export type Na3ServiceOrder = {
  acceptedAt?: string | null;
  additionalInfo?: string | null;
  assignedMaintainer?: Na3MaintenancePerson | string;
  cause: string;
  closedAt?: string | null;
  createdAt: string;
  description: string;
  dpt: string;
  events: Na3ServiceOrderEvent[];
  id: string;
  interruptions: {
    equipment: boolean;
    line: boolean;
    production?: boolean;
  };
  machine: string;
  maintenanceType: string;
  priority?: "high" | "low" | "medium" | null;
  refusalReason?: string | null;
  reopenedAt?: string;
  solution?: string | null;
  solutionSteps?: string[];
  solvedAt?: string | null;
  status: Na3ServiceOrderStatus;
  team: string;
  username: string;
  version?: string | null;
};

type Na3ServiceOrderEventEditChanges = {
  cause?: { new: string; old: string };
  description?: { new: string; old: string };
  interruptions?: {
    equipment?: { new: boolean; old: boolean };
    line?: { new: boolean; old: boolean };
  };
  machine?: { new: string; old: string };
  maintenanceType?: { new: string; old: string };
  team?: { new: string; old: string };
};

/*
type Na3ServiceOrderStatsItem<T extends string | number> = {
  data: T | string;
  pos: number | string;
  best: T | string;
};

type Na3ServiceOrderStats = {
  // Tempo até 1a Confirmação
  timeToFirstConfirmation: Na3ServiceOrderStatsItem<string>;
  // Tempo até 1a Solução
  timeToFirstSolution: Na3ServiceOrderStatsItem<string>;
  // Tempo até 1a Resposta do Solicitante
  timeToFirstAnswerToSolution: Na3ServiceOrderStatsItem<string>;
  // Tempo até Encerramento
  timeToClosure: Na3ServiceOrderStatsItem<string>;
  // Qtd de Soluções Recusadas
  solutionsRefused: Na3ServiceOrderStatsItem<number>;
  // Qtd de Cutucadas
  pokes: Na3ServiceOrderStatsItem<number>;
};
*/
