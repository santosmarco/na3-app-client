import type firebase from "firebase";

export type Na3ServiceOrder = LegacyTicket & {
  id: string;
  ref?: firebase.firestore.DocumentReference<Na3ServiceOrder>;
};

export type Na3ServiceOrderEvent = Na3ServiceOrder["events"][number];

export type Na3ServiceOrderStatus = Na3ServiceOrder["status"];

/* LegacyTicket */

type LegacyTicketEditedEventChanges = {
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

type LegacyTicket = {
  acceptedAt?: string | null;
  additionalInfo?: string | null;

  assignedMaintainer?: string;
  cause: string;
  closedAt?: string | null;
  createdAt: string;
  description: string;
  dpt: string;
  events: {
    device: {
      model: string | null;
      name: string | null;
      os: { name: string | null; version: string | null };
    };
    id: string;
    payload: {
      assignedMaintainer?: LegacyTicket["assignedMaintainer"];
      changes?: LegacyTicketEditedEventChanges;
      poke?: { from: string; to: string };
      priority?: LegacyTicket["priority"];
      refusalReason?: LegacyTicket["refusalReason"];
      solution?: LegacyTicket["solution"] | { content?: string; who?: string };
      solutionStep?: {
        content?: string;
        type:
          | "solutionAccepted"
          | "solutionRefused"
          | "solutionTransmitted"
          | "step";
        who?: string;
      };
    } | null;
    timestamp: string;

    type:
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
  }[];
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
  status: "closed" | "pending" | "refused" | "solved" | "solving";
  team: string;

  username: string;

  version?: string | null;
};

/*
type LegacyTicketStatsItem<T extends string | number> = {
  data: T | string;
  pos: number | string;
  best: T | string;
};

type LegacyTicketStats = {
  // Tempo até 1a Confirmação
  timeToFirstConfirmation: LegacyTicketStatsItem<string>;
  // Tempo até 1a Solução
  timeToFirstSolution: LegacyTicketStatsItem<string>;
  // Tempo até 1a Resposta do Solicitante
  timeToFirstAnswerToSolution: LegacyTicketStatsItem<string>;
  // Tempo até Encerramento
  timeToClosure: LegacyTicketStatsItem<string>;
  // Qtd de Soluções Recusadas
  solutionsRefused: LegacyTicketStatsItem<number>;
  // Qtd de Cutucadas
  pokes: LegacyTicketStatsItem<number>;
};
*/
