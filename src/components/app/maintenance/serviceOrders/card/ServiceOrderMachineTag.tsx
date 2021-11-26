import { Tag } from "antd";
import React from "react";

import type { Na3Machine } from "../../../../../modules/na3-types";

type ServiceOrderMachineTagProps = {
  fallback: string;
  machine: Na3Machine | undefined;
};

export function ServiceOrderMachineTag({
  machine,
  fallback,
}: ServiceOrderMachineTagProps): JSX.Element {
  return (
    <Tag>
      <small>
        {machine ? (
          <strong>{machine.name.trim()}</strong>
        ) : (
          <em>{fallback.trim().toUpperCase()}</em>
        )}
      </small>
    </Tag>
  );
}
