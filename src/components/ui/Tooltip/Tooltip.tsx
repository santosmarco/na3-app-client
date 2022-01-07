import type { TooltipProps as AntdTooltipProps } from "antd";
import { Tooltip as AntdTooltip } from "antd";
import React from "react";

type TooltipProps = {
  arrowPointAtCenter?: AntdTooltipProps["arrowPointAtCenter"];
  children?: React.ReactNode;
  placement?: AntdTooltipProps["placement"];
  title: React.ReactNode;
};

export function Tooltip({
  title,
  placement = "topLeft",
  arrowPointAtCenter = true,
  children,
}: TooltipProps): JSX.Element {
  return (
    <AntdTooltip
      arrowPointAtCenter={arrowPointAtCenter}
      placement={placement}
      title={title}
    >
      <span>{children}</span>
    </AntdTooltip>
  );
}
