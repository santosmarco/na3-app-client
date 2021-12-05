import type { Na3UserAchievementIconId } from "@modules/na3-types";
import React from "react";
import { FaCheckDouble, FaCogs, FaHeart } from "react-icons/fa";

type AchievementIconProps = {
  iconId: Na3UserAchievementIconId;
};

export function AchievementIcon({ iconId }: AchievementIconProps): JSX.Element {
  switch (iconId) {
    case "check":
      return <FaCheckDouble />;
    case "heart":
      return <FaHeart />;
    case "repair":
      return <FaCogs />;
  }
}
