import type { Dayjs } from "dayjs";
import firebase from "firebase";

import type {
  Na3MaintenanceProject,
  Na3MaintenanceProjectEvent,
} from "../../../na3-types";

export type MaintProjectBuilderData = Required<
  Omit<
    Na3MaintenanceProject,
    "eta" | "events" | "id" | "internalId" | "ref" | "team"
  > &
    Pick<Na3MaintenanceProjectEvent, "author"> & {
      eta: Dayjs;
      team: { manager: string; members: string[] };
    }
>;

export function buildMaintProject(
  internalId: number,
  data: MaintProjectBuilderData,
  options?: { skipEvents?: false }
): Omit<Na3MaintenanceProject, "id" | "ref">;
export function buildMaintProject(
  internalId: number,
  data: MaintProjectBuilderData,
  options: { skipEvents: true }
): Omit<Na3MaintenanceProject, "events" | "id" | "ref">;
export function buildMaintProject(
  internalId: number,
  data: MaintProjectBuilderData,
  options?: { skipEvents?: boolean }
):
  | Omit<Na3MaintenanceProject, "events" | "id" | "ref">
  | Omit<Na3MaintenanceProject, "id" | "ref"> {
  const creationEvent = buildMaintProjectEvents({
    author: data.author,
    type: "create",
  });

  const project: Omit<Na3MaintenanceProject, "events" | "id" | "ref"> = {
    description: data.description.trim(),
    eta: firebase.firestore.Timestamp.fromDate(
      data.eta.clone().endOf("day").toDate()
    ),
    internalId,
    isPredPrev: data.isPredPrev,
    priority: data.priority,
    team: {
      manager: data.team.manager.trim(),
      others: data.team.members
        .map((memberName) => memberName.trim())
        .join(", "),
    },
    title: data.title.trim(),
  };

  if (options?.skipEvents) {
    return project;
  }

  return { ...project, events: [creationEvent] };
}

export function buildMaintProjectEvents<
  T extends Omit<Na3MaintenanceProjectEvent, "timestamp">
>(events: T): Pick<Na3MaintenanceProjectEvent, "timestamp"> & T;
export function buildMaintProjectEvents<
  T extends Omit<Na3MaintenanceProjectEvent, "timestamp">
>(events: T[]): (Pick<Na3MaintenanceProjectEvent, "timestamp"> & T)[];
export function buildMaintProjectEvents<
  T extends Omit<Na3MaintenanceProjectEvent, "timestamp">
>(
  events: T | T[]
):
  | (Pick<Na3MaintenanceProjectEvent, "timestamp"> & T)[]
  | (Pick<Na3MaintenanceProjectEvent, "timestamp"> & T) {
  function buildOneEvent(
    config: T
  ): Pick<Na3MaintenanceProjectEvent, "timestamp"> & T {
    return { ...config, timestamp: firebase.firestore.Timestamp.now() };
  }

  if (!("length" in events)) {
    return buildOneEvent(events);
  } else {
    return events.map(buildOneEvent);
  }
}
