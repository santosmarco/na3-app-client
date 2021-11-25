import logoLight from "@assets/novaa3Logo.svg";
import logoDark from "@assets/novaa3LogoDark.svg";
import React from "react";

import { useTheme } from "../../../hooks";

type HomeLogoProps = {
  className?: string;
  height?: number;
};

const defaultProps: HomeLogoProps = {
  className: undefined,
  height: 32,
};

export function HomeLogo({ height, className }: HomeLogoProps): JSX.Element {
  const [theme] = useTheme();

  return (
    <img
      alt="Logotipo Nova A3"
      className={`${className || ""} animate__animated animate__fadeIn`}
      height={height || 32}
      src={theme === "light" ? logoDark : logoLight}
      width={height ? (height * (140 / 32)) : 140}
    />
  );
}

HomeLogo.defaultProps = defaultProps;
