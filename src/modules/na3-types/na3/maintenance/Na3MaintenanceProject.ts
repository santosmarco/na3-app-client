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

export type Na3MaintenanceProject = {
  description: string;
  eta: Timestamp;
  events: Na3MaintenanceProjectEvent[];
  id: string;
  internalId: number;
  isPredPrev?: boolean | null;
  priority: "high" | "low" | "medium";
  team: {
    manager: Na3MaintenancePerson | /* Legacy: */ string;
    others: Array<Na3MaintenancePerson | string> | /* Legacy: */ string;
  };

  title: string;
};

export type Na3MaintenanceProjectChangeKey =
  | "description"
  | "eta"
  | "priority"
  | "teamManager"
  | "teamOthers"
  | "title";

type Na3MaintenanceProjectChangeBody<T> = {
  new: T;
  old: T;
};

export type Na3MaintenanceProjectChange<
  Key extends Na3MaintenanceProjectChangeKey = Na3MaintenanceProjectChangeKey
> = {
  description: Na3MaintenanceProjectChangeBody<
    Na3MaintenanceProject["description"]
  >;
  eta: Na3MaintenanceProjectChangeBody<Na3MaintenanceProject["eta"]>;
  priority: Na3MaintenanceProjectChangeBody<Na3MaintenanceProject["priority"]>;
  teamManager: Na3MaintenanceProjectChangeBody<
    Na3MaintenanceProject["team"]["manager"]
  >;
  teamOthers: Na3MaintenanceProjectChangeBody<
    Na3MaintenanceProject["team"]["others"]
  >;
  title: Na3MaintenanceProjectChangeBody<Na3MaintenanceProject["title"]>;
}[Key];

export type Na3MaintenanceProjectEditEventChanges = Partial<{
  description: Na3MaintenanceProjectChange<"description">;
  eta: Na3MaintenanceProjectChange<"eta">;
  priority: Na3MaintenanceProjectChange<"priority">;
  teamManager: Na3MaintenanceProjectChange<"teamManager">;
  teamOthers: Na3MaintenanceProjectChange<"teamOthers">;
  title: Na3MaintenanceProjectChange<"title">;
}>;
