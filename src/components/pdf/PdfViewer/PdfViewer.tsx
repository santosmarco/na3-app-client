import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import {
  AppstoreOutlined,
  BookOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { Result, Spinner } from "@components";
import { PAGE_CONTAINER_PADDING } from "@constants";
import { useTheme } from "@hooks";
import {
  LocalizationMap,
  SpecialZoomLevel,
  Viewer,
} from "@react-pdf-viewer/core";
import { defaultLayoutPlugin as createDefaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import pt_PT from "@react-pdf-viewer/locales/lib/pt_PT.json";
import { SelectionMode } from "@react-pdf-viewer/selection-mode";
import { Grid, Progress } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import type { PdfViewerToolbarProps } from "../PdfViewerToolbar/PdfViewerToolbar";
import { PdfViewerToolbar } from "../PdfViewerToolbar/PdfViewerToolbar";
import { createReadProgressIndicatorPlugin } from "../plugins/ReadProgressIndicatorPlugin";
import classes from "./PdfViewer.module.css";

type PdfViewerProps = {
  url: string | Promise<string> | (() => Promise<string>);
  readProgressTooltip?: React.ReactNode;
  readProgressTooltipWhenComplete?: React.ReactNode;
  onReadProgressComplete?: () => void;
  readProgressForceComplete?: boolean;
} & Pick<PdfViewerToolbarProps, "disabledActions" | "actionHandlers">;

export function PdfViewer({
  url: urlProp,
  // Read progress
  readProgressTooltip,
  readProgressTooltipWhenComplete,
  onReadProgressComplete,
  readProgressForceComplete,
  // Toolbar
  disabledActions,
  actionHandlers,
}: PdfViewerProps): JSX.Element {
  const [url, setUrl] = useState<string>();
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<Error>();

  const [theme] = useTheme();

  const breakpoint = Grid.useBreakpoint();

  const containerStyle = useMemo(() => {
    const offset = breakpoint.md
      ? PAGE_CONTAINER_PADDING.X.MD
      : PAGE_CONTAINER_PADDING.X.XS;
    return { marginLeft: -offset, marginRight: -offset };
  }, [breakpoint.md]);

  const handleUrlFetchError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      setError(error);
    } else {
      setError(new Error("Não foi possível carregar o documento."));
    }
  }, []);

  useEffect(() => {
    if (urlProp instanceof Promise || typeof urlProp === "function") {
      setLoading(true);
      const urlFetchPromise = urlProp instanceof Promise ? urlProp : urlProp();
      urlFetchPromise
        .then(setUrl)
        .catch(handleUrlFetchError)
        .finally(() => setLoading(false));
    } else {
      setUrl(urlProp);
    }
  }, [urlProp, handleUrlFetchError]);

  const defaultLayoutPlugin = createDefaultLayoutPlugin({
    renderToolbar: (Toolbar) => {
      const { ReadProgressIndicator } = readProgressIndicatorPlugin;
      return (
        <>
          <Toolbar>
            {(slots) => (
              <PdfViewerToolbar
                slots={slots}
                disabledActions={disabledActions}
                actionHandlers={actionHandlers}
              />
            )}
          </Toolbar>
          <ReadProgressIndicator />
        </>
      );
    },
    toolbarPlugin: {
      selectionModePlugin: { selectionMode: SelectionMode.Hand },
    },
    sidebarTabs: (defaultTabs) => [
      { ...defaultTabs[0], icon: <AppstoreOutlined />, title: "Miniaturas" },
      { ...defaultTabs[1], icon: <BookOutlined />, title: "Marcadores" },
      { ...defaultTabs[2], icon: <FileOutlined />, title: "Anexos" },
    ],
  });

  const readProgressIndicatorPlugin = createReadProgressIndicatorPlugin({
    tooltip: readProgressTooltip,
    tooltipWhenComplete: readProgressTooltipWhenComplete,
    onComplete: onReadProgressComplete,
    forceComplete: readProgressForceComplete,
  });

  return (
    <div className={classes.PdfViewerContainer} style={containerStyle}>
      {loading ? (
        <div className={classes.PdfViewerLoading}>
          <Spinner text="Carregando documento..." />
        </div>
      ) : (
        url && (
          <Viewer
            localization={pt_PT as unknown as LocalizationMap}
            fileUrl={url}
            theme={theme}
            defaultScale={SpecialZoomLevel.PageFit}
            renderLoader={(percentage) => (
              <Progress
                type="circle"
                percent={Math.round(percentage)}
                width={80}
              />
            )}
            renderError={(loadError) => (
              <Result
                status="error"
                title="Algo deu errado"
                description={
                  error?.message ||
                  loadError.message ||
                  "Não foi possível carregar o documento."
                }
              />
            )}
            plugins={[defaultLayoutPlugin, readProgressIndicatorPlugin]}
          />
        )
      )}
    </div>
  );
}
