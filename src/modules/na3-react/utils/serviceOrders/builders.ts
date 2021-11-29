import type {
  Na3AppDevice,
  Na3ServiceOrder,
  Na3ServiceOrderEvent,
} from "@modules/na3-types";
import { nanoid } from "nanoid";

import type { AppUser } from "../../types";
import { timestamp } from "../../utils";
import { sanitizeUserToMaintPerson } from "../firebase/firestore";

export type ServiceOrderBuilderData = Required<
  Pick<
    Na3ServiceOrder,
    | "additionalInfo"
    | "cause"
    | "description"
    | "dpt"
    | "interruptions"
    | "machine"
    | "maintenanceType"
    | "team"
    | "username"
  >
>;

export function buildServiceOrder(
  id: string,
  data: ServiceOrderBuilderData,
  origin: { device: Na3AppDevice; user: AppUser }
): Na3ServiceOrder {
  const creationEvent = buildServiceOrderEvents(
    { type: "ticketCreated" },
    origin
  );
  const serviceOrder: Na3ServiceOrder = {
    additionalInfo: data.additionalInfo?.trim(),
    cause: data.cause.trim(),
    createdAt: creationEvent.timestamp,
    description: data.description.trim(),
    dpt: data.dpt.trim(),
    events: [creationEvent],
    id: id.trim(),
    interruptions: data.interruptions,
    machine: data.machine.trim(),
    maintenanceType: data.maintenanceType.trim(),
    solutionSteps: [],
    status: "pending",
    team: data.team.trim(),
    username: data.username.trim(),
    version: "web-" + origin.device.os.version.trim(),
  };

  return serviceOrder;
}

type EventBuildConfig = {
  payload?: Na3ServiceOrderEvent["payload"];
  type: Na3ServiceOrderEvent["type"];
};

export function buildServiceOrderEvents(
  event: EventBuildConfig,
  origin: { device: Na3AppDevice; user: AppUser }
): Na3ServiceOrderEvent;
export function buildServiceOrderEvents(
  events: EventBuildConfig[],
  origin: { device: Na3AppDevice; user: AppUser }
): Na3ServiceOrderEvent[];
export function buildServiceOrderEvents(
  eventOrEvents: EventBuildConfig | EventBuildConfig[],
  origin: { device: Na3AppDevice; user: AppUser }
): Na3ServiceOrderEvent | Na3ServiceOrderEvent[] {
  function buildOneEvent(config: EventBuildConfig): Na3ServiceOrderEvent {
    return {
      device: origin.device,
      id: nanoid(),
      payload: config.payload || null,
      timestamp: timestamp(),
      type: config.type,
      user: sanitizeUserToMaintPerson(origin.user),
    };
  }

  if (!("length" in eventOrEvents)) {
    return buildOneEvent(eventOrEvents);
  } else {
    return eventOrEvents.map(buildOneEvent);
  }
}
