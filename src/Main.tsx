import { ThemeLoadHandler } from "@components";
import { THEME_STORAGE_KEY } from "@config";
import { notification } from "antd";
import React from "react";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import useLocalStorage from "react-use-localstorage";

const themes = {
  dark: `${process.env.PUBLIC_URL}/themes/dark.theme.css`,
  light: `${process.env.PUBLIC_URL}/themes/light.theme.css`,
};

notification.config({ duration: 6 });

type MainProps = {
  readonly children: React.ReactNode;
};

export function Main({ children }: MainProps): JSX.Element {
  const [storedTheme] = useLocalStorage(THEME_STORAGE_KEY, "light");

  return (
    <ThemeSwitcherProvider
      defaultTheme={storedTheme}
      insertionPoint={document.getElementById("themes-insertion-point")}
      themeMap={themes}
    >
      {children}
      <ThemeLoadHandler />
    </ThemeSwitcherProvider>
  );
}
