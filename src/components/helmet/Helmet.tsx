import type { AppRoute } from "@constants";
import { ROUTES } from "@constants";
import { useTheme } from "@hooks";
import React, { useMemo } from "react";
import { Helmet as ReactHelmet } from "react-helmet";
import { useLocation } from "react-router-dom";

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

    const titleParts = [
      routes[0]?.headTitle || routes[0]?.title,
      routes[1]?.headTitle || routes[1]?.title,
    ];

    if (titleParts[0] && titleParts[1]) {
      return `${titleParts[0]} • ${titleParts[1]}`;
    } else if (titleParts[0]) {
      return `Nova A3 • ${titleParts[0]}`;
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
