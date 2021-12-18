import { Timeline } from "@components";
import type {
  Na3MaintenancePerson,
  Na3MaintenanceProjectChangeKey,
  Na3MaintenanceProjectEvent,
} from "@modules/na3-types";
import {
  isArray,
  isMaintProjectEditEventChangeKey,
  parseStringId,
  timestampToStr,
} from "@utils";
import dayjs from "dayjs";
import type { Timestamp } from "firebase/firestore";
import { nanoid } from "nanoid";
import React from "react";

type MaintProjectTimelineProps = {
  events: Na3MaintenanceProjectEvent[];
  isPredPrev: boolean;
};

export function MaintProjectTimeline({
  events,
  isPredPrev,
}: MaintProjectTimelineProps): JSX.Element {
  return (
    <Timeline
      items={events.map((ev) => ({
        body:
          "message" in ev
            ? ev.message
            : ev.type === "edit"
            ? getEditEventBody(ev)
            : ev.type === "create"
            ? `em ${timestampToStr(ev.timestamp)}`
            : undefined,
        color:
          ev.type === "complete"
            ? "green"
            : ev.type === "create"
            ? "cyan"
            : undefined,
        postTitle:
          ev.type !== "create" &&
          dayjs(ev.timestamp.toDate()).format("DD/MM/YY HH:mm"),
        title: parseStringId(
          `maint-${isPredPrev ? "predprev" : "project"}-${ev.type}`
        ),
        info: {
          type: "tooltip",
          content:
            typeof ev.author === "string"
              ? ev.author.trim()
              : ev.author.displayName.trim(),
        },
      }))}
    />
  );
}

function getEditEventBody(ev: Na3MaintenanceProjectEvent): React.ReactNode {
  if (!("changes" in ev)) {
    return;
  }

  return Object.entries(ev.changes).map(
    ([key, change]) =>
      isMaintProjectEditEventChangeKey(key) && (
        <div key={nanoid()}>
          <strong>• {parseStringId(key)}:</strong>{" "}
          {formatEditEventChange(key, change.old)} →{" "}
          {formatEditEventChange(key, change.new)}
        </div>
      )
  );
}

function formatEditEventChange(
  key: Na3MaintenanceProjectChangeKey,
  change:
    | Array<Na3MaintenancePerson | string>
    | Na3MaintenancePerson
    | Timestamp
    | string
): React.ReactNode {
  if (typeof change === "string") {
    // If it's a string, parse it first to appropriately handle changes in
    // priority.
    const parsedChange = parseStringId(change);

    if (key === "title" || key === "description") {
      // If it's a title or description change, return it in italics.
      return <em>{parsedChange}</em>;
    }
    // Else, just return it.
    return parsedChange;
  }
  if (isArray(change)) {
    // If it's an array, recursively format each element, then join.
    return change.map((ch) => formatEditEventChange(key, ch)).join(", ");
  }
  if (typeof change === "object" && "displayName" in change) {
    // If it's a Na3MaintenancePerson, return the displayName.
    return change.displayName;
  }
  // Else, it's a Timestamp. Return it in a human-readable format.
  return timestampToStr(change, { includeTime: false });
}
