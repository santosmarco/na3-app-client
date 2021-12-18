import { Info } from "@components";
import { isObject } from "@utils";
import { Typography } from "antd";
import React, { useMemo } from "react";

import classes from "./DataItem.module.css";

type DataItemProps = {
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  iconMarginRight?: number;
  label: React.ReactNode;
  info?:
    | React.ReactNode
    | {
        variant?: "popover" | "tooltip";
        title?: React.ReactNode;
        content: React.ReactNode;
      };
  right?: React.ReactNode;
};

export function DataItem({
  label,
  children,
  icon,
  iconMarginRight,
  className,
  info,
  right,
}: DataItemProps): JSX.Element {
  const iconStyle = useMemo(
    () => ({ marginRight: iconMarginRight }),
    [iconMarginRight]
  );

  return (
    <div className={className}>
      <Typography.Text className={classes.DataLabel}>
        <div>
          {icon && (
            <>
              <span style={iconStyle}>{icon}</span>{" "}
            </>
          )}

          {label}

          {info && (
            <Info
              title={isObject(info) && "title" in info && info.title}
              variant={
                isObject(info) && "variant" in info ? info.variant : undefined
              }
            >
              {isObject(info) && "content" in info ? info.content : info}
            </Info>
          )}
        </div>

        <div>{right}</div>
      </Typography.Text>

      {children}
    </div>
  );
}
