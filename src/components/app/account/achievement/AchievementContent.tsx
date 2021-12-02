import * as colors from "@ant-design/colors";
import type { WebColor } from "@modules/na3-types";
import { Avatar } from "antd";
import React, { useMemo } from "react";

import classes from "./AchievementContent.module.css";

type AchievementContentProps = {
  children: React.ReactNode;
  color: WebColor;
  currentLevel: number;
  progressStrokeWidth: number;
  size: number;
};

export function AchievementContent({
  color,
  currentLevel,
  size,
  progressStrokeWidth,
  children,
}: AchievementContentProps): JSX.Element {
  const style = useMemo(
    () => ({
      backgroundColor: colors[color][currentLevel + 2],
      color: colors[color][8],
      marginLeft: progressStrokeWidth / 2,
    }),
    [color, currentLevel, progressStrokeWidth]
  );

  return (
    <Avatar
      className={classes.AchievementContent}
      icon={children}
      size={size - progressStrokeWidth}
      style={style}
    />
  );
}
