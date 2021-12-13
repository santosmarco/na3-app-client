import {
  DownloadOutlined,
  DownOutlined,
  FullscreenOutlined,
  InfoCircleOutlined,
  PrinterOutlined,
  SearchOutlined,
  UpOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import type { ToolbarSlot } from "@react-pdf-viewer/default-layout";
import React, { useCallback } from "react";

import { PdfViewerToolbarButton } from "../PdfViewerToolbarButton/PdfViewerToolbarButton";
import classes from "./PdfViewerToolbar.module.css";

export type PdfViewerToolbarActionId =
  | "search"
  | "prevPage"
  | "navigate"
  | "nextPage"
  | "zoomOut"
  | "zoom"
  | "zoomIn"
  | "fullscreen"
  | "download"
  | "print"
  | "info";

export type PdfViewerToolbarProps = {
  slots: ToolbarSlot;
  disabledActions?: (PdfViewerToolbarActionId | undefined)[];
  actionHandlers?: Partial<
    Record<PdfViewerToolbarActionId, (onClick: () => void) => void>
  >;
};

export function PdfViewerToolbar({
  slots: {
    // Left
    ShowSearchPopover,
    GoToPreviousPage,
    CurrentPageInput,
    GoToNextPage,
    // Center
    ZoomOut,
    Zoom,
    ZoomIn,
    // Right
    EnterFullScreen,
    Download,
    Print,
    ShowProperties,
  },
  disabledActions,
  actionHandlers,
}: PdfViewerToolbarProps): JSX.Element {
  const checkActionIsEnabled = useCallback(
    (actionId: PdfViewerToolbarActionId) =>
      !disabledActions?.includes(actionId),
    [disabledActions]
  );

  const registerActionClickHandler = useCallback(
    (actionId: PdfViewerToolbarActionId, action: { onClick: () => void }) => {
      const originalHandler = action.onClick;
      const userDefinedHandler = actionHandlers && actionHandlers[actionId];

      return userDefinedHandler
        ? () => userDefinedHandler(originalHandler)
        : originalHandler;
    },
    [actionHandlers]
  );

  return (
    <div className={classes.Toolbar}>
      <div className={classes.ToolbarActions}>
        {checkActionIsEnabled("search") && (
          <ShowSearchPopover>
            {(action) => (
              <PdfViewerToolbarButton
                label="Buscar"
                icon={<SearchOutlined />}
                onClick={registerActionClickHandler("search", action)}
                labelPlacement="left"
              />
            )}
          </ShowSearchPopover>
        )}

        {checkActionIsEnabled("prevPage") && (
          <GoToPreviousPage>
            {(action) => (
              <PdfViewerToolbarButton
                label="Página anterior"
                icon={<UpOutlined />}
                onClick={registerActionClickHandler("prevPage", action)}
                labelPlacement="left"
                disabled={action.isDisabled}
              />
            )}
          </GoToPreviousPage>
        )}

        {checkActionIsEnabled("navigate") && <CurrentPageInput />}

        {checkActionIsEnabled("nextPage") && (
          <GoToNextPage>
            {(action) => (
              <PdfViewerToolbarButton
                label="Próxima página"
                icon={<DownOutlined />}
                onClick={registerActionClickHandler("nextPage", action)}
                disabled={action.isDisabled}
              />
            )}
          </GoToNextPage>
        )}
      </div>

      <div className={classes.ToolbarActions}>
        {checkActionIsEnabled("zoomOut") && (
          <ZoomOut>
            {(action) => (
              <PdfViewerToolbarButton
                label="Menos zoom"
                icon={<ZoomOutOutlined />}
                onClick={registerActionClickHandler("zoomOut", action)}
              />
            )}
          </ZoomOut>
        )}

        {checkActionIsEnabled("zoom") && <Zoom />}

        {checkActionIsEnabled("zoomIn") && (
          <ZoomIn>
            {(action) => (
              <PdfViewerToolbarButton
                label="Mais zoom"
                icon={<ZoomInOutlined />}
                onClick={registerActionClickHandler("zoomIn", action)}
              />
            )}
          </ZoomIn>
        )}
      </div>

      <div className={classes.ToolbarActions}>
        {checkActionIsEnabled("fullscreen") && (
          <EnterFullScreen>
            {(action) => (
              <PdfViewerToolbarButton
                label="Tela cheia"
                icon={<FullscreenOutlined />}
                onClick={registerActionClickHandler("fullscreen", action)}
              />
            )}
          </EnterFullScreen>
        )}

        {checkActionIsEnabled("download") && (
          <Download>
            {(action) => (
              <PdfViewerToolbarButton
                label="Baixar"
                icon={<DownloadOutlined />}
                onClick={registerActionClickHandler("download", action)}
              />
            )}
          </Download>
        )}

        {checkActionIsEnabled("print") && (
          <Print>
            {(action) => (
              <PdfViewerToolbarButton
                label="Imprimir"
                icon={<PrinterOutlined />}
                onClick={registerActionClickHandler("print", action)}
              />
            )}
          </Print>
        )}

        {checkActionIsEnabled("info") && (
          <ShowProperties>
            {(action) => (
              <PdfViewerToolbarButton
                label="Informações"
                icon={<InfoCircleOutlined />}
                onClick={registerActionClickHandler("info", action)}
                labelPlacement="right"
              />
            )}
          </ShowProperties>
        )}
      </div>
    </div>
  );
}
