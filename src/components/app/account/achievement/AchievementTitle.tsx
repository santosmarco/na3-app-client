import { Tag } from "@components";
import type { Na3UserAchievement } from "@modules/na3-types";
import { formatNumber } from "@utils";
import { Col, Row, Typography } from "antd";
import React from "react";

import classes from "./AchievementTitle.module.css";

type AchievementTitleProps = {
  achievement: Na3UserAchievement;
};

export function AchievementTitle({
  achievement: { title, achieved, color, ...achievement },
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
        <Tag color={achieved ? "success" : color}>
          Pontos:{" "}
          {formatNumber(
            achievement.type === "progressive"
              ? achievement.currentScore
              : achievement.score
          )}
        </Tag>
      </Col>
    </Row>
  );
}
