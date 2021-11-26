import { Spinner } from "@components";
import React from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";

import classes from "./ThemeLoadHandler.module.css";

export function ThemeLoadHandler(): JSX.Element | null {
  const { status: themeStatus } = useThemeSwitcher();

  return themeStatus === "loading" ? (
    <div className={classes.ThemeLoad}>
      <Spinner color="#fff" text={null} />
    </div>
  ) : null;
}
