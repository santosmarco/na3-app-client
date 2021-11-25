import { Typography } from "antd";
import React from "react";

import classes from "./DataInfo.module.css";

type DataDetailProps = {
  children?: React.ReactNode;
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
};

export function DataInfo({
  label,
  children,
  icon,
  hasColon,
  marginBottom,
}: DataDetailProps): JSX.Element {
  return (
    <div
      className={marginBottom === true ? classes.DataMarginBottom : undefined}
      style={{
        marginBottom:
          typeof marginBottom === "number" ? marginBottom : undefined,
      }}
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

DataInfo.defaultProps = defaultProps;
