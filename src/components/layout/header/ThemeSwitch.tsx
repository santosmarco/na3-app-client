import { Switch, Tooltip } from "antd";
import React from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

import { useTheme } from "../../../hooks";
import classes from "./ThemeSwitch.module.css";

export function ThemeSwitch(): JSX.Element {
  const [theme, toggleTheme] = useTheme();

  return (
    <Tooltip
      placement="bottomRight"
      title={`Alternar para tema ${theme === "dark" ? "claro" : "escuro"}`}
    >
      <Switch
        checked={theme === "dark"}
        checkedChildren={
          <div className={classes.SwitchIcon}>
            <MdDarkMode />
          </div>
        }
        onChange={toggleTheme}
        size="small"
        unCheckedChildren={
          <div className={classes.SwitchIcon}>
            <MdLightMode />
          </div>
        }
      />
    </Tooltip>
  );
}
