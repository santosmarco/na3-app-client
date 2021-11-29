import type firebase from "firebase";

import type { Na3MaintenancePerson } from "./Na3MaintenancePerson";

export type Na3MaintenanceProjectStatus = "finished" | "late" | "running";

export type Na3MaintenanceProjectEvent = {
  author: Na3MaintenancePerson | /* Legacy: */ string;
  timestamp: firebase.firestore.Timestamp;
} & (
  | { changes: Na3MaintenanceProjectEventEditChanges; type: "edit" }
  | { message: string; type: "status" }
  | { message?: string; type: "complete" }
  | { type: "create" }
);

type Na3MaintenanceProjectBase = {
  description: string;
  eta: firebase.firestore.Timestamp;
  events: Na3MaintenanceProjectEvent[];
  id: string;
  internalId: number;
  priority: "high" | "low" | "medium";
  team: {
    manager: Na3MaintenancePerson | /* Legacy: */ string;
    others: (Na3MaintenancePerson | string)[] | /* Legacy: */ string;
  };
  title: string;
};

export type Na3MaintenanceProjectGeneral = Na3MaintenanceProjectBase & {
  isPredPrev: false | null;
};

export type Na3MaintenanceProjectPredPrev = Na3MaintenanceProjectBase & {
  isPredPrev: true;
};

export type Na3MaintenanceProject =
  | Na3MaintenanceProjectGeneral
  | Na3MaintenanceProjectPredPrev;

type Na3MaintenanceProjectEventEditChanges = Partial<{
  description: {
    new: Na3MaintenanceProjectBase["description"];
    old: Na3MaintenanceProjectBase["description"];
  };
  eta: {
    new: Na3MaintenanceProjectBase["eta"];
    old: Na3MaintenanceProjectBase["eta"];
  };
  priority: {
    new: Na3MaintenanceProjectBase["priority"];
    old: Na3MaintenanceProjectBase["priority"];
  };
  teamManager: {
    new: Na3MaintenanceProjectBase["team"]["manager"];
    old: Na3MaintenanceProjectBase["team"]["manager"];
  };
  teamOthers: {
    new: Na3MaintenanceProjectBase["team"]["others"];
    old: Na3MaintenanceProjectBase["team"]["others"];
  };
  title: {
    new: Na3MaintenanceProjectBase["title"];
    old: Na3MaintenanceProjectBase["title"];
  };
}>;
