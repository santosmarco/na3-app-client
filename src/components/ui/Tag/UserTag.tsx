import { useNa3Users } from "@modules/na3-react";
import React, { useMemo } from "react";

import type { TagProps } from "./Tag";
import { Tag } from "./Tag";

type UserTagProps = Pick<TagProps, "marginRight"> & {
  compact?: boolean;
  fallbackDisplayName?: string;
  uid: string;
};

export function UserTag({
  uid,
  fallbackDisplayName,
  marginRight,
  compact,
}: UserTagProps): JSX.Element | null {
  const {
    helpers: { getByUid: getUserByUid },
  } = useNa3Users();

  const user = useMemo(() => getUserByUid(uid), [getUserByUid, uid]);

  if (!user && !fallbackDisplayName) {
    return null;
  }
  return (
    <Tag color={user?.style.webColor} marginRight={marginRight}>
      {(compact ? user?.compactDisplayName : user?.displayName) ||
        fallbackDisplayName}
    </Tag>
  );
}
