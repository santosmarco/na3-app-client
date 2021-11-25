import type { BadgeProps } from "antd";
import { Badge } from "antd";
import React, { useMemo } from "react";

import type { Na3ServiceOrder } from "../../../../../modules/na3-types";

type ServiceOrderStatusBadgeProps = {
  status: Na3ServiceOrder["status"];
};

export function ServiceOrderStatusBadge({
  status: orderStatus,
}: ServiceOrderStatusBadgeProps): JSX.Element {
  const badgePropsMap: Record<Na3ServiceOrder["status"], BadgeProps> = useMemo(
    () => ({
      closed: { status: "success", text: "Encerrada" },
      pending: { status: "warning", text: "Pendente" },
      refused: { status: "error", text: "Recusada" },
      solved: { color: "lime", text: "Solucionada" },
      solving: { status: "processing", text: "Resolvendo" },
    }),
    []
  );

  return (
    <Badge
      color={badgePropsMap[orderStatus].color}
      status={badgePropsMap[orderStatus].status}
      text={badgePropsMap[orderStatus].text}
    />
  );
}
