import type { AlertProps } from "antd";
import { Alert } from "antd";
import React from "react";

import classes from "./PageAlert.module.css";

type PageAlertProps = {
  children: React.ReactNode;
  className?: string;
  closable?: boolean;
  title?: React.ReactNode;
  type: NonNullable<AlertProps["type"]>;
};
const defaultProps = {
  title: undefined,
  className: undefined,
  closable: undefined,
};

export function PageAlert({
  type,
  children,
  title,
  className,
  closable,
}: PageAlertProps): JSX.Element {
  return (
    <Alert
      className={`${classes.Alert} ${className || ""}`.trim()}
      closable={closable ?? true}
      description={title && children}
      message={title || children}
      showIcon={true}
      type={type}
    />
  );
}

PageAlert.defaultProps = defaultProps;
