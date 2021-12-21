import type {
  Na3MaintenancePerson,
  Na3MaintenanceProject,
  Na3MaintenanceProjectEditEventChanges,
  Na3MaintenanceProjectEvent,
} from "@modules/na3-types";
import type { Dayjs } from "dayjs";
import { Timestamp } from "firebase/firestore";

import type { MaybeArray } from "../../types";

export type MaintProjectBuilderData = Required<
  Omit<
    Na3MaintenanceProject,
    "eta" | "events" | "id" | "internalId" | "ref" | "team"
  > & {
    author: Na3MaintenancePerson;
    eta: Dayjs;
    team: {
      manager: Na3MaintenancePerson;
      members: Array<Na3MaintenancePerson | string>;
    };
  }
>;

export type MaintProjectEventBuilderData =
  | { changes: Na3MaintenanceProjectEditEventChanges; type: "edit" }
  | { message: string | null; type: "complete" }
  | { message: string; type: "status" }
  | { type: "create" };

export type MaintProjectEventBuilderPayload = {
  author: Na3MaintenancePerson;
};

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
  const creationEvent = buildMaintProjectEvents(
    { type: "create" },
    { author: data.author }
  );

  const teamMembersSanitized = data.team.members.map((member) =>
    typeof member === "string"
      ? member
      : { displayName: member.displayName, uid: member.uid }
  );
  const teamMembersSorted = [
    ...teamMembersSanitized
      .filter(
        (member): member is Na3MaintenancePerson => typeof member !== "string"
      )
      .sort((a, b) => a.displayName.localeCompare(b.displayName)),
    ...teamMembersSanitized
      .filter((member): member is string => typeof member === "string")
      .sort((a, b) => a.localeCompare(b)),
  ];

  const project: Omit<Na3MaintenanceProject, "events" | "id" | "ref"> = {
    description: data.description.trim(),
    eta: Timestamp.fromDate(data.eta.clone().endOf("day").toDate()),
    internalId,
    isPredPrev: data.isPredPrev,
    priority: data.priority,
    team: {
      manager: {
        displayName: data.team.manager.displayName,
        uid: data.team.manager.uid,
      },
      others: teamMembersSorted,
    },
    title: data.title.trim(),
  };

  if (options?.skipEvents) {
    return project;
  }

  return { ...project, events: [creationEvent] };
}

export function buildMaintProjectEvents(
  event: MaintProjectEventBuilderData,
  payload: MaintProjectEventBuilderPayload
): Na3MaintenanceProjectEvent;
export function buildMaintProjectEvents(
  events: MaintProjectEventBuilderData[],
  payload: MaintProjectEventBuilderPayload
): Na3MaintenanceProjectEvent[];
export function buildMaintProjectEvents(
  eventOrEvents: MaybeArray<MaintProjectEventBuilderData>,
  payload: MaintProjectEventBuilderPayload
): MaybeArray<Na3MaintenanceProjectEvent> {
  function buildOneEvent(
    config: MaintProjectEventBuilderData
  ): Na3MaintenanceProjectEvent {
    return {
      ...config,
      author: {
        uid: payload.author.uid,
        displayName: payload.author.displayName,
      },
      timestamp: Timestamp.now(),
    };
  }

  if (!("length" in eventOrEvents)) {
    return buildOneEvent(eventOrEvents);
  }
  return eventOrEvents.map(buildOneEvent);
}
