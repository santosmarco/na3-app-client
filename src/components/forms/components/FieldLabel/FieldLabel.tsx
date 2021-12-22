import { Typography } from "antd";
import React from "react";

import classes from "./FieldLabel.module.css";

type FieldLabelProps = {
  children: React.ReactNode;
  hideOptionalMark: boolean;
  isOptional: boolean;
};

export function FieldLabel({
  isOptional,
  hideOptionalMark,
  children,
}: FieldLabelProps): JSX.Element | null {
  if (!children) {
    return null;
  }

  return (
    <Typography.Text className={classes.Label}>
      {children}

      {isOptional && !hideOptionalMark && (
        <small className={classes.OptionalMark}>
          <Typography.Text italic={true} type="secondary">
            (opcional)
          </Typography.Text>
        </small>
      )}
    </Typography.Text>
  );
}
