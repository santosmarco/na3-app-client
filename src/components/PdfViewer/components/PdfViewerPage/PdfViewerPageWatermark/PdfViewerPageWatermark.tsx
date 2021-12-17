import React, { useMemo } from "react";

import classes from "./PdfViewerPageWatermark.module.css";

type PdfViewerPageWatermarkProps = {
  children: React.ReactNode;
  scale: number;
};

export function PdfViewerPageWatermark({
  children,
  scale,
}: PdfViewerPageWatermarkProps): JSX.Element {
  const watermarkStyle = useMemo(
    () => ({
      zoom: scale,
      "-moz-transform": `scale(${scale})`,
    }),
    [scale]
  );

  return (
    <div className={classes.WatermarkContainer}>
      <div className={classes.Watermark} style={watermarkStyle}>
        {children}
      </div>
    </div>
  );
}
