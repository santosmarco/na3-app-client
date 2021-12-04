import type { Na3UserAchievement } from "@modules/na3-types";
import { Space } from "antd";
import React from "react";

import { Achievement } from "./achievement/Achievement";

type AccountAchievementsProps = {
  achievements: Na3UserAchievement[];
};

export function AccountAchievements({
  achievements,
}: AccountAchievementsProps): JSX.Element {
  return (
    <Space size={3} wrap={true}>
      {achievements.map((achievement) => (
        <Achievement achievement={achievement} key={achievement.id} />
      ))}
    </Space>
  );
}
