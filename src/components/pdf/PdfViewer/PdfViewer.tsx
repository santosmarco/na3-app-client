import React from "react";

type PdfViewerProps = {
  url: string;
};

export function PdfViewer({ url }: PdfViewerProps): JSX.Element {
  return <iframe src={`${url}#toolbar=0`} />;
}
