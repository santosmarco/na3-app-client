import { Divider, Spinner } from "@components";
import React from "react";

import classes from "./PdfViewer.module.css";

type PdfViewerProps = {
  url: string | undefined;
  title: string;
  actions?: React.ReactNode;
  className?: string;
};

export function PdfViewer({
  url,
  title,
  actions,
  className,
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
          <iframe
            title={title}
            className={classes.PdfViewer}
            src={`${url}#toolbar=0`}
          />

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
