import type { AppUser } from "@modules/na3-react";
import { Typography } from "antd";
import React from "react";

import classes from "./AccountName.module.css";

type AccountNameProps = {
  user: AppUser;
};

export function AccountName({ user }: AccountNameProps): JSX.Element {
  return (
    <Typography.Title className={classes.AccountName} level={4}>
      {user.displayName.trim().toUpperCase()}
    </Typography.Title>
  );
}
