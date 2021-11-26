import { Spinner } from "@components";
import React, { useEffect, useState } from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";

import classes from "./ThemeLoadHandler.module.css";

export function ThemeLoadHandler(): JSX.Element {
  const { status: themeStatus } = useThemeSwitcher();

  const [didFirstLoad, setDidFirstLoad] = useState(false);

  useEffect(() => {
    if (!didFirstLoad && themeStatus === "loaded") {
      setDidFirstLoad(true);
    }
  }, [didFirstLoad, themeStatus]);

  return (
    <Spinner
      spinning={true}
      text={null}
      wrapperClassName={`${classes.ThemeLoadingScreen} ${
        didFirstLoad
          ? `animate__animated animate__${
              themeStatus === "loading" ? "fadeIn" : "fadeOut"
            } animate__faster`
          : ""
      }`.trim()}
    />
  );
}
