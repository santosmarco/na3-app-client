import dayjs from "dayjs";
import { nanoid } from "nanoid";

import type {
  Na3AppDevice,
  Na3ServiceOrder,
  Na3ServiceOrderEvent,
} from "../../../na3-types";

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
  device: Na3AppDevice
): Na3ServiceOrder {
  const creationEvent = buildServiceOrderEvents(
    { type: "ticketCreated" },
    device
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
    version: "web-" + device.os.version.trim(),
  };

  return serviceOrder;
}

type EventBuildConfig = {
  payload?: Na3ServiceOrderEvent["payload"];
  type: Na3ServiceOrderEvent["type"];
};

export function buildServiceOrderEvents(
  event: EventBuildConfig,
  originDevice: Na3AppDevice
): Na3ServiceOrderEvent;
export function buildServiceOrderEvents(
  events: EventBuildConfig[],
  originDevice: Na3AppDevice
): Na3ServiceOrderEvent[];
export function buildServiceOrderEvents(
  eventOrEvents: EventBuildConfig | EventBuildConfig[],
  originDevice: Na3AppDevice
): Na3ServiceOrderEvent | Na3ServiceOrderEvent[] {
  function buildOneEvent(config: EventBuildConfig): Na3ServiceOrderEvent {
    return {
      device: originDevice,
      id: nanoid(),
      payload: config.payload || null,
      timestamp: dayjs().format(),
      type: config.type,
    };
  }

  if (!("length" in eventOrEvents)) {
    return buildOneEvent(eventOrEvents);
  } else {
    return eventOrEvents.map(buildOneEvent);
  }
}
