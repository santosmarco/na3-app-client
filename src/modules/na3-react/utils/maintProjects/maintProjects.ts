import type {
  Na3MaintenancePerson,
  Na3MaintenanceProject,
  Na3MaintenanceProjectEvent,
} from "@modules/na3-types";
import type { Dayjs } from "dayjs";
import firebase from "firebase";

export type MaintProjectBuilderData = Required<
  Omit<
    Na3MaintenanceProject,
    "eta" | "events" | "id" | "internalId" | "ref" | "team"
  > & {
    author: Na3MaintenancePerson;
    eta: Dayjs;
    team: {
      manager: Na3MaintenancePerson;
      members: (Na3MaintenancePerson | string)[];
    };
  }
>;

export type MaintProjectEventBuilderData = Omit<
  Na3MaintenanceProjectEvent,
  "author" | "timestamp"
> & { author: Na3MaintenancePerson };

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
    eta: firebase.firestore.Timestamp.fromDate(
      data.eta.clone().endOf("day").toDate()
    ),
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

export function buildMaintProjectEvents<T extends MaintProjectEventBuilderData>(
  events: T
): Pick<Na3MaintenanceProjectEvent, "timestamp"> & T;
export function buildMaintProjectEvents<T extends MaintProjectEventBuilderData>(
  events: T[]
): (Pick<Na3MaintenanceProjectEvent, "timestamp"> & T)[];
export function buildMaintProjectEvents<T extends MaintProjectEventBuilderData>(
  events: T | T[]
):
  | (Pick<Na3MaintenanceProjectEvent, "timestamp"> & T)[]
  | (Pick<Na3MaintenanceProjectEvent, "timestamp"> & T) {
  function buildOneEvent(
    config: T
  ): Pick<Na3MaintenanceProjectEvent, "timestamp"> & T {
    return {
      ...config,
      author: {
        uid: config.author.uid,
        displayName: config.author.displayName,
      },
      timestamp: firebase.firestore.Timestamp.now(),
    };
  }

  if (!("length" in events)) {
    return buildOneEvent(events);
  } else {
    return events.map(buildOneEvent);
  }
}
