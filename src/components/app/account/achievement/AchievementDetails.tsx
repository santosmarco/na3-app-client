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
  style?: React.CSSProperties;
};

export function AchievementDetails({
  achievement,
  style,
}: AchievementDetailsProps): JSX.Element {
  return (
    <div className={classes.AchievementDetails} style={style}>
      <AchievementTitle achievement={achievement} />

      <Typography.Paragraph
        className={classes.AchievementDescription}
        italic={true}
        type="secondary"
      >
        {achievement.description}
      </Typography.Paragraph>

      {achievement.type === "progressive" ? (
        <Steps
          current={achievement.currentLevel.idx}
          direction="vertical"
          percent={achievement.currentLevel.progressPercent}
          size="small"
        >
          {achievement.levels.map((level, idx) => (
            <Steps.Step
              description={achievement.levelDescriptor(achievement, idx)}
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
        <Steps
          direction="vertical"
          progressDot={!achievement.achieved}
          size="small"
        >
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
                  `${formatNumber(achievement.totalScore)} pontos`
                }
              >
                {achievement.achieved ? "Você conseguiu!" : "Não conquistado"}
              </AchievementLevelTitle>
            }
          />
        </Steps>
      )}
    </div>
  );
}
