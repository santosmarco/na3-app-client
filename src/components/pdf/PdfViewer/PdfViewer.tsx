import { Divider, Spinner } from "@components";
import React, { useMemo } from "react";

import classes from "./PdfViewer.module.css";

type PdfViewerProps = {
  url: string | undefined;
  title: string;
  actions?: React.ReactNode;
  className?: string;
  disabled?: React.ReactNode;
};

export function PdfViewer({
  url,
  title,
  actions,
  className,
  disabled,
}: PdfViewerProps): JSX.Element {
  const isLoading = useMemo(() => !disabled && !url, [disabled, url]);

  return (
    <Spinner
      spinning={isLoading}
      text="Carregando documento..."
      wrapperClassName={[classes.PdfViewerContainer, className]
        .filter(
          (className): className is NonNullable<typeof className> => !!className
        )
        .join(" ")}
    >
      {/* Needed for spinner positioning */}
      <div />

      {disabled
        ? disabled
        : url && (
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
