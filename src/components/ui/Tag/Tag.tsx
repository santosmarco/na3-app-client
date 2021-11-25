import type { TagProps as AntdTagProps } from "antd";
import { Tag as AntdTag } from "antd";
import React from "react";

import classes from "./Tag.module.css";

export type TagProps = {
  children: React.ReactNode;
  color?: AntdTagProps["color"];
  icon?: React.ReactNode;
  marginRight?: "default";
};

const defaultProps = {
  color: undefined,
  icon: undefined,
  marginRight: undefined,
};

export function Tag({
  color,
  marginRight,
  children,
  icon,
}: TagProps): JSX.Element {
  return (
    <AntdTag
      className={marginRight === "default" ? undefined : classes.Tag}
      color={color}
      icon={icon}
    >
      <small>
        <strong>{children}</strong>
      </small>
    </AntdTag>
  );
}

Tag.defaultProps = defaultProps;
