import { MAIN_CONTENT_MARGIN } from "@constants";
import { useTheme } from "@hooks";
import { Grid, Layout } from "antd";
import React, { useMemo } from "react";

import { Breadcrumb } from "../breadcrumb/Breadcrumb";
import classes from "./Content.module.css";

type ContentProps = {
  children: React.ReactNode;
};

export function Content({ children }: ContentProps): JSX.Element {
  const [theme] = useTheme();

  const breakpoint = Grid.useBreakpoint();

  const contentStyle = useMemo(() => {
    const marginX = breakpoint.md
      ? MAIN_CONTENT_MARGIN.X.MD
      : MAIN_CONTENT_MARGIN.X.XS;

    return {
      backgroundColor: theme === "light" ? "#fff" : "#111",
      marginLeft: marginX,
      marginRight: marginX,
    };
  }, [theme, breakpoint.md]);

  return (
    <Layout.Content className={classes.Container} style={contentStyle}>
      <Breadcrumb />

      <div className={classes.Screen}>{children}</div>
    </Layout.Content>
  );
}
