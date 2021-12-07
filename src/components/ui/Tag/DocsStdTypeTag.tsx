import { useNa3StdDocs } from "@modules/na3-react";
import type {
  Na3StdDocumentType,
  Na3StdDocumentTypeId,
} from "@modules/na3-types";
import { Badge } from "antd";
import React, { useMemo } from "react";

import type { TagProps } from "./Tag";
import { Tag } from "./Tag";

type DocsStdTypeTagProps = Pick<TagProps, "marginRight"> & {
  short?: boolean;
  type: Na3StdDocumentType | Na3StdDocumentTypeId;
  variant?: "dot" | "tag";
};

export function DocsStdTypeTag({
  type,
  variant,
  short,
  marginRight,
}: DocsStdTypeTagProps): JSX.Element {
  const {
    helpers: { getTypeFromTypeId: getDocTypeFromTypeId },
  } = useNa3StdDocs();

  const parsedType = useMemo((): Na3StdDocumentType => {
    if (typeof type === "string") {
      return getDocTypeFromTypeId(type);
    }
    return type;
  }, [type, getDocTypeFromTypeId]);

  if (variant === "dot") {
    return (
      <Badge
        color={parsedType.color}
        text={parsedType[short ? "shortName" : "name"]}
      />
    );
  }
  return (
    <Tag color={parsedType.color} marginRight={marginRight}>
      {parsedType[short ? "shortName" : "name"].toUpperCase()}
    </Tag>
  );
}
