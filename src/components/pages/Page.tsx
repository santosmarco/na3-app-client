import { OVERFLOW_Y_SCROLL_MARGIN_BOTTOM, PAGE_OFFSET } from "@constants";
import React, { useMemo } from "react";

import classes from "./Page.module.css";

type PageProps = {
  additionalPaddingBottom?: number;
  children?: React.ReactNode;
  preventScroll?: boolean;
  scrollTopOffset?: number;
  style?: React.CSSProperties;
  forceNoPaddingBottom?: boolean;
  marginBottom?: number;
};

export function Page({
  children,
  scrollTopOffset,
  additionalPaddingBottom,
  preventScroll,
  forceNoPaddingBottom,
  marginBottom,
  style: styleProp,
}: PageProps): JSX.Element {
  const style = useMemo(
    (): React.CSSProperties => ({
      ...styleProp,

      marginTop: -(scrollTopOffset ?? 0),
      marginRight: -PAGE_OFFSET,
      marginBottom:
        (preventScroll ? 0 : OVERFLOW_Y_SCROLL_MARGIN_BOTTOM) +
        (marginBottom ?? 0),
      marginLeft: -PAGE_OFFSET,

      paddingTop: scrollTopOffset ?? 0,
      paddingRight: PAGE_OFFSET,
      paddingBottom: forceNoPaddingBottom
        ? 0
        : 28 + (additionalPaddingBottom ?? 0),
      paddingLeft: PAGE_OFFSET,

      overflowY: preventScroll ? "hidden" : undefined,
    }),
    [
      styleProp,
      scrollTopOffset,
      additionalPaddingBottom,
      preventScroll,
      forceNoPaddingBottom,
      marginBottom,
    ]
  );

  return (
    <div className={classes.Page} style={style}>
      {children}
    </div>
  );
}
