import type { Na3MaintenanceProjectStatus } from "@modules/na3-types";
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
  const badgePropsMap: Record<Na3MaintenanceProjectStatus, BadgeProps> =
    useMemo(
      () => ({
        finished: {
          status: "success",
          text: `${isPredPrev ? "Finalizada" : "Finalizado"}`,
        },
        late: {
          status: "error",
          text: `${isPredPrev ? "Atrasada" : "Atrasado"}`,
        },
        running: { status: "processing", text: "Em execução" },
      }),
      [isPredPrev]
    );

  return (
    <Badge
      status={badgePropsMap[projectStatus].status}
      text={badgePropsMap[projectStatus].text}
    />
  );
}
