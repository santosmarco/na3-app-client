import { AchievementScoreTag } from "@components";
import type { Na3UserAchievement } from "@modules/na3-types";
import { Col, Row, Typography } from "antd";
import React from "react";

import classes from "./AchievementTitle.module.css";

type AchievementTitleProps = {
  achievement: Na3UserAchievement;
};

export function AchievementTitle({
  achievement: { title, achieved, color, currentScore, ...achievement },
}: AchievementTitleProps): JSX.Element {
  return (
    <Row
      align="middle"
      className={classes.AchievementTitleContainer}
      justify="space-between"
    >
      <Col>
        <Typography.Text className={classes.AchievementTitle}>
          {title}
        </Typography.Text>
      </Col>

      <Col>
        {(achievement.type === "progressive" || achieved) && (
          <AchievementScoreTag
            color={achieved ? "success" : color}
            score={currentScore}
          />
        )}
      </Col>
    </Row>
  );
}
