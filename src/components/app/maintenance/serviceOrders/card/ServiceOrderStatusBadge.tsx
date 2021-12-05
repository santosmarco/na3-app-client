import type { Na3ServiceOrder } from "@modules/na3-types";
import { parseStringId } from "@utils";
import type { BadgeProps } from "antd";
import { Badge } from "antd";
import React, { useMemo } from "react";

type ServiceOrderStatusBadgeProps = {
  status: Na3ServiceOrder["status"];
};

export function ServiceOrderStatusBadge({
  status: orderStatus,
}: ServiceOrderStatusBadgeProps): JSX.Element {
  const badgePropsMap: Record<Na3ServiceOrder["status"], BadgeProps> = useMemo(
    () => ({
      closed: { status: "success" },
      pending: { status: "warning" },
      refused: { status: "error" },
      solved: { color: "lime" },
      solving: { status: "processing" },
    }),
    []
  );

  return (
    <Badge
      color={badgePropsMap[orderStatus].color}
      status={badgePropsMap[orderStatus].status}
      text={parseStringId(orderStatus)}
    />
  );
}
