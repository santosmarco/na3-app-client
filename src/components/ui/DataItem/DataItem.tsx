import { Typography } from "antd";
import React, { useMemo } from "react";

import classes from "./DataItem.module.css";

type DataItemProps = {
  children?: React.ReactNode;
  className?: string;
  hasColon?: boolean;
  icon?: React.ReactNode;
  iconMarginRight?: number;
  label: React.ReactNode;
  marginBottom?: boolean | number;
  labelMarginBottom?: number;
  right?: React.ReactNode;
};

export function DataItem({
  label,
  children,
  icon,
  hasColon,
  marginBottom,
  iconMarginRight,
  className,
  right,
  labelMarginBottom,
}: DataItemProps): JSX.Element {
  const containerStyle = useMemo(
    () => ({
      marginBottom: typeof marginBottom === "number" ? marginBottom : undefined,
    }),
    [marginBottom]
  );

  const labelStyle = useMemo(
    () => ({ marginBottom: 8 + (labelMarginBottom ?? 0) }),
    [labelMarginBottom]
  );

  const iconStyle = useMemo(
    () => ({ marginRight: iconMarginRight }),
    [iconMarginRight]
  );

  return (
    <div
      className={`${marginBottom === true ? classes.DataMarginBottom : ""} ${
        className || ""
      }`.trim()}
      style={containerStyle}
    >
      <Typography.Text className={classes.DataLabel} style={labelStyle}>
        <div>
          {icon && (
            <>
              <span style={iconStyle}>{icon}</span>{" "}
            </>
          )}
          {label}
          {hasColon && ":"}
        </div>

        <div>{right}</div>
      </Typography.Text>

      {children}
    </div>
  );
}
