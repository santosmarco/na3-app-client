import type { Slot } from "@react-pdf-viewer/core";
import React from "react";

import { PdfViewerPageWatermark } from "./PdfViewerPageWatermark/PdfViewerPageWatermark";

export type PdfViewerWatermarkOptions = {
  component: React.ReactNode | undefined;
  scale?: number;
};

type PdfViewerPageProps = {
  viewLayers: {
    canvas: Slot;
    annotation: Slot;
    text: Slot;
  };
  scale?: number;
  watermarkOptions?: PdfViewerWatermarkOptions;
};

export function PdfViewerPage({
  viewLayers: { canvas, annotation, text },
  scale,
  watermarkOptions,
}: PdfViewerPageProps): JSX.Element {
  return (
    <>
      {canvas.children}

      {watermarkOptions?.component && (
        <PdfViewerPageWatermark
          scale={(scale ?? 1) * (watermarkOptions.scale ?? 1)}
        >
          {watermarkOptions.component}
        </PdfViewerPageWatermark>
      )}

      {annotation.children}
      {text.children}
    </>
  );
}
