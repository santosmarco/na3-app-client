import logoLight from "@assets/novaa3Logo.svg";
import logoDark from "@assets/novaa3LogoDark.svg";
import React from "react";

import { useTheme } from "../../../hooks";

type LogoProps = {
  className?: string;
  height?: number;
};

const defaultProps = {
  className: undefined,
  height: 32,
};

export function Logo({ height, className }: LogoProps): JSX.Element {
  const [theme] = useTheme();

  return (
    <div className={className}>
      <img
        alt="Logotipo Nova A3"
        className="animate__animated animate__fadeIn"
        height={height || 32}
        src={theme === "light" ? logoDark : logoLight}
        width={height ? height * (140 / 32) : 140}
      />
    </div>
  );
}

Logo.defaultProps = defaultProps;
