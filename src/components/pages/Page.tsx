import {
  OVERFLOW_Y_SCROLL_MARGIN_BOTTOM,
  PAGE_CONTAINER_PADDING,
} from "@constants";
import { Grid } from "antd";
import React, { useMemo } from "react";

import classes from "./Page.module.css";

type PageProps = {
  additionalPaddingBottom?: number;
  alignEdges?: "both" | "left" | "right";
  children?: React.ReactNode;
  forceNoPaddingBottom?: boolean;
  marginBottom?: number;
  preventScroll?: boolean;
  scrollTopOffset?: number;
  style?: React.CSSProperties;
};

export function Page({
  children,
  scrollTopOffset,
  additionalPaddingBottom,
  preventScroll,
  forceNoPaddingBottom,
  marginBottom,
  style: styleProp,
  alignEdges,
}: PageProps): JSX.Element {
  const breakpoint = Grid.useBreakpoint();

  const style = useMemo((): React.CSSProperties => {
    const offsetX = breakpoint.md
      ? PAGE_CONTAINER_PADDING.X.MD
      : PAGE_CONTAINER_PADDING.X.XS;

    const alignLeftEdge = alignEdges === "both" || alignEdges === "left";
    const alignRightEdge = alignEdges === "both" || alignEdges === "right";

    return {
      ...styleProp,

      marginTop: -(scrollTopOffset ?? 0),
      marginRight: -offsetX,
      marginBottom:
        (preventScroll ? 0 : OVERFLOW_Y_SCROLL_MARGIN_BOTTOM) +
        (marginBottom ?? 0),
      marginLeft: -offsetX,

      paddingTop: scrollTopOffset ?? 0,
      paddingRight: alignRightEdge ? undefined : offsetX,
      paddingBottom: forceNoPaddingBottom
        ? 0
        : 28 + (additionalPaddingBottom ?? 0),
      paddingLeft: alignLeftEdge ? undefined : offsetX,

      overflowY: preventScroll ? "hidden" : undefined,
    };
  }, [
    breakpoint.md,
    styleProp,
    scrollTopOffset,
    additionalPaddingBottom,
    preventScroll,
    forceNoPaddingBottom,
    marginBottom,
    alignEdges,
  ]);

  return (
    <div className={classes.Page} style={style}>
      {children}
    </div>
  );
}
