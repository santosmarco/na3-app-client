import React from "react";

import classes from "./Centered.module.css";

type CenteredProps = {
  children: React.ReactNode;
};

export function Centered({ children }: CenteredProps): JSX.Element {
  return <div className={classes.Centered}>{children}</div>;
}
