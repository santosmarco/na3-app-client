import type { Na3UserAchievementIconId } from "@modules/na3-types";
import React from "react";
import { GiAutoRepair, GiCheckMark } from "react-icons/gi";

type AchievementIconProps = {
  iconId: Na3UserAchievementIconId;
};

export function AchievementIcon({ iconId }: AchievementIconProps): JSX.Element {
  switch (iconId) {
    case "gi-auto-repair":
      return <GiAutoRepair />;
    case "gi-check-mark":
      return <GiCheckMark />;
  }
}
