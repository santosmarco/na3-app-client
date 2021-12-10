import { Divider, Spinner } from "@components";
import React from "react";

import classes from "./PdfViewer.module.css";

type PdfViewerProps = {
  actions?: React.ReactNode;
  className?: string;
  url: string | undefined;
};

export function PdfViewer({
  url,
  className,
  actions,
}: PdfViewerProps): JSX.Element {
  return (
    <Spinner
      spinning={!url}
      text="Carregando documento..."
      wrapperClassName={`${classes.PdfViewerContainer} ${
        className || ""
      }`.trim()}
    >
      {url && (
        <>
          <iframe className={classes.PdfViewer} src={`${url}#toolbar=0`} />

          {actions && (
            <>
              <Divider />
              {actions}
            </>
          )}
        </>
      )}
    </Spinner>
  );
}
