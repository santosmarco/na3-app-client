import * as colors from "@ant-design/colors";
import type { AppUserAchievement } from "@modules/na3-react";
import { Badge, Popover, Progress } from "antd";
import React, { useMemo } from "react";

import { AchievementContent } from "./AchievementContent";
import { AchievementDetails } from "./AchievementDetails";
import { AchievementIcon } from "./AchievementIcon";
import { AchievementTitle } from "./AchievementTitle";

type AchievementProps = {
  achievement: AppUserAchievement;
};

export function Achievement({ achievement }: AchievementProps): JSX.Element {
  const { size, progressStrokeWidth } = useMemo(
    () => ({ size: 50, progressStrokeWidth: 6 }),
    []
  );

  const badgeStyle = useMemo(
    () => ({
      backgroundColor: colors[achievement.color][2],
      color: colors[achievement.color][8],
    }),
    [achievement.color]
  );

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
      title={
        <AchievementTitle
          color={achievement.color}
          currentScore={achievement.currentScore}
          isDone={achievement.isDone}
        >
          {achievement.title}
        </AchievementTitle>
      }
    >
      <Badge
        count={achievement.progress}
        offset={[-7, size - 7]}
        overflowCount={[...achievement.levels].pop()?.goal}
        showZero={true}
        size="small"
        style={badgeStyle}
      >
        <Progress
          format={(): JSX.Element => (
            <AchievementContent
              color={achievement.color}
              progressStrokeWidth={progressStrokeWidth}
              size={size}
            >
              <AchievementIcon iconId={achievement.icon} />
            </AchievementContent>
          )}
          percent={achievement.progressPercent * 100}
          strokeWidth={progressStrokeWidth}
          type="circle"
          width={size}
        />
      </Badge>
    </Popover>
  );
}
