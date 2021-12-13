import { UserOutlined } from "@ant-design/icons";
import { ANIMATION_FADE_IN, ANIMATION_FASTER, TOOLTIP_SMALL } from "@constants";
import type { AppUser } from "@modules/na3-react";
import type { AvatarProps, TooltipProps } from "antd";
import { Avatar, Tooltip, Typography } from "antd";
import React, { useMemo } from "react";

import classes from "./UserAvatar.module.css";

export type UserAvatarProps = {
  size?: AvatarProps["size"];
  type?: "icon" | "initials";
  user: AppUser;
  wrapperClassName?: string;
  plain?: boolean;
  tooltip?: {
    content: React.ReactNode;
    placement?: TooltipProps["placement"];
    small?: boolean;
    arrowPointAtCenter?: boolean;
  };
};

export function UserAvatar({
  user,
  type: typeProp,
  size,
  wrapperClassName,
  plain,
  tooltip,
}: UserAvatarProps): JSX.Element {
  const type = useMemo(() => typeProp || "icon", [typeProp]);

  const userInitials = useMemo(
    () => user.firstName.trim().toUpperCase()[0],
    [user.firstName]
  );

  const initialsStyle = useMemo(
    () => ({ color: user.style.color }),
    [user.style.color]
  );

  return (
    <Tooltip
      arrowPointAtCenter={tooltip?.arrowPointAtCenter}
      overlayInnerStyle={tooltip?.small ? TOOLTIP_SMALL : undefined}
      placement={tooltip?.placement}
      title={tooltip?.content}
      visible={tooltip ? undefined : false}
    >
      <Avatar
        className={`${ANIMATION_FADE_IN} ${ANIMATION_FASTER} ${
          wrapperClassName || ""
        }`.trim()}
        icon={type === "icon" && <UserOutlined />}
        size={size}
        src={user.photoUrl}
        style={user.style}
      >
        {type === "initials" && (
          <div className={plain ? undefined : classes.AvatarInitialsContainer}>
            {plain ? (
              <Typography.Text style={initialsStyle}>
                {userInitials}
              </Typography.Text>
            ) : (
              <Typography.Title
                className={classes.AvatarInitials}
                level={4}
                style={initialsStyle}
              >
                {userInitials}
              </Typography.Title>
            )}
          </div>
        )}
      </Avatar>
    </Tooltip>
  );
}
