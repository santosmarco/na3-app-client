import { Timeline } from "@components";
import type { Na3MaintenanceProjectEvent } from "@modules/na3-types";
import { parseStringId } from "@utils";
import dayjs from "dayjs";
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
        body: "message" in ev && ev.message,
        color:
          ev.type === "complete"
            ? "green"
            : ev.type === "create"
            ? "cyan"
            : undefined,
        postTitle: dayjs(ev.timestamp.toDate()).format("DD/MM/YY HH:mm"),
        title: parseStringId(
          `maint-${isPredPrev ? "predprev" : "project"}-${ev.type}`
        ),
      }))}
    />
  );
}
