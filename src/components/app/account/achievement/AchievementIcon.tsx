import type { Na3UserAchievementIconId } from "@modules/na3-types";
import React from "react";
import { FaHeart } from "react-icons/fa";
import { GiAutoRepair, GiCheckMark } from "react-icons/gi";

type AchievementIconProps = {
  iconId: Na3UserAchievementIconId;
};

export function AchievementIcon({ iconId }: AchievementIconProps): JSX.Element {
  switch (iconId) {
    case "repair":
      return <GiAutoRepair />;
    case "check":
      return <GiCheckMark />;
    case "heart":
      return <FaHeart />;
  }
}
