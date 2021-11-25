import { Typography } from "antd";
import React from "react";

import classes from "./FieldLabel.module.css";

type FieldLabelProps = {
  isOptional: boolean;
  text: string;
};

export function FieldLabel({ isOptional, text }: FieldLabelProps): JSX.Element {
  return (
    <Typography.Text className={classes.Label}>
      {text}

      {isOptional && (
        <small className={classes.OptionalMark}>
          <Typography.Text italic={true} type="secondary">
            (opcional)
          </Typography.Text>
        </small>
      )}
    </Typography.Text>
  );
}
