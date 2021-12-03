import { Grid } from "antd";
import React, { useMemo } from "react";

import classes from "./ScrollX.module.css";

type ScrollXProps = {
  children?: React.ReactNode;
  offset?: number;
};

export function ScrollX({ children, offset }: ScrollXProps): JSX.Element {
  const breakpoint = Grid.useBreakpoint();

  const style = useMemo(() => {
    const space = (breakpoint.md ? 28 : 14) + (offset || 0);

    return {
      marginLeft: -space,
      marginRight: -space,
      paddingLeft: space,
    };
  }, [offset, breakpoint]);

  return (
    <div className={classes.ScrollX} style={style}>
      {children}
    </div>
  );
}
