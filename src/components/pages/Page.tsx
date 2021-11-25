import React from "react";

import classes from "./Page.module.css";

type PageProps = {
  additionalPaddingBottom: number;
  children?: React.ReactNode;
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
  style,
}: PageProps): JSX.Element {
  return (
    <div
      className={classes.Page}
      style={{
        ...style,
        ...(additionalPaddingBottom && {
          paddingBottom: 32 + additionalPaddingBottom,
        }),
        ...(scrollTopOffset && {
          marginTop: -scrollTopOffset,
          paddingTop: scrollTopOffset,
        }),
      }}
    >
      {children}
    </div>
  );
}

Page.defaultProps = defaultProps;
