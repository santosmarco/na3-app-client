import * as colors from "@ant-design/colors";
import type { AnimatedProps } from "@components";
import { Animated } from "@components";
import type { WebColor } from "@modules/na3-types";
import { getStatusColor } from "@utils";
import { Space } from "antd";
import React, { useMemo } from "react";

type AnimatedIconProps = Pick<
  AnimatedProps,
  "animationIn" | "animationOut" | "visible"
>;

export type IconSize = number | "large" | "medium" | "small";

export type IconSpace = IconSize;

type IconProps = {
  children: React.ReactNode;
  color?: WebColor | "error" | "primary" | "success" | "warning";
  label?: React.ReactNode;
  size?: IconSize;
  space?: IconSpace;
} & (
  | (Partial<AnimatedIconProps> & { animated: true })
  | (Partial<Record<keyof AnimatedIconProps, never>> & { animated?: false })
);

export function Icon({
  color,
  animated,
  visible,
  animationIn,
  animationOut,
  children,
  label,
  size,
  space = "small",
}: IconProps): JSX.Element {
  const style = useMemo(() => {
    let colorValue: string | undefined;
    switch (color) {
      case undefined:
        colorValue = undefined;
        break;
      case "primary":
      case "success":
      case "warning":
      case "error":
        colorValue = getStatusColor(color);
        break;

      default:
        colorValue = colors[color].primary;
    }

    let fontSizeValue: number | undefined;
    switch (size) {
      case undefined:
        fontSizeValue = undefined;
        break;
      case "small":
        fontSizeValue = 14;
        break;
      case "medium":
        fontSizeValue = 20;
        break;
      case "large":
        fontSizeValue = 28;
        break;

      default:
        fontSizeValue = size;
    }

    return { color: colorValue, fontSize: fontSizeValue };
  }, [color, size]);

  const childrenComponent = useMemo(
    () => children && <span>{children}</span>,
    [children]
  );

  const labelComponent = useMemo(() => label && <span>{label}</span>, [label]);

  const innerComponent = useMemo(() => {
    return (
      <span>
        {childrenComponent && labelComponent ? (
          <Space size={space === "medium" ? "middle" : space}>
            {childrenComponent}
            {labelComponent}
          </Space>
        ) : (
          childrenComponent || labelComponent
        )}
      </span>
    );
  }, [childrenComponent, labelComponent, space]);

  if (animated) {
    return (
      <Animated
        animationIn={animationIn}
        animationOut={animationOut}
        style={style}
        visible={visible ?? false}
      >
        {innerComponent}
      </Animated>
    );
  }
  return innerComponent;
}
