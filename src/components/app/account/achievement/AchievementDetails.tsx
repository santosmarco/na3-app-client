import { PopoverSectionDivider } from "@components";
import type { Na3UserAchievementLevel } from "@modules/na3-types";
import { formatNumber } from "@utils";
import { Steps, Typography } from "antd";
import { nanoid } from "nanoid";
import React from "react";

import classes from "./AchievementDetails.module.css";

type AchievementDetailsProps = {
  currentLevel: number;
  description: string;
  levelDescriptor: string;
  levels: Na3UserAchievementLevel[];
  progress: number;
};

export function AchievementDetails({
  description,
  currentLevel,
  levels,
  progress,
  levelDescriptor,
}: AchievementDetailsProps): JSX.Element {
  return (
    <div className={classes.AchievementDetails}>
      <Typography.Text italic={true} type="secondary">
        {description}
      </Typography.Text>

      <PopoverSectionDivider marginBottom={24} />

      <Steps current={currentLevel} direction="vertical" size="small">
        {levels.map((level) => (
          <Steps.Step
            description={
              progress > level.goal
                ? "Concluído!"
                : levelDescriptor.replace(
                    "{{remaining}}",
                    formatNumber(level.goal - progress)
                  )
            }
            key={nanoid()}
            title={
              <Typography.Title className={classes.LevelTitle} level={5}>
                {formatNumber(level.goal)}{" "}
                <Typography.Text
                  className={classes.LevelScore}
                  italic={true}
                  type="secondary"
                >
                  <small>{formatNumber(level.score)} pontos</small>
                </Typography.Text>
              </Typography.Title>
            }
          />
        ))}
      </Steps>
    </div>
  );
}
