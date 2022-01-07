import { PriorityTag, Tag, Tooltip } from "@components";
import type {
  Na3Department,
  Na3Machine,
  Na3ServiceOrder,
} from "@modules/na3-types";
import { Space, Typography } from "antd";
import React from "react";
import type { Falsy } from "utility-types";

import classes from "./ServiceOrderCardHeader.module.css";
import { ServiceOrderStatusBadge } from "./ServiceOrderStatusBadge";

type ServiceOrderCardHeaderProps = {
  dpt?: Falsy | Na3Department;
  isStatusHidden?: boolean;
  machine?: Falsy | Na3Machine;
  priority: Na3ServiceOrder["priority"];
  status: Na3ServiceOrder["status"];
};

export function ServiceOrderCardHeader({
  priority,
  status,
  isStatusHidden,
  dpt,
  machine,
}: ServiceOrderCardHeaderProps): JSX.Element {
  return (
    <div className={classes.Header}>
      <Space>
        {!isStatusHidden && <ServiceOrderStatusBadge status={status} />}
        {dpt && (
          <Tag color={dpt.style.colors.web}>
            {dpt.displayName.toUpperCase()}
          </Tag>
        )}
        {machine && (
          <Tooltip title={machine.name}>
            <Tag color="default">
              <Typography.Text italic={true}>M{machine.number}</Typography.Text>
            </Tag>
          </Tooltip>
        )}
      </Space>

      {priority && status === "solving" && <PriorityTag priority={priority} />}
    </div>
  );
}
