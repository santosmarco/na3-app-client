import type { Na3UserAchievement } from "@modules/na3-types";
import { Progress } from "antd";
import React, { useCallback } from "react";

import { AchievementContent } from "./AchievementContent";
import { AchievementIcon } from "./AchievementIcon";

type AchievementProgressProps = {
  achievement: Na3UserAchievement;
  progressStrokeWidth: number;
  size: number;
};

export function AchievementProgress({
  achievement: { color, icon, achieved, ...achievement },
  size,
  progressStrokeWidth,
}: AchievementProgressProps): JSX.Element {
  const handleAchievementContentRender = useCallback(
    () => (
      <AchievementContent
        color={color}
        progressStrokeWidth={progressStrokeWidth}
        size={size}
      >
        <AchievementIcon iconId={icon} />
      </AchievementContent>
    ),
    [color, progressStrokeWidth, size, icon]
  );

  return (
    <Progress
      format={handleAchievementContentRender}
      percent={
        achievement.type === "one-time"
          ? achieved
            ? 100
            : 0
          : achievement.totalProgressPercent
      }
      strokeWidth={progressStrokeWidth}
      type="circle"
      width={size}
    />
  );
}
