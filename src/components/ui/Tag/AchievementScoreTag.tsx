import { formatNumber } from "@utils";
import React from "react";

import type { TagProps } from "./Tag";
import { Tag } from "./Tag";

type AchievementScoreTagProps = {
  achieved?: boolean;
  color?: TagProps["color"];
  score: number;
  total?: number;
};

export function AchievementScoreTag({
  score,
  color,
  total,
  achieved,
}: AchievementScoreTagProps): JSX.Element {
  return (
    <Tag
      color={color || (achieved ? "success" : score > 0 ? "blue" : undefined)}
    >
      Pontos: {formatNumber(score)}
      {typeof total === "number" && ` / ${formatNumber(total)}`}
    </Tag>
  );
}
