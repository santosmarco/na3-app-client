import { useNa3Departments } from "@modules/na3-react";
import type { Na3Position } from "@modules/na3-types";
import type { MaybeArray } from "@types";
import type { TooltipProps } from "antd";
import { Space } from "antd";
import { Tag, Tooltip } from "antd";
import { isArray } from "lodash";
import { nanoid } from "nanoid";
import React, { useMemo } from "react";

type UserPositionTagProps = {
  direction?: "horizontal" | "vertical";
  position: MaybeArray<Na3Position>;
  tooltipPlacement?: TooltipProps["placement"];
};

export function UserPositionTag({
  position,
  tooltipPlacement,
  direction,
}: UserPositionTagProps): JSX.Element {
  const departments = useNa3Departments();

  const positionsArr = useMemo(
    () => (isArray(position) ? position : [position]),
    [position]
  );

  const positionDpts = useMemo(
    () =>
      positionsArr.map((pos) => departments.helpers.getById(pos.departmentId)),
    [positionsArr, departments.helpers]
  );

  return (
    <Space
      direction={direction || "horizontal"}
      size={direction === "vertical" ? 4 : 0}
    >
      {positionsArr.map((position, idx) => (
        <Tooltip
          color={positionDpts[idx]?.style.colors.web}
          key={nanoid()}
          overlay={
            <>
              {position.name} <em>({positionDpts[idx]?.displayName})</em>
            </>
          }
          placement={tooltipPlacement || "topLeft"}
        >
          <Tag color={positionDpts[idx]?.style.colors.web}>
            {position.shortName}
          </Tag>
        </Tooltip>
      ))}
    </Space>
  );
}
