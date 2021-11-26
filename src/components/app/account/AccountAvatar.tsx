import type { AppUser } from "@modules/na3-react";
import { Avatar } from "antd";
import React from "react";

type AccountAvatarProps = {
  user: AppUser;
};

export function AccountAvatar({ user }: AccountAvatarProps): JSX.Element {
  return (
    <Avatar size="large" src={user.photoUrl} style={user.style}>
      <strong>{user.firstName.trim().toUpperCase()[0]}</strong>
    </Avatar>
  );
}
