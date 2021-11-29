import { useNa3Departments } from "@modules/na3-react";
import type { Na3Position } from "@modules/na3-types";
import { Tag, Tooltip } from "antd";
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
    <Tooltip
      color={positionDpt?.style.colors.web}
      overlay={
        <small>
          {position.name} <em>({positionDpt?.displayName})</em>
        </small>
      }
      overlayInnerStyle={overlayInnerStyle}
      placement="topLeft"
    >
      <Tag color={positionDpt?.style.colors.web}>{position.shortName}</Tag>
    </Tooltip>
  );
}

const overlayInnerStyle = {
  display: "flex",
  alignItems: "center",
  paddingTop: 0,
  paddingBottom: 0,
  minHeight: 28,
};
