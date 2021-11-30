import type { Na3StdDocumentType } from "@modules/na3-types";
import { Badge } from "antd";
import React from "react";

import type { TagProps } from "./Tag";
import { Tag } from "./Tag";

type DocStdTypeTagProps = Pick<TagProps, "marginRight"> & {
  short?: boolean;
  type: Na3StdDocumentType;
  variant?: "dot" | "tag";
};

export function DocStdTypeTag({
  type,
  variant,
  short,
  marginRight,
}: DocStdTypeTagProps): JSX.Element {
  if (variant === "dot") {
    return (
      <Badge color={type.color} text={type[short ? "shortName" : "name"]} />
    );
  }
  return (
    <Tag color={type.color} marginRight={marginRight}>
      {type[short ? "shortName" : "name"].toUpperCase()}
    </Tag>
  );
}
