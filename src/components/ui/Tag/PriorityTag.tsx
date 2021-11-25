import React from "react";

import { PRIORITY_VALUES } from "../../../constants";
import type { TagProps } from "./Tag";
import { Tag } from "./Tag";

type PriorityTagProps = Pick<TagProps, "marginRight"> & {
  priority: keyof typeof PRIORITY_VALUES;
};

export function PriorityTag({
  priority,
  marginRight,
}: PriorityTagProps): JSX.Element {
  return (
    <Tag color={PRIORITY_VALUES[priority].color} marginRight={marginRight}>
      {PRIORITY_VALUES[priority].text}
    </Tag>
  );
}
