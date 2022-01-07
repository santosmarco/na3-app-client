import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import type { SpanProps } from "@types";
import type { TagProps as AntdTagProps } from "antd";
import { Tag as AntdTag } from "antd";
import React, { useMemo } from "react";
import type { LiteralUnion } from "type-fest";

import classes from "./Tag.module.css";

export type TagProps = {
  children: React.ReactNode;
  closable?: boolean;
  color?: LiteralUnion<AntdTagProps["color"] | "stop" | "waiting", string>;
  icon?: React.ReactNode;
  marginRight?: "default";
  mode?: "select";
  noStatusIcon?: boolean;
  onClick?: SpanProps["onClick"];
  onClose?: () => void;
  onFocus?: SpanProps["onFocus"];
  onMouseEnter?: SpanProps["onMouseEnter"];
  onMouseLeave?: SpanProps["onMouseLeave"];
  style?: React.CSSProperties;
  textColor?: string;
  wrapperClassName?: string;
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
  // Span props
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onClick,
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
      onClick={onClick}
      onFocus={onFocus}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <AntdTag
        className={marginRight === "default" ? undefined : classes.Tag}
        closable={closable}
        color={color === "default" ? "blue" : color}
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
