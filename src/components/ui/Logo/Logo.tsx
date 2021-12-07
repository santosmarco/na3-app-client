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
};

export function Logo({
  height,
  className,
  theme: themeProp,
}: LogoProps): JSX.Element {
  const [appTheme] = useTheme();

  const theme = useMemo(() => themeProp || appTheme, [themeProp, appTheme]);

  return (
    <div className={className}>
      <img
        alt="Logotipo Nova A3"
        className={ANIMATION_FADE_IN}
        height={height || 32}
        src={theme === "light" ? logoDark : logoLight}
        width={height ? height * (140 / 32) : 140}
      />
    </div>
  );
}
