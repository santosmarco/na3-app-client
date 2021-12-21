import { useNa3Departments } from "@modules/na3-react";
import type { Na3Position } from "@modules/na3-types";
import type { MaybeArray } from "@types";
import type { TooltipProps } from "antd";
import { Space, Tag, Tooltip } from "antd";
import { isArray } from "lodash";
import { nanoid } from "nanoid";
import React, { useMemo } from "react";
import type { LiteralUnion } from "type-fest";

import classes from "./UserPositionTag.module.css";

type UserPositionTagProps = {
  direction?: "horizontal" | "vertical";
  noWrap?: boolean;
  position: MaybeArray<Na3Position>;
  space?: LiteralUnion<"large" | "middle" | "small", number>;
  tooltipPlacement?: TooltipProps["placement"];
};

export function UserPositionTag({
  position,
  tooltipPlacement = "topLeft",
  direction = "horizontal",
  space = 4,
  noWrap = false,
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
    <Space direction={direction} size={space} wrap={!noWrap}>
      {positionsArr.map((position, idx) => (
        <Tooltip
          color={positionDpts[idx]?.style.colors.web}
          key={nanoid()}
          overlay={
            <>
              {position.name} <em>({positionDpts[idx]?.displayName})</em>
            </>
          }
          placement={tooltipPlacement}
        >
          <Tag
            className={classes.Tag}
            color={positionDpts[idx]?.style.colors.web}
          >
            {position.shortName}
          </Tag>
        </Tooltip>
      ))}
    </Space>
  );
}
