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
import { PdfViewerToolbarHeader } from "../PdfViewerToolbarHeader/PdfViewerToolbarHeader";
import classes from "./PdfViewerToolbar.module.css";

export type PdfViewerToolbarActionId =
  | "download"
  | "fullscreen"
  | "info"
  | "navigate"
  | "nextPage"
  | "prevPage"
  | "print"
  | "search"
  | "zoom"
  | "zoomIn"
  | "zoomOut";

export type PdfViewerToolbarProps = {
  slots: ToolbarSlot;
  docTitle: string;
  disabledActions?: Array<PdfViewerToolbarActionId | undefined>;
  actionHandlers?: Partial<
    Record<PdfViewerToolbarActionId, (onClick: () => void) => void>
  >;
  docVersion?: number;
  hideHeader?: boolean;
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
  docTitle,
  docVersion,
  hideHeader,
}: PdfViewerToolbarProps): JSX.Element {
  const checkActionIsEnabled = useCallback(
    (actionId: PdfViewerToolbarActionId) =>
      !disabledActions?.includes(actionId),
    [disabledActions]
  );

  const registerActionClickHandler = useCallback(
    (actionId: PdfViewerToolbarActionId, action: { onClick: () => void }) => {
      const originalHandler = action.onClick;
      const userDefinedHandler = actionHandlers?.[actionId];

      return userDefinedHandler
        ? (): void => {
            userDefinedHandler(originalHandler);
          }
        : originalHandler;
    },
    [actionHandlers]
  );

  return (
    <>
      {!hideHeader && (
        <PdfViewerToolbarHeader docTitle={docTitle} docVersion={docVersion} />
      )}

      <div className={classes.Toolbar}>
        <div className={classes.ToolbarActions}>
          {checkActionIsEnabled("search") && (
            <ShowSearchPopover>
              {(action): JSX.Element => (
                <PdfViewerToolbarButton
                  icon={<SearchOutlined />}
                  label="Buscar"
                  labelPlacement="left"
                  onClick={registerActionClickHandler("search", action)}
                />
              )}
            </ShowSearchPopover>
          )}

          {checkActionIsEnabled("prevPage") && (
            <GoToPreviousPage>
              {(action): JSX.Element => (
                <PdfViewerToolbarButton
                  disabled={action.isDisabled}
                  icon={<UpOutlined />}
                  label="Página anterior"
                  labelPlacement="left"
                  onClick={registerActionClickHandler("prevPage", action)}
                />
              )}
            </GoToPreviousPage>
          )}

          {checkActionIsEnabled("navigate") && <CurrentPageInput />}

          {checkActionIsEnabled("nextPage") && (
            <GoToNextPage>
              {(action): JSX.Element => (
                <PdfViewerToolbarButton
                  disabled={action.isDisabled}
                  icon={<DownOutlined />}
                  label="Próxima página"
                  onClick={registerActionClickHandler("nextPage", action)}
                />
              )}
            </GoToNextPage>
          )}
        </div>

        <div className={classes.ToolbarActions}>
          {checkActionIsEnabled("zoomOut") && (
            <ZoomOut>
              {(action): JSX.Element => (
                <PdfViewerToolbarButton
                  icon={<ZoomOutOutlined />}
                  label="Menos zoom"
                  onClick={registerActionClickHandler("zoomOut", action)}
                />
              )}
            </ZoomOut>
          )}

          {checkActionIsEnabled("zoom") && <Zoom />}

          {checkActionIsEnabled("zoomIn") && (
            <ZoomIn>
              {(action): JSX.Element => (
                <PdfViewerToolbarButton
                  icon={<ZoomInOutlined />}
                  label="Mais zoom"
                  onClick={registerActionClickHandler("zoomIn", action)}
                />
              )}
            </ZoomIn>
          )}
        </div>

        <div className={classes.ToolbarActions}>
          {checkActionIsEnabled("fullscreen") && (
            <EnterFullScreen>
              {(action): JSX.Element => (
                <PdfViewerToolbarButton
                  icon={<FullscreenOutlined />}
                  label="Tela cheia"
                  onClick={registerActionClickHandler("fullscreen", action)}
                />
              )}
            </EnterFullScreen>
          )}

          {checkActionIsEnabled("download") && (
            <Download>
              {(action): JSX.Element => (
                <PdfViewerToolbarButton
                  icon={<DownloadOutlined />}
                  label="Baixar"
                  onClick={registerActionClickHandler("download", action)}
                />
              )}
            </Download>
          )}

          {checkActionIsEnabled("print") && (
            <Print>
              {(action): JSX.Element => (
                <PdfViewerToolbarButton
                  icon={<PrinterOutlined />}
                  label="Imprimir"
                  onClick={registerActionClickHandler("print", action)}
                />
              )}
            </Print>
          )}

          {checkActionIsEnabled("info") && (
            <ShowProperties>
              {(action): JSX.Element => (
                <PdfViewerToolbarButton
                  icon={<InfoCircleOutlined />}
                  label="Informações"
                  labelPlacement="right"
                  onClick={registerActionClickHandler("info", action)}
                />
              )}
            </ShowProperties>
          )}
        </div>
      </div>
    </>
  );
}
