import React, { useMemo } from "react";

import { EMPLOYEES } from "../../../constants";
import { Tag } from "./Tag";

type MaintEmployeeTagProps = {
  maintainer: string;
};

export function MaintEmployeeTag({
  maintainer,
}: MaintEmployeeTagProps): JSX.Element {
  const employeeColor = useMemo(
    () =>
      EMPLOYEES.MAINTENANCE.find(
        (employee) =>
          employee.name.toLowerCase().trim() === maintainer.toLowerCase().trim()
      )?.color || "blue",
    [maintainer]
  );

  return <Tag color={employeeColor}>{maintainer}</Tag>;
}
