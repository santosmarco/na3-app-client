import type { Na3UserAchievement } from "@modules/na3-types";
import { formatNumber } from "@utils";
import { Steps, Typography } from "antd";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import React from "react";

import classes from "./AchievementDetails.module.css";
import { AchievementLevelTitle } from "./AchievementLevelTitle";
import { AchievementTitle } from "./AchievementTitle";

type AchievementDetailsProps = {
  achievement: Na3UserAchievement;
};

export function AchievementDetails({
  achievement,
}: AchievementDetailsProps): JSX.Element {
  return (
    <>
      <AchievementTitle achievement={achievement} />

      <div className={classes.AchievementDetails}>
        <Typography.Paragraph
          className={classes.AchievementDescription}
          italic={true}
          type="secondary"
        >
          {achievement.description}
        </Typography.Paragraph>

        {achievement.type === "progressive" ? (
          <Steps
            current={achievement.currentLevel}
            direction="vertical"
            size="small"
          >
            {achievement.levels.map((level) => (
              <Steps.Step
                description={
                  achievement.progress > level.goal
                    ? "Concluído!"
                    : achievement.levelDescriptor(achievement)
                }
                key={nanoid()}
                title={
                  <AchievementLevelTitle
                    subTitle={`${formatNumber(level.score)} pontos`}
                  >
                    {level.goal}
                  </AchievementLevelTitle>
                }
              />
            ))}
          </Steps>
        ) : (
          <Steps direction="vertical" size="small">
            <Steps.Step
              description={
                achievement.achieved && achievement.achievedAt
                  ? `Conquistado em ${dayjs(achievement.achievedAt).format(
                      "DD/MM/YY [às] HH:mm"
                    )}`
                  : achievement.levelDescriptor
              }
              status={achievement.achieved ? "finish" : "wait"}
              title={
                <AchievementLevelTitle
                  subTitle={
                    !achievement.achieved &&
                    `${formatNumber(achievement.score)} pontos`
                  }
                >
                  {achievement.achieved ? "Conquistado!" : "Não conquistado"}
                </AchievementLevelTitle>
              }
            />
          </Steps>
        )}
      </div>
    </>
  );
}
