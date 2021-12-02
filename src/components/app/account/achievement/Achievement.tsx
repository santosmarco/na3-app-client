import type { AppUserAchievement } from "@modules/na3-react";
import { Popover, Progress } from "antd";
import React from "react";

import { AchievementContent } from "./AchievementContent";
import { AchievementDetails } from "./AchievementDetails";
import { AchievementIcon } from "./AchievementIcon";

type AchievementProps = {
  achievement: AppUserAchievement;
};

const SIZE = 80;
const PROGRESS_STROKE_WIDTH = 10;

export function Achievement({ achievement }: AchievementProps): JSX.Element {
  return (
    <Popover
      content={
        <AchievementDetails
          currentLevel={achievement.currentLevel}
          description={achievement.description}
          levelDescriptor={achievement.levelDescriptor}
          levels={achievement.levels}
          progress={achievement.progress}
        />
      }
      key={achievement.id}
      placement="rightTop"
      title={achievement.title}
    >
      <Progress
        format={(): JSX.Element => (
          <AchievementContent
            color={achievement.color}
            currentLevel={achievement.currentLevel}
            progressStrokeWidth={PROGRESS_STROKE_WIDTH}
            size={SIZE}
          >
            <AchievementIcon iconId={achievement.icon} />
          </AchievementContent>
        )}
        percent={achievement.progressPercent * 100}
        strokeWidth={PROGRESS_STROKE_WIDTH}
        type="circle"
        width={SIZE}
      />
    </Popover>
  );
}
