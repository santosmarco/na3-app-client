import logoLight from "@assets/novaa3Logo.svg";
import logoDark from "@assets/novaa3LogoDark.svg";
import { ANIMATION_FADE_IN } from "@constants";
import type { ThemeMode } from "@hooks";
import { useTheme } from "@hooks";
import React, { useMemo } from "react";

type LogoProps = {
  className?: string;
  height?: number;
  theme?: ThemeMode;
  opacity?: number;
};

export function Logo({
  height,
  className,
  theme: themeProp,
  opacity,
}: LogoProps): JSX.Element {
  const [appTheme] = useTheme();

  const theme = useMemo(() => {
    if (themeProp) {
      return themeProp;
    }
    return appTheme === "dark" ? "light" : "dark";
  }, [themeProp, appTheme]);

  const containerStyle = useMemo(() => ({ opacity: opacity ?? 1 }), [opacity]);

  return (
    <div className={className} style={containerStyle}>
      <img
        alt="Logotipo Nova A3"
        className={ANIMATION_FADE_IN}
        height={height || 32}
        src={theme === "light" ? logoLight : logoDark}
        width={height ? height * (140 / 32) : 140}
      />
    </div>
  );
}
