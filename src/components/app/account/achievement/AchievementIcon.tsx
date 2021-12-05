import type { Na3UserAchievementIconId } from "@modules/na3-types";
import React from "react";
import { FaCheck, FaCogs, FaHeart, FaUserCog } from "react-icons/fa";

type AchievementIconProps = {
  iconId: Na3UserAchievementIconId;
};

export function AchievementIcon({ iconId }: AchievementIconProps): JSX.Element {
  switch (iconId) {
    case "check":
      return <FaCheck />;
    case "heart":
      return <FaHeart />;
    case "repair":
      return <FaCogs />;
    case "repair-user":
      return <FaUserCog />;
  }
}
