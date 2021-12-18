import type {
  Na3AppDevice,
  Na3StdDocument,
  Na3StdDocumentEvent,
  Na3StdDocumentVersion,
} from "@modules/na3-types";
import { nanoid } from "nanoid";

import type { AppUser, MaybeArray } from "../../types";
import { timestamp } from "../../utils";
import { handleFilterFalsies } from "../arrays";

export type StdDocBuilderData = Required<
  Omit<Na3StdDocument, "events" | "id" | "versions">
> & { currentVersionNumber: number };

export function buildStdDocument(
  data: StdDocBuilderData,
  origin: { device: Na3AppDevice; user: AppUser }
): Omit<Na3StdDocument, "id"> {
  const creationEvent = buildStdDocumentEvents(
    { type: "create", payload: { comment: null } },
    origin
  );

  const doc: Omit<Na3StdDocument, "id"> = {
    code: data.code,
    description: data.description.trim(),
    nextRevisionAt: data.nextRevisionAt,
    permissions: data.permissions,
    timeBetweenRevisionsMs: data.timeBetweenRevisionsMs,
    title: data.title.trim(),
    type: data.type,
    versions: [
      {
        createdAt: timestamp(),
        id: nanoid(),
        number: data.currentVersionNumber,
        events: [creationEvent],
      },
    ],
  };

  return doc;
}

export function buildStdDocumentUrl(
  doc: Na3StdDocument,
  version: Na3StdDocumentVersion
): string {
  return `${doc.id}_v${version.id}`;
}

export type EventBuildConfig = Omit<
  Na3StdDocumentEvent,
  "id" | "origin" | "timestamp"
>;

export function buildStdDocumentEvents(
  event: EventBuildConfig,
  origin: { device: Na3AppDevice; user: AppUser }
): Na3StdDocumentEvent;
export function buildStdDocumentEvents(
  events: EventBuildConfig[],
  origin: { device: Na3AppDevice; user: AppUser }
): Na3StdDocumentEvent[];
export function buildStdDocumentEvents(
  eventOrEvents: MaybeArray<EventBuildConfig>,
  origin: { device: Na3AppDevice; user: AppUser }
): MaybeArray<Na3StdDocumentEvent> | undefined {
  const now = timestamp();

  function buildOneEvent(
    config: EventBuildConfig
  ): Na3StdDocumentEvent | undefined {
    return {
      type: config.type,
      payload: config.payload,
      id: nanoid(),
      origin: { device: origin.device, uid: origin.user.uid },
      timestamp: now,
    };
  }

  if (!("length" in eventOrEvents)) {
    return buildOneEvent(eventOrEvents);
  } else {
    return eventOrEvents.map(buildOneEvent).filter(handleFilterFalsies);
  }
}
