import { Layout } from "antd";
import React from "react";

import { useTheme } from "../../../hooks";
import { Breadcrumb } from "../breadcrumb/Breadcrumb";
import classes from "./Content.module.css";

type ContentProps = {
  children: React.ReactNode;
};

export function Content({ children }: ContentProps): JSX.Element {
  const [theme] = useTheme();

  return (
    <Layout.Content
      className={classes.Container}
      style={{ backgroundColor: theme === "light" ? "#fff" : "#111" }}
    >
      <Breadcrumb />

      <div className={classes.Screen}>{children}</div>
    </Layout.Content>
  );
}
