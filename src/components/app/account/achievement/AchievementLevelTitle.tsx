import { Typography } from "antd";
import React from "react";

import classes from "./AchievementLevelTitle.module.css";

type AchievementLevelTitleProps = {
  children: React.ReactNode;
  subTitle: React.ReactNode;
};

export function AchievementLevelTitle({
  children,
  subTitle,
}: AchievementLevelTitleProps): JSX.Element {
  return (
    <Typography.Title className={classes.LevelTitle} level={5}>
      {children}

      <Typography.Text
        className={classes.LevelSubTitle}
        italic={true}
        type="secondary"
      >
        <small>{subTitle}</small>
      </Typography.Text>
    </Typography.Title>
  );
}
