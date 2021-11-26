import type { TagProps as AntdTagProps } from "antd";
import { Tag as AntdTag } from "antd";
import React, { useMemo } from "react";

import classes from "./Tag.module.css";

export type TagProps = {
  children: React.ReactNode;
  color?: AntdTagProps["color"];
  icon?: React.ReactNode;
  marginRight?: "default";
  textColor?: string;
};

const defaultProps = {
  color: undefined,
  textColor: undefined,
  icon: undefined,
  marginRight: undefined,
};

export function Tag({
  color,
  textColor,
  marginRight,
  children,
  icon,
}: TagProps): JSX.Element {
  const style = useMemo(() => ({ color: textColor }), [textColor]);

  return (
    <AntdTag
      className={marginRight === "default" ? undefined : classes.Tag}
      color={color}
      icon={icon}
      style={style}
    >
      <small>
        <strong>{children}</strong>
      </small>
    </AntdTag>
  );
}

Tag.defaultProps = defaultProps;
