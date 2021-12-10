import type { AlertProps } from "antd";
import { Alert } from "antd";
import React, { useMemo } from "react";
import type { LiteralUnion } from "type-fest";

import classes from "./PageAlert.module.css";

type PageAlertProps = {
  children: React.ReactNode;
  className?: string;
  closable?: boolean;
  marginBottom?: LiteralUnion<"default" | "small", number>;
  title?: React.ReactNode;
  type?: NonNullable<AlertProps["type"]>;
};

export function PageAlert({
  type,
  children,
  title,
  className,
  closable,
  marginBottom,
}: PageAlertProps): JSX.Element {
  const alertStyle = useMemo(
    () => ({
      marginBottom:
        marginBottom === "small"
          ? 20
          : marginBottom === "default"
          ? undefined
          : marginBottom,
    }),
    [marginBottom]
  );

  return (
    <Alert
      className={`${classes.Alert} ${className || ""}`.trim()}
      closable={closable ?? true}
      description={title && children}
      message={title || children}
      showIcon={true}
      style={alertStyle}
      type={type || "info"}
    />
  );
}
