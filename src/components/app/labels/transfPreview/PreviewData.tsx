import type { CSSProperties } from "react";
import React from "react";

type PreviewDataProps = {
  children: React.ReactNode;
  w?: CSSProperties["width"];
  x: CSSProperties["top"];
  y: CSSProperties["left"];
};

const defaultProps: Omit<PreviewDataProps, "children" | "x" | "y"> = {
  w: undefined,
};

export function PreviewData({
  x,
  y,
  w,
  children,
}: PreviewDataProps): JSX.Element {
  return (
    <code style={{ left: x, position: "absolute", top: y, width: w }}>
      {children}
    </code>
  );
}

PreviewData.defaultProps = defaultProps;
