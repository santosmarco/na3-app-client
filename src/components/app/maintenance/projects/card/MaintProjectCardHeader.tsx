import { PriorityTag } from "@components";
import type {
  Na3MaintenanceProject,
  Na3MaintenanceProjectStatus,
} from "@modules/na3-types";
import React from "react";

import classes from "./MaintProjectCardHeader.module.css";
import { MaintProjectStatusBadge } from "./MaintProjectStatusBadge";

type MaintProjectCardHeaderProps = {
  isPredPrev: boolean;
  priority: Na3MaintenanceProject["priority"];
  status: Na3MaintenanceProjectStatus;
};

export function MaintProjectCardHeader({
  priority,
  status,
  isPredPrev,
}: MaintProjectCardHeaderProps): JSX.Element {
  return (
    <div className={classes.Header}>
      <MaintProjectStatusBadge isPredPrev={isPredPrev} status={status} />

      {status !== "finished" && <PriorityTag priority={priority} />}
    </div>
  );
}
