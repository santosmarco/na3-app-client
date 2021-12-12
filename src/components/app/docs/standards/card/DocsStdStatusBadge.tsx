import { Tag } from "@components";
import type { Na3StdDocumentStatus } from "@modules/na3-types";
import { parseStringId } from "@utils";
import type { BadgeProps } from "antd";
import { Badge } from "antd";
import React, { useMemo } from "react";

type DocsStdStatusBadgeProps = {
  status: Na3StdDocumentStatus;
  variant?: "badge" | "tag";
};

export function DocsStdStatusBadge({
  status,
  variant,
}: DocsStdStatusBadgeProps): JSX.Element {
  const badgePropsMap: Record<Na3StdDocumentStatus, BadgeProps> = useMemo(
    () => ({
      approved: { status: "success" },
      draft: { status: "default" },
      pending: { status: "warning" },
      rejected: { status: "error" },
    }),
    []
  );

  if (variant === "tag") {
    return (
      <Tag color={badgePropsMap[status].status}>{parseStringId(status)}</Tag>
    );
  }
  return (
    <Badge status={badgePropsMap[status].status} text={parseStringId(status)} />
  );
}
