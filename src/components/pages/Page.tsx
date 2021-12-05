import { PAGE_OFFSET } from "@constants";
import React, { useMemo } from "react";

import classes from "./Page.module.css";

type PageProps = {
  additionalPaddingBottom: number;
  children?: React.ReactNode;
  preventScroll?: boolean;
  scrollTopOffset?: number;
  style?: React.CSSProperties;
};

const defaultProps: PageProps = {
  additionalPaddingBottom: 0,
  children: undefined,
  scrollTopOffset: 0,
  style: undefined,
};

export function Page({
  children,
  scrollTopOffset,
  additionalPaddingBottom,
  style: styleProp,
  preventScroll,
}: PageProps): JSX.Element {
  const style = useMemo(
    () => ({
      ...styleProp,

      marginTop: -(scrollTopOffset || 0),
      marginBottom: 0,
      marginLeft: -PAGE_OFFSET,
      marginRight: -PAGE_OFFSET,

      paddingTop: scrollTopOffset || 0,
      paddingBottom: 32 + (additionalPaddingBottom || 0),
      paddingLeft: PAGE_OFFSET,
      paddingRight: PAGE_OFFSET,

      overflowY: preventScroll ? "hidden" : undefined,
    }),
    [styleProp, scrollTopOffset, additionalPaddingBottom, preventScroll]
  );

  return (
    <div
      className={classes.Page}
      style={{
        ...style,

        marginTop: -(scrollTopOffset || 0),
        marginBottom: 0,
        marginLeft: -PAGE_OFFSET,
        marginRight: -PAGE_OFFSET,

        paddingTop: scrollTopOffset || 0,
        paddingBottom: 28 + (additionalPaddingBottom || 0),
        paddingLeft: PAGE_OFFSET,
        paddingRight: PAGE_OFFSET,

        overflowY: preventScroll ? "hidden" : undefined,
      }}
    >
      {children}
    </div>
  );
}

Page.defaultProps = defaultProps;
