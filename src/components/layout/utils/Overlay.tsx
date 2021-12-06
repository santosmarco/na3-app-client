import { ANIMATION_FADE_IN, ANIMATION_FADE_OUT } from "@constants";
import { useTheme } from "@hooks";
import React, { useMemo } from "react";

import classes from "./Overlay.module.css";

type OverlayProps = {
  children: React.ReactNode;
  opacity?: number;
  visible: boolean;
};

export function Overlay({
  visible,
  children,
  opacity,
}: OverlayProps): JSX.Element {
  const [theme] = useTheme();

  const bgStyle = useMemo(() => {
    const color = theme === "light" ? 255 : 0;
    return {
      backgroundColor: `rgba(${color}, ${color}, ${color}, ${opacity || 0.6})`,
    };
  }, [theme, opacity]);

  return (
    <>
      <div
        className={`${classes.Overlay} ${
          visible ? ANIMATION_FADE_IN : ANIMATION_FADE_OUT
        }`}
        style={bgStyle}
      />

      {children}
    </>
  );
}
