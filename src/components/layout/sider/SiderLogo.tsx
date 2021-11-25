import logo from "@assets/novaa3Logo.svg";
import logoIcon from "@assets/novaa3LogoIcon.svg";
import React from "react";

import classes from "./SiderLogo.module.css";

type SiderLogoProps = {
  isCollapsed: boolean;
  onClick: () => void;
};

export function SiderLogo({
  isCollapsed,
  onClick,
}: SiderLogoProps): JSX.Element {
  return (
    <div
      className={
        classes.Logo + (isCollapsed ? " " + classes.LogoCollapsed : "")
      }
      onClick={onClick}
    >
      {!isCollapsed && (
        <img
          alt="Logotipo Nova A3"
          className={`animate__animated ${
            isCollapsed ? "animate__fadeOut" : "animate__fadeIn"
          }`}
          height={32}
          src={logo}
          width={140}
        />
      )}

      {isCollapsed && (
        <img
          alt="Logotipo Nova A3"
          className={`animate__animated ${
            isCollapsed ? "animate__fadeIn" : "animate__fadeOut"
          }`}
          height={32}
          src={logoIcon}
          width={140}
        />
      )}
    </div>
  );
}
