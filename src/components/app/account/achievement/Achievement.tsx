import * as colors from "@ant-design/colors";
import { CheckCircleTwoTone } from "@ant-design/icons";
import type { Na3UserAchievement } from "@modules/na3-types";
import { getStatusColor } from "@utils";
import type { PopoverProps } from "antd";
import { Badge, Popover } from "antd";
import React, { useMemo } from "react";

import classes from "./Achievement.module.css";
import { AchievementDetails } from "./AchievementDetails";
import { AchievementProgress } from "./AchievementProgress";

type AchievementProps = {
  achievement: Na3UserAchievement;
  popoverArrowPointAtCenter?: boolean;
  popoverMaxWidth?: number;
  popoverPlacement?: PopoverProps["placement"];
  progressStrokeWidth?: number;
  size?: number;
};

export function Achievement({
  achievement,
  popoverPlacement,
  popoverArrowPointAtCenter,
  popoverMaxWidth,
  size: sizeProp,
  progressStrokeWidth: progressStrokeWidthProp,
}: AchievementProps): JSX.Element {
  const { size, progressStrokeWidth } = useMemo(() => {
    const size = sizeProp || 50;
    const progressStrokeWidth = progressStrokeWidthProp || 6;

    return { size, progressStrokeWidth };
  }, [sizeProp, progressStrokeWidthProp]);

  const detailsStyle = useMemo(() => {
    const width = popoverMaxWidth
      ? popoverMaxWidth > 350
        ? 350
        : popoverMaxWidth
      : undefined;

    return { width, minWidth: width, maxWidth: width };
  }, [popoverMaxWidth]);

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
      arrowPointAtCenter={popoverArrowPointAtCenter}
      autoAdjustOverflow={false}
      content={
        <AchievementDetails achievement={achievement} style={detailsStyle} />
      }
      key={achievement.id}
      placement={popoverPlacement || "bottomLeft"}
    >
      <Badge
        count={
          achievement.type === "progressive" ? (
            achievement.totalProgress
          ) : achievement.achieved ? (
            <CheckCircleTwoTone
              className={classes.AchievementBadgeIcon}
              twoToneColor={getStatusColor("success")}
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
