import { formatNumber } from "@utils";
import React from "react";

import type { TagProps } from "./Tag";
import { Tag } from "./Tag";

type AchievementScoreTagProps = {
  color?: TagProps["color"];
  score: number;
  total?: number;
};

export function AchievementScoreTag({
  score,
  color,
  total,
}: AchievementScoreTagProps): JSX.Element {
  return (
    <Tag color={color}>
      Pontos: {formatNumber(score)}
      {typeof total === "number" && ` / ${formatNumber(total)}`}
    </Tag>
  );
}
