import type { Timestamp } from "firebase/firestore";

import type { Na3MaintenancePerson } from "./Na3MaintenancePerson";

export type Na3MaintenanceProjectStatus = "finished" | "late" | "running";

export type Na3MaintenanceProjectEvent = {
  author: Na3MaintenancePerson | /* Legacy: */ string;
  timestamp: Timestamp;
} & (
  | { changes: Na3MaintenanceProjectEditEventChanges; type: "edit" }
  | { message: string; type: "status" }
  | { message?: string | null; type: "complete" }
  | { type: "create" }
);

type Na3MaintenanceProjectBase = {
  description: string;
  eta: Timestamp;
  events: Na3MaintenanceProjectEvent[];
  id: string;
  internalId: number;
  priority: "high" | "low" | "medium";
  team: {
    manager: Na3MaintenancePerson | /* Legacy: */ string;
    others: Array<Na3MaintenancePerson | string> | /* Legacy: */ string;
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

export type Na3MaintenanceProjectChangeKey =
  | "description"
  | "eta"
  | "priority"
  | "teamManager"
  | "teamOthers"
  | "title";

type Na3MaintenanceProjectChangeBody<T> = {
  old: T;
  new: T;
};

export type Na3MaintenanceProjectChange<
  Key extends Na3MaintenanceProjectChangeKey = Na3MaintenanceProjectChangeKey
> = {
  description: Na3MaintenanceProjectChangeBody<
    Na3MaintenanceProjectBase["description"]
  >;
  eta: Na3MaintenanceProjectChangeBody<Na3MaintenanceProjectBase["eta"]>;
  priority: Na3MaintenanceProjectChangeBody<
    Na3MaintenanceProjectBase["priority"]
  >;
  teamManager: Na3MaintenanceProjectChangeBody<
    Na3MaintenanceProjectBase["team"]["manager"]
  >;
  teamOthers: Na3MaintenanceProjectChangeBody<
    Na3MaintenanceProjectBase["team"]["others"]
  >;
  title: Na3MaintenanceProjectChangeBody<Na3MaintenanceProjectBase["title"]>;
}[Key];

export type Na3MaintenanceProjectEditEventChanges = Partial<{
  description: Na3MaintenanceProjectChange<"description">;
  eta: Na3MaintenanceProjectChange<"eta">;
  priority: Na3MaintenanceProjectChange<"priority">;
  teamManager: Na3MaintenanceProjectChange<"teamManager">;
  teamOthers: Na3MaintenanceProjectChange<"teamOthers">;
  title: Na3MaintenanceProjectChange<"title">;
}>;
