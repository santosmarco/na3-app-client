import { Typography } from "antd";
import React, { useMemo } from "react";

import classes from "./DataItem.module.css";

type DataItemProps = {
  children?: React.ReactNode;
  className?: string;
  hasColon?: boolean;
  icon?: React.ReactNode;
  label: React.ReactNode;
  marginBottom?: boolean | number;
};

const defaultProps = {
  children: null,
  hasColon: true,
  icon: undefined,
  marginBottom: false,
  className: undefined,
};

export function DataItem({
  label,
  children,
  icon,
  hasColon,
  marginBottom,
  className,
}: DataItemProps): JSX.Element {
  const containerStyle = useMemo(
    () => ({
      marginBottom: typeof marginBottom === "number" ? marginBottom : undefined,
    }),
    [marginBottom]
  );

  return (
    <div
      className={`${marginBottom === true ? classes.DataMarginBottom : ""} ${
        className || ""
      }`.trim()}
      style={containerStyle}
    >
      <Typography.Text className={classes.DataLabel}>
        {icon && <>{icon} </>}
        {label}
        {hasColon && ":"}
      </Typography.Text>

      {children}
    </div>
  );
}

DataItem.defaultProps = defaultProps;
