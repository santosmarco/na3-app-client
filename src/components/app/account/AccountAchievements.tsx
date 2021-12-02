import type { AppUserAchievement } from "@modules/na3-react";
import { Space } from "antd";
import React from "react";

import { Achievement } from "./achievement/Achievement";

type AccountAchievementsProps = {
  achievements: AppUserAchievement[];
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
