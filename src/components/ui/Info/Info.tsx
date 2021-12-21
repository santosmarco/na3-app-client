import { InfoCircleOutlined } from "@ant-design/icons";
import type { TooltipProps } from "antd";
import { Popover, Tooltip, Typography } from "antd";
import React, { useMemo } from "react";

import classes from "./Info.module.css";

type InfoVariant = "popover" | "tooltip";

export type InfoProps<Variant extends InfoVariant = InfoVariant> = {
  arrowPointAtCenter?: boolean;
  children?: React.ReactNode;
  content?: React.ReactNode;
  gapLeft?: "default" | "large" | "medium" | "none" | "small";
  icon?: React.ReactNode;
  placement?: TooltipProps["placement"];
  status?: "danger" | "default" | "primary" | "success" | "warning";
  title?: Variant extends "popover" ? React.ReactNode : never;
  variant?: Variant;
};

export function Info<T extends InfoVariant = "tooltip">({
  variant,
  children,
  content: contentProp,
  title,
  icon = <InfoCircleOutlined />,
  placement = "topLeft",
  arrowPointAtCenter = true,
  gapLeft = "default",
  status = "default",
}: InfoProps<T>): JSX.Element {
  const Component = useMemo(
    () => (variant === "popover" ? Popover : Tooltip),
    [variant]
  );

  const content = useMemo(
    () => children || contentProp,
    [children, contentProp]
  );

  const iconStyle = useMemo(() => {
    let marginLeft;

    switch (gapLeft) {
      case "none":
        marginLeft = 0;
        break;
      case "small":
        marginLeft = 8;
        break;
      case "medium":
        marginLeft = 16;
        break;
      case "large":
        marginLeft = 24;
        break;

      default:
        marginLeft = 6.8;
        break;
    }

    return { marginLeft };
  }, [gapLeft]);

  return (
    <Component
      arrowPointAtCenter={arrowPointAtCenter}
      content={variant === "popover" && content}
      placement={placement}
      title={variant === "popover" ? title : content}
    >
      <Typography.Text
        className={classes.InfoIcon}
        style={iconStyle}
        type={
          status === "primary"
            ? undefined
            : status === "default"
            ? "secondary"
            : status
        }
      >
        {icon}
      </Typography.Text>
    </Component>
  );
}
