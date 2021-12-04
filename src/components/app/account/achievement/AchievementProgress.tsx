import type { Na3UserAchievement } from "@modules/na3-types";
import { Progress } from "antd";
import React from "react";

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
  return (
    <Progress
      format={(): JSX.Element => (
        <AchievementContent
          color={color}
          progressStrokeWidth={progressStrokeWidth}
          size={size}
        >
          <AchievementIcon iconId={icon} />
        </AchievementContent>
      )}
      percent={
        achievement.type === "one-time"
          ? achieved
            ? 100
            : 0
          : achievement.progressPercent * 100
      }
      strokeWidth={progressStrokeWidth}
      type="circle"
      width={size}
    />
  );
}
