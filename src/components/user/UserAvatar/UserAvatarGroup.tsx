import type { AppUser } from "@modules/na3-react";
import { Avatar } from "antd";
import React from "react";

import type { UserAvatarProps } from "./UserAvatar";
import { UserAvatar } from "./UserAvatar";

type UserAvatarGroupProps<
  T extends ({ user: AppUser } & Record<PropertyKey, unknown>) | AppUser
> = Pick<UserAvatarProps, "size" | "type" | "wrapperClassName"> & {
  data: T[];
  onTooltipProps?: ((data: T) => UserAvatarProps["tooltip"]) | null;
  maxCount?: number;
};

export function UserAvatarGroup<
  T extends ({ user: AppUser } & Record<PropertyKey, unknown>) | AppUser
>({
  data,
  size,
  type,
  wrapperClassName,
  onTooltipProps,
  maxCount,
}: UserAvatarGroupProps<T>): JSX.Element {
  return (
    <Avatar.Group maxCount={maxCount}>
      {data.map((d) => (
        <UserAvatar
          user={"user" in d ? d.user : d}
          size={size}
          type={type}
          wrapperClassName={wrapperClassName}
          plain={true}
          tooltip={onTooltipProps?.(d)}
        />
      ))}
    </Avatar.Group>
  );
}
