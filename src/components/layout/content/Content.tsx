import { useTheme } from "@hooks";
import { Layout } from "antd";
import React, { useMemo } from "react";

import { Breadcrumb } from "../breadcrumb/Breadcrumb";
import classes from "./Content.module.css";

type ContentProps = {
  children: React.ReactNode;
};

export function Content({ children }: ContentProps): JSX.Element {
  const [theme] = useTheme();

  const contentStyle = useMemo(
    () => ({
      backgroundColor: theme === "light" ? "#fff" : "#111",
    }),
    [theme]
  );

  return (
    <Layout.Content className={classes.Container} style={contentStyle}>
      <Breadcrumb />

      <div className={classes.Screen}>{children}</div>
    </Layout.Content>
  );
}
