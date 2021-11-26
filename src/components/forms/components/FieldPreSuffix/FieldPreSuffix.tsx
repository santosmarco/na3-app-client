import { Typography } from "antd";
import React from "react";

import classes from "./FieldPreSuffix.module.css";

type FieldPreSuffixProps = {
  children: React.ReactNode;
  isPrefix?: boolean;
};

const defaultProps = {
  isPrefix: undefined,
};

export function FieldPreSuffix({
  children,
  isPrefix,
}: FieldPreSuffixProps): JSX.Element | null {
  if (!children) {
    return null;
  }
  return (
    <div className={isPrefix ? classes.IsPrefix : undefined}>
      {typeof children === "string" ? (
        <Typography.Text italic={true} type="secondary">
          {children}
        </Typography.Text>
      ) : (
        children
      )}
    </div>
  );
}

FieldPreSuffix.defaultProps = defaultProps;
