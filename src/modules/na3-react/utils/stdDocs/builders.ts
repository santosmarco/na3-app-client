import type {
  Na3AppDevice,
  Na3StdDocument,
  Na3StdDocumentEvent,
} from "@modules/na3-types";
import { nanoid } from "nanoid";

import type { AppUser, MaybeArray } from "../../types";
import { removeNullables, timestamp } from "../../utils";

export type StdDocBuilderData = Required<
  Omit<Na3StdDocument, "events" | "id" | "versions">
> & { currentVersionNumber: number };

export function buildStdDocument(
  data: StdDocBuilderData,
  origin: { device: Na3AppDevice; user: AppUser }
): Omit<Na3StdDocument, "id"> {
  const creationEvent = buildStdDocumentEvents(
    { type: "create", payload: null },
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
        approvedAt: null,
        approvedByUid: null,
        createdAt: timestamp(),
        id: nanoid(),
        number: data.currentVersionNumber,
      },
    ],
    events: [creationEvent],
  };

  return doc;
}

type EventBuildConfig<T extends Na3StdDocumentEvent> = Omit<
  T,
  "id" | "origin" | "timestamp"
>;

export function buildStdDocumentEvents<T extends Na3StdDocumentEvent>(
  event: EventBuildConfig<T>,
  origin: { device: Na3AppDevice; user: AppUser }
): Na3StdDocumentEvent;
export function buildStdDocumentEvents<T extends Na3StdDocumentEvent>(
  events: EventBuildConfig<T>[],
  origin: { device: Na3AppDevice; user: AppUser }
): Na3StdDocumentEvent[];
export function buildStdDocumentEvents<T extends Na3StdDocumentEvent>(
  eventOrEvents: MaybeArray<EventBuildConfig<T>>,
  origin: { device: Na3AppDevice; user: AppUser }
): MaybeArray<Na3StdDocumentEvent> | undefined {
  const now = timestamp();

  function buildOneEvent(
    config: EventBuildConfig<T>
  ): Na3StdDocumentEvent | undefined {
    const id = nanoid();
    switch (config.type) {
      case "create":
        return {
          type: "create",
          payload: null,
          id,
          origin: { device: origin.device, uid: origin.user.uid },
          timestamp: now,
        };
    }
  }

  if (!("length" in eventOrEvents)) {
    return buildOneEvent(eventOrEvents);
  } else {
    return removeNullables(eventOrEvents.map(buildOneEvent));
  }
}
