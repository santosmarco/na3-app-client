import {
  MAIN_CONTENT_MARGIN,
  PAGE_OFFSET,
  SIDER_COLLAPSED_WIDTH,
} from "@constants";
import { useWindowSize } from "@hooks";
import type { Na3UserAchievement } from "@modules/na3-types";
import { Grid, Space } from "antd";
import React, { useCallback, useMemo } from "react";

import { Achievement } from "./achievement/Achievement";

const ACHIEVEMENT_SIZE = 50;
const ACHIEVEMENT_SPACE = 3;

type AccountAchievementsProps = {
  achievements: Na3UserAchievement[];
};

export function AccountAchievements({
  achievements,
}: AccountAchievementsProps): JSX.Element {
  const breakpoint = Grid.useBreakpoint();

  const windowSize = useWindowSize();

  const { size, perRow, spaceRight, spaceBetween, containerWidth } =
    useMemo(() => {
      const spaceLeft = breakpoint.md
        ? SIDER_COLLAPSED_WIDTH.MD + MAIN_CONTENT_MARGIN.X.MD + PAGE_OFFSET
        : MAIN_CONTENT_MARGIN.X.XS + PAGE_OFFSET;
      const spaceRight = breakpoint.md
        ? spaceLeft - SIDER_COLLAPSED_WIDTH.MD
        : spaceLeft;

      const containerWidth = windowSize.width - spaceLeft - spaceRight;
      const size = ACHIEVEMENT_SIZE;
      const spaceBetween = ACHIEVEMENT_SPACE;
      const perRow = Math.floor(containerWidth / (size + spaceBetween));

      return {
        size,
        perRow,
        spaceLeft,
        spaceRight,
        spaceBetween,
        containerWidth,
      };
    }, [windowSize.width, breakpoint.md]);

  const getPopoverPlacement = useCallback(
    (achievementIdx: number) => {
      if (achievementIdx % perRow < perRow / 2) {
        return "bottomLeft";
      }
      return "bottomRight";
    },
    [perRow]
  );

  const getPopoverMaxWidth = useCallback(
    (achievementIdx: number) => {
      const achievementPlacement = getPopoverPlacement(achievementIdx);

      if (achievementPlacement === "bottomLeft") {
        return (
          containerWidth +
          spaceRight -
          (achievementIdx % (perRow / 2)) * (size + spaceBetween)
        );
      }
      return (
        ((achievementIdx % Math.ceil(perRow / 2)) + Math.ceil(perRow / 2) + 1) *
          (size + spaceBetween) -
        spaceBetween
      );
    },
    [
      getPopoverPlacement,
      size,
      perRow,
      spaceRight,
      spaceBetween,
      containerWidth,
    ]
  );

  return (
    <Space size={spaceBetween} wrap={true}>
      {achievements.map((achievement, idx) => (
        <Achievement
          achievement={achievement}
          key={achievement.id}
          popoverMaxWidth={getPopoverMaxWidth(idx)}
          popoverPlacement={getPopoverPlacement(idx)}
          size={size}
        />
      ))}
    </Space>
  );
}
