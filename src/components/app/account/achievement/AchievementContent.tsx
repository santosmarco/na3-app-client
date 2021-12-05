import * as colors from "@ant-design/colors";
import type { WebColor } from "@modules/na3-types";
import { Avatar } from "antd";
import React, { useMemo } from "react";

import classes from "./AchievementContent.module.css";

type AchievementContentProps = {
  children: React.ReactNode;
  color: WebColor;
  progressStrokeWidth: number;
  size: number;
};

export function AchievementContent({
  color,
  size,
  progressStrokeWidth,
  children,
}: AchievementContentProps): JSX.Element {
  const style = useMemo(
    () => ({
      backgroundColor: colors[color][2],
      color: colors[color][8],
      width: size - progressStrokeWidth,
      height: size - progressStrokeWidth,
      marginLeft: progressStrokeWidth / 2,
    }),
    [color, size, progressStrokeWidth]
  );

  return (
    <Avatar
      className={classes.AchievementContent}
      icon={children}
      style={style}
    />
  );
}
