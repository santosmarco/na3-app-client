import { Tag } from "@components";
import type { WebColor } from "@modules/na3-types";
import { formatNumber } from "@utils";
import { Col, Row } from "antd";
import React from "react";

import classes from "./AchievementTitle.module.css";

type AchievementTitleProps = {
  children: string;
  color: WebColor;
  currentScore: number;
  isDone: boolean;
};

export function AchievementTitle({
  children,
  color,
  currentScore,
  isDone,
}: AchievementTitleProps): JSX.Element {
  return (
    <Row
      align="middle"
      className={classes.AchievementTitle}
      justify="space-between"
    >
      <Col>{children}</Col>

      <Col>
        <Tag color={isDone ? "success" : color}>
          Pontos: {formatNumber(currentScore)}
        </Tag>
      </Col>
    </Row>
  );
}
