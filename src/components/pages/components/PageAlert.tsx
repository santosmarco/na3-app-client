import type { AlertProps } from "antd";
import { Alert } from "antd";
import React from "react";

import classes from "./PageAlert.module.css";

type PageAlertProps = {
  children: React.ReactNode;
  title?: React.ReactNode;
  type: NonNullable<AlertProps["type"]>;
};
const defaultProps = {
  title: undefined,
};

export function PageAlert({
  type,
  children,
  title,
}: PageAlertProps): JSX.Element {
  return (
    <Alert
      className={classes.Alert}
      closable={true}
      description={title && children}
      message={title || children}
      showIcon={true}
      type={type}
    />
  );
}

PageAlert.defaultProps = defaultProps;
