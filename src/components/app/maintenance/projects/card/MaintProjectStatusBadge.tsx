import type { Na3MaintenanceProjectStatus } from "@modules/na3-types";
import { parseStringId } from "@utils";
import type { BadgeProps } from "antd";
import { Badge } from "antd";
import React, { useMemo } from "react";

type MaintProjectStatusBadgeProps = {
  isPredPrev: boolean;
  status: Na3MaintenanceProjectStatus;
};

export function MaintProjectStatusBadge({
  status: projectStatus,
  isPredPrev,
}: MaintProjectStatusBadgeProps): JSX.Element {
  const badgeStatusMap: Record<
    Na3MaintenanceProjectStatus,
    BadgeProps["status"]
  > = useMemo(
    () => ({ finished: "success", late: "error", running: "processing" }),
    []
  );

  return (
    <Badge
      status={badgeStatusMap[projectStatus]}
      text={parseStringId(
        `${isPredPrev ? "maint-pred-prev-" : ""}${projectStatus}`
      )}
    />
  );
}
