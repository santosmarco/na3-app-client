import { Badge } from "antd";
import React, { useMemo } from "react";

import type { TagProps } from "./Tag";
import { Tag } from "./Tag";

type Priority = "high" | "low" | "medium";

type PriorityTagProps = Pick<TagProps, "marginRight"> & {
  priority: Priority;
  type?: "dot" | "tag";
};

export const priorityValues: Record<
  Priority,
  { color: "error" | "success" | "warning"; text: string }
> = {
  high: { color: "error", text: "Alta" },
  low: { color: "success", text: "Baixa" },
  medium: { color: "warning", text: "Média" },
};

export function PriorityTag({
  priority,
  marginRight,
  type,
}: PriorityTagProps): JSX.Element {
  const config = useMemo(
    () => ({
      color: priorityValues[priority].color,
      text: priorityValues[priority].text,
    }),
    [priority]
  );

  if (type === "dot") {
    return <Badge status={config.color} text={config.text} />;
  }
  return (
    <Tag color={config.color} marginRight={marginRight}>
      {config.text.toUpperCase()}
    </Tag>
  );
}
