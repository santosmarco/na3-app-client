import { UserOutlined } from "@ant-design/icons";
import type { AppUser } from "@modules/na3-react";
import type { AvatarProps } from "antd";
import { Avatar, Typography } from "antd";
import React, { useMemo } from "react";

import classes from "./UserAvatar.module.css";

type UserAvatarProps = {
  size?: AvatarProps["size"];
  type?: "icon" | "initials";
  user: AppUser;
  wrapperClassName?: string;
};

const defaultProps = {
  type: "icon",
  size: undefined,
  wrapperClassName: undefined,
};

export function UserAvatar({
  user,
  type,
  size,
  wrapperClassName,
}: UserAvatarProps): JSX.Element {
  const initialsStyle = useMemo(
    () => ({ color: user.style.color }),
    [user.style.color]
  );

  return (
    <Avatar
      className={wrapperClassName}
      icon={type === "icon" && <UserOutlined />}
      size={size}
      src={user.photoUrl}
      style={user.style}
    >
      {type === "initials" && (
        <div className={classes.AvatarInitialsContainer}>
          <Typography.Title
            className={classes.AvatarInitials}
            level={4}
            style={initialsStyle}
          >
            {user.firstName.trim().toUpperCase()[0]}
          </Typography.Title>
        </div>
      )}
    </Avatar>
  );
}

UserAvatar.defaultProps = defaultProps;
