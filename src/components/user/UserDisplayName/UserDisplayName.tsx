import type { AppUser } from "@modules/na3-react";
import { Typography } from "antd";
import React, { useMemo } from "react";

type UserDisplayNameProps = {
  className?: string;
  fontWeight?: React.CSSProperties["fontWeight"];
  level?: 1 | 2 | 3 | 4 | 5;
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
}: UserDisplayNameProps): JSX.Element {
  const style = useMemo(
    () => ({ fontWeight: fontWeight || 500, marginBottom: 0 }),
    [fontWeight]
  );

  return (
    <small>
      <Typography.Title className={className} level={level} style={style}>
        {`${type === "compact" ? user.compactDisplayName : user.displayName}`
          .trim()
          .toUpperCase()}
      </Typography.Title>
    </small>
  );
}

UserDisplayName.defaultProps = defaultProps;
