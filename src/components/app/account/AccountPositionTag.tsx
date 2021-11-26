import { Tag } from "@components";
import { useNa3Departments } from "@modules/na3-react";
import type { Na3Position } from "@modules/na3-types";
import React, { useMemo } from "react";

type AccountPositionTagProps = {
  position: Na3Position;
};

export function AccountPositionTag({
  position,
}: AccountPositionTagProps): JSX.Element {
  const departments = useNa3Departments();

  const positionDpt = useMemo(
    () => departments.helpers.getById(position.departmentId),
    [departments.helpers, position.departmentId]
  );

  return (
    <Tag
      color={positionDpt?.style.colors.background}
      textColor={positionDpt?.style.colors.text}
    >
      {position.shortName}
    </Tag>
  );
}
