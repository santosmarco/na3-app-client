import { Col } from "antd";
import dayjs from "dayjs";
import React from "react";

import classes from "./ServiceOrderStep.module.css";

type ServiceOrderStepProps = {
  icon: React.ReactNode;
  timestamp?: string | null;
};

const defaultProps: Omit<ServiceOrderStepProps, "icon"> = {
  timestamp: undefined,
};

export function ServiceOrderStep({
  icon,
  timestamp,
}: ServiceOrderStepProps): JSX.Element {
  return (
    <Col className={classes.Container} span={6}>
      {icon}

      <span className={classes.Text}>
        {timestamp
          ? dayjs(timestamp).tz("America/Sao_Paulo").format("DD/MM")
          : "–––"}
      </span>
    </Col>
  );
}

ServiceOrderStep.defaultProps = defaultProps;
