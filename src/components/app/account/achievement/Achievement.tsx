import * as colors from "@ant-design/colors";
import { CheckCircleTwoTone } from "@ant-design/icons";
import type { Na3UserAchievement } from "@modules/na3-types";
import { Badge, Popover } from "antd";
import React, { useMemo } from "react";

import classes from "./Achievement.module.css";
import { AchievementDetails } from "./AchievementDetails";
import { AchievementProgress } from "./AchievementProgress";

type AchievementProps = {
  achievement: Na3UserAchievement;
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
      zIndex: 50,
    }),
    [achievement.color]
  );

  return (
    <Popover
      content={<AchievementDetails achievement={achievement} />}
      key={achievement.id}
      placement="rightTop"
    >
      <Badge
        count={
          achievement.type === "progressive" ? (
            achievement.progress
          ) : achievement.achieved ? (
            <CheckCircleTwoTone
              className={classes.AchievementBadgeIcon}
              twoToneColor="#52c41a"
            />
          ) : (
            0
          )
        }
        offset={[-7, size - 7]}
        overflowCount={
          achievement.type === "progressive"
            ? [...achievement.levels].pop()?.goal
            : undefined
        }
        showZero={achievement.type === "progressive"}
        size="small"
        style={badgeStyle}
      >
        <AchievementProgress
          achievement={achievement}
          progressStrokeWidth={progressStrokeWidth}
          size={size}
        />
      </Badge>
    </Popover>
  );
}
