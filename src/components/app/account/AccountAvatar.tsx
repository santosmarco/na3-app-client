import type { AppUser } from "@modules/na3-react";
import { Avatar, Typography } from "antd";
import React from "react";

import classes from "./AccountAvatar.module.css";

type AccountAvatarProps = {
  className?: string;
  user: AppUser;
};

const defaultProps = {
  className: undefined,
};

export function AccountAvatar({
  user,
  className,
}: AccountAvatarProps): JSX.Element {
  return (
    <Avatar
      className={className}
      size="large"
      src={user.photoUrl}
      style={user.style}
    >
      <div className={classes.AvatarContent}>
        <Typography.Title className={classes.AvatarInitials} level={4}>
          {user.firstName.trim().toUpperCase()[0]}
        </Typography.Title>
      </div>
    </Avatar>
  );
}

AccountAvatar.defaultProps = defaultProps;
