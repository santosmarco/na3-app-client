import type { AppUser } from "@modules/na3-react";
import { Tooltip, Typography } from "antd";
import React, { useMemo } from "react";

import classes from "./UserDisplayName.module.css";

type UserDisplayNameProps = {
  className?: string;
  fontWeight?: React.CSSProperties["fontWeight"];
  level?: 1 | 2 | 3 | 4 | 5;
  showUidOnHover?: boolean;
  type?: "compact" | "default";
  user: AppUser;
};

const defaultProps = {
  className: undefined,
  level: undefined,
  type: "default",
};

export function UserDisplayName({
  user,
  className,
  level,
  fontWeight,
  type,
  showUidOnHover,
}: UserDisplayNameProps): JSX.Element {
  const style = useMemo(
    () => ({ fontWeight: fontWeight || 500, marginBottom: 0 }),
    [fontWeight]
  );

  return (
    <Tooltip
      overlayClassName={classes.UidTooltip}
      placement="topLeft"
      title={<em>UID: {user.uid}</em>}
      visible={showUidOnHover ? undefined : false}
    >
      <small>
        <Typography.Title className={className} level={level} style={style}>
          {`${type === "compact" ? user.compactDisplayName : user.displayName}`
            .trim()
            .toUpperCase()}
        </Typography.Title>
      </small>
    </Tooltip>
  );
}

UserDisplayName.defaultProps = defaultProps;
