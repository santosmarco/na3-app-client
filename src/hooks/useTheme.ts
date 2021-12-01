import { useCallback, useEffect } from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";
import useLocalStorage from "react-use-localstorage";

type ThemeMode = "dark" | "light";

type ToggleTheme = () => void;

export function useTheme(): readonly [ThemeMode, ToggleTheme] {
  const [storedTheme, setStoredTheme] = useLocalStorage(
    "NA3_APP_PREFERRED_THEME",
    "light"
  );

  const { switcher, themes, currentTheme } = useThemeSwitcher();

  // Set stored (preferred) theme
  const setTheme = useCallback(
    (theme: ThemeMode) => {
      setStoredTheme(theme);
    },
    [setStoredTheme]
  );

  const toggleTheme = useCallback(() => {
    if (currentTheme === "light") setTheme("dark");
    else setTheme("light");
  }, [currentTheme, setTheme]);

  // Update contextual theme upon changes to the stored one
  useEffect(() => {
    if (currentTheme !== storedTheme) {
      switcher({ theme: themes[storedTheme] });
    }
  }, [storedTheme, currentTheme, switcher, themes]);

  return [storedTheme as ThemeMode, toggleTheme];
}
