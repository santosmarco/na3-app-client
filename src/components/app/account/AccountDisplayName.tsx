import { Typography } from "antd";
import React from "react";

import classes from "./AccountDisplayName.module.css";

type AccountDisplayNameProps = {
  children: string;
  className?: string;
};

const defaultProps = {
  className: undefined,
};

export function AccountDisplayName({
  children,
  className,
}: AccountDisplayNameProps): JSX.Element {
  return (
    <Typography.Title
      className={`${classes.AccountDisplayName} ${className || ""}`.trim()}
      level={4}
    >
      {children.trim().toUpperCase()}
    </Typography.Title>
  );
}

AccountDisplayName.defaultProps = defaultProps;
