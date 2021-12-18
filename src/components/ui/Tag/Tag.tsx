import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import type { TagProps as AntdTagProps } from "antd";
import { Tag as AntdTag } from "antd";
import React, { useMemo } from "react";
import type { LiteralUnion } from "type-fest";

import classes from "./Tag.module.css";

export type TagProps = {
  children: React.ReactNode;
  color?: LiteralUnion<AntdTagProps["color"] | "stop" | "waiting", string>;
  icon?: React.ReactNode;
  marginRight?: "default";
  noStatusIcon?: boolean;
  textColor?: string;
  closable?: boolean;
  onClose?: () => void;
  style?: React.CSSProperties;
  wrapperClassName?: string;
  mode?: "select";
};

export function Tag({
  color,
  textColor,
  marginRight,
  children,
  icon,
  noStatusIcon,
  closable,
  onClose,
  style: styleProp,
  wrapperClassName,
  mode,
}: TagProps): JSX.Element {
  const style = useMemo(
    () => ({ ...styleProp, color: textColor }),
    [styleProp, textColor]
  );

  return (
    <span
      className={`${mode === "select" ? classes.SelectMode : ""} ${
        wrapperClassName || ""
      }`.trim()}
    >
      <AntdTag
        className={marginRight === "default" ? undefined : classes.Tag}
        closable={closable}
        color={color}
        icon={icon || (!noStatusIcon && getTagIcon(color))}
        onClose={onClose}
        style={style}
      >
        <small>
          <strong>{children}</strong>
        </small>
      </AntdTag>
    </span>
  );
}

function getTagIcon(status: TagProps["color"]): React.ReactNode {
  switch (status) {
    case "processing":
      return <SyncOutlined spin={true} />;
    case "success":
      return <CheckCircleOutlined />;
    case "waiting":
      return <ClockCircleOutlined />;
    case "stop":
      return <MinusCircleOutlined />;
    case "warning":
      return <ExclamationCircleOutlined />;
    case "error":
      return <CloseCircleOutlined />;

    default:
      return;
  }
}
