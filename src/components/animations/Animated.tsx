import React from "react";

import classes from "./Animated.module.css";

export type AnimatedProps = {
  animationIn?: "fadeIn";
  animationOut?: "fadeOut";
  children: React.ReactNode;
  style?: React.CSSProperties;
  visible: boolean;
};

export function Animated({
  visible,
  animationIn = "fadeIn",
  animationOut = "fadeOut",
  children,
  style,
}: AnimatedProps): JSX.Element {
  return (
    <span
      className={`animate__animated animate__${
        visible ? animationIn : animationOut
      } ${visible ? "" : classes.Out}`.trim()}
      style={style}
    >
      {children}
    </span>
  );
}
