import React, { useMemo } from "react";
import { Helmet as ReactHelmet } from "react-helmet";
import { useLocation } from "react-router-dom";

import type { AppRoute } from "../../constants";
import { ROUTES } from "../../constants";
import { useTheme } from "../../hooks";

export function Helmet(): JSX.Element {
  const { pathname } = useLocation();

  const [theme] = useTheme();

  const title = useMemo((): string => {
    const pathChunks = pathname
      .split("/")
      .filter((pathChunk, index) => !!pathChunk || index === 0);

    const routes: [AppRoute | undefined, AppRoute | undefined] = [
      ROUTES[`/${pathChunks[1]}`],
      ROUTES[`/${pathChunks[1]}/${pathChunks[2]}`],
    ];

    if (routes[0]?.title && routes[1]?.title) {
      return `${routes[0].title} • ${routes[1].title}`;
    } else if (routes[0]?.title) {
      return `Nova A3 • ${routes[0].title}`;
    } else {
      return "Nova A3";
    }
  }, [pathname]);

  return (
    <ReactHelmet>
      <meta
        content={theme === "dark" ? "#000000" : "#ffffff"}
        name="theme-color"
      />

      <title>{title}</title>
    </ReactHelmet>
  );
}
