import { useNa3Users } from "@modules/na3-react";
import type { Na3MaintenancePerson } from "@modules/na3-types";
import { getMaintPersonDisplayName } from "@utils";
import React, { useMemo } from "react";

import { Tag } from "./Tag";

type MaintEmployeeTagProps = {
  isLeader?: boolean;
  maintainer: Na3MaintenancePerson | string;
};

export function MaintEmployeeTag({
  maintainer,
  isLeader,
}: MaintEmployeeTagProps): JSX.Element {
  const {
    helpers: { getByUid: getUserByUid },
  } = useNa3Users();

  const tagColor = useMemo(() => {
    if (typeof maintainer === "string") return;
    return getUserByUid(maintainer.uid)?.style.webColor;
  }, [maintainer, getUserByUid]);

  return (
    <Tag color={tagColor || (isLeader && "blue") || undefined}>
      {getMaintPersonDisplayName(maintainer)}
    </Tag>
  );
}
