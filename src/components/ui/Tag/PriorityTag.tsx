import type { PriorityValue } from "@utils";
import { getPriorityValuesConfig } from "@utils";
import { Badge } from "antd";
import React, { useMemo } from "react";

import type { TagProps } from "./Tag";
import { Tag } from "./Tag";

type PriorityTagProps = Pick<TagProps, "marginRight"> & {
  priority: PriorityValue;
  type?: "dot" | "tag";
};

export function PriorityTag({
  priority,
  marginRight,
  type,
}: PriorityTagProps): JSX.Element {
  const config = useMemo(() => getPriorityValuesConfig()[priority], [priority]);

  if (type === "dot") {
    return <Badge status={config.color} text={config.text} />;
  }
  return (
    <Tag color={config.color} marginRight={marginRight}>
      {config.text.toUpperCase()}
    </Tag>
  );
}
