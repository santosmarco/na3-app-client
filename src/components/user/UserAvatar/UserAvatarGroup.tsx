import type { AppUser } from "@modules/na3-react";
import { Avatar } from "antd";
import React from "react";

import type { UserAvatarProps } from "./UserAvatar";
import { UserAvatar } from "./UserAvatar";

export type UserAvatarGroupProps<
  T extends AppUser | (Record<PropertyKey, unknown> & { user: AppUser })
> = Pick<UserAvatarProps, "size" | "type" | "wrapperClassName"> & {
  data: T[];
  onTooltipProps?: ((data: T) => UserAvatarProps["tooltip"]) | null;
  maxCount?: number;
};

export function UserAvatarGroup<
  T extends AppUser | (Record<PropertyKey, unknown> & { user: AppUser })
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
          key={"user" in d ? d.user.uid : d.uid}
          plain={true}
          size={size}
          tooltip={onTooltipProps?.(d)}
          type={type}
          user={"user" in d ? d.user : d}
          wrapperClassName={wrapperClassName}
        />
      ))}
    </Avatar.Group>
  );
}
