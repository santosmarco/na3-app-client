import * as colors from "@ant-design/colors";
import type { AnimatedProps } from "@components";
import { Animated } from "@components";
import type { WebColor } from "@modules/na3-types";
import { getStatusColor } from "@utils";
import React, { useMemo } from "react";

type AnimatedIconProps = Pick<
  AnimatedProps,
  "animationIn" | "animationOut" | "visible"
>;

type IconProps = {
  color?: WebColor | "error" | "primary" | "success" | "warning";
  children: React.ReactNode;
} & (
  | (Partial<AnimatedIconProps> & {
      animated: true;
    })
  | (Partial<Record<keyof AnimatedIconProps, never>> & {
      animated?: false;
    })
);

export function Icon({
  color,
  animated,
  visible,
  animationIn,
  animationOut,
  children,
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

    return { color: colorValue };
  }, [color]);


  if (animated) {
    return (
      <Animated
        animationIn={animationIn}
        animationOut={animationOut}
        style={style}
        visible={visible ?? false}
      >
        {children}
      </Animated>
    );
  }
  return <span style={{ color: "green" }}>{children}</span>;
}
