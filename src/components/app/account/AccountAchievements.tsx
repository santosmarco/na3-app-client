import { Typography } from "antd";
import React from "react";

import classes from "./AccountAchievements.module.css";

export function AccountAchievements(): JSX.Element {
  return (
    <div className={classes.AccountAchievements}>
      <Typography.Text italic={true} type="secondary">
        Por enquanto não há conquistas.
      </Typography.Text>
    </div>
  );
}
