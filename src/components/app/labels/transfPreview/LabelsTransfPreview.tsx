import labelLayout from "@assets/labelsTransfLayout.svg";
import { Divider, ModalWide } from "@components";
import type { Na3ApiLabel } from "@modules/na3-types";
import { Grid, Typography } from "antd";
import barcode from "jsbarcode";
import QrCode from "qrcode";
import React, { useCallback, useMemo, useState } from "react";

import classes from "./LabelsTransfPreview.module.css";
import { PreviewData } from "./PreviewData";
import { PreviewFooter } from "./PreviewFooter";

type LabelsTransfPreviewProps = {
  copies: number | undefined;
  label: Na3ApiLabel<"transf"> | undefined;
  onCancel: () => void;
  onPrint: (
    label: Na3ApiLabel<"transf">,
    additionalConfig: {
      barcodeDataUrl: string;
      copies: number;
      qrDataUrl: string;
    }
  ) => void;
  onSave: (
    label: Na3ApiLabel<"transf">,
    additionalConfig: {
      barcodeDataUrl: string;
      copies: number;
      qrDataUrl: string;
    }
  ) => void;
};

export function LabelsTransfPreview({
  copies,
  onCancel,
  onPrint,
  onSave,
  label,
}: LabelsTransfPreviewProps): JSX.Element {
  const [qrDataUrl, setQrDataUrl] = useState<string>();
  const [barcodeDataUrl, setBarcodeDataUrl] = useState<string>();

  const breakpoint = Grid.useBreakpoint();

  const labelLatestVersion = useMemo((): Na3ApiLabel<"transf"> | undefined => {
    if (!label) {
      return;
    }

    // Update #1
    // Due to some problems with Delly and other clients, we were requested to
    // move the Shift ID (A, B, C, ...) to the right of the label's date and
    // off from the Batch ID.
    const labelShift = label.batchId.slice(-1);
    // Here, we move the Shift ID to the right of the date.
    const labelDate = `${label.date} ${labelShift}`;
    // Here, we remove the Shift ID from the Batch ID.
    const labelBatchId = label.batchId.slice(0, -1);

    return { ...label, date: labelDate, batchId: labelBatchId };
  }, [label]);

  const handleMakeQrCode = useCallback(
    async (canvasEl: HTMLCanvasElement | null) => {
      if (!canvasEl || !label?.batchId) return;
      const qrData = `https://app.novaa3.com.br/transf/${label.batchId
        .trim()
        .toUpperCase()
        .replace(/[- ]/g, "")}`;
      await QrCode.toCanvas(canvasEl, qrData, {
        color: {
          light: "#0000", // Transparent
        },
        margin: 0,
        width: 72,
      });
      setQrDataUrl(canvasEl.toDataURL());
    },
    [label?.batchId]
  );

  const handleMakeBarcode = useCallback(
    (canvasEl: HTMLCanvasElement | null) => {
      if (!canvasEl || !label?.productCode) return;
      barcode(canvasEl, label.productCode, {
        background: "#0000",
        margin: 0, // Transparent
      });
      setBarcodeDataUrl(canvasEl.toDataURL());
    },
    [label?.productCode]
  );

  const handlePrint = useCallback(() => {
    if (!(labelLatestVersion && copies && qrDataUrl && barcodeDataUrl)) return;
    onPrint(labelLatestVersion, { barcodeDataUrl, copies, qrDataUrl });
  }, [onPrint, labelLatestVersion, copies, qrDataUrl, barcodeDataUrl]);

  const handleSave = useCallback(() => {
    if (!(labelLatestVersion && copies && qrDataUrl && barcodeDataUrl)) return;
    onSave(labelLatestVersion, { barcodeDataUrl, copies, qrDataUrl });
  }, [onSave, labelLatestVersion, copies, qrDataUrl, barcodeDataUrl]);

  const qrCanvasStyle = useMemo(
    (): React.CSSProperties => ({
      left: "54.65%",
      position: "absolute",
      top: "72.6%",
      visibility: breakpoint.md ? "visible" : "hidden",
    }),
    [breakpoint.md]
  );

  const barcodeCanvasStyle = useMemo(
    (): React.CSSProperties => ({
      height: "22.2%",
      left: "70.35%",
      position: "absolute",
      top: "72.6%",
      width: "20.2%",
    }),
    []
  );

  return (
    <ModalWide
      centered={true}
      footer={
        <PreviewFooter
          onCancel={onCancel}
          onPrint={handlePrint}
          onSave={handleSave}
        />
      }
      onClose={onCancel}
      title="Pré-visualização"
      visible={!!labelLatestVersion}
    >
      {labelLatestVersion && (
        <>
          <div className={classes.LabelPreview}>
            <img alt="Layout impresso da etiqueta" src={labelLayout} />

            <PreviewData x="32.6%" y="19%">
              {labelLatestVersion.customerName.toUpperCase()}
            </PreviewData>

            <PreviewData x="82%" y="19%">
              {labelLatestVersion.date.toUpperCase()}
            </PreviewData>

            <PreviewData w="70%" x="4.9%" y="45.5%">
              {labelLatestVersion.productCode.toUpperCase()} —{" "}
              {labelLatestVersion.productName.toUpperCase()}
            </PreviewData>

            <PreviewData x="82%" y="45.5%">
              {labelLatestVersion.productQuantity}{" "}
              {labelLatestVersion.productUnitAbbreviation.toUpperCase()}
            </PreviewData>

            <PreviewData x="4.9%" y="78%">
              {labelLatestVersion.batchId.toUpperCase()}
            </PreviewData>

            {labelLatestVersion.invoiceNumber && (
              <PreviewData x="29%" y="78%">
                {labelLatestVersion.invoiceNumber.toUpperCase()}
              </PreviewData>
            )}

            <canvas ref={handleMakeQrCode} style={qrCanvasStyle} />

            <canvas ref={handleMakeBarcode} style={barcodeCanvasStyle} />
          </div>

          <Divider />

          <div className={classes.Footer}>
            <Typography.Text>Nº de cópias: {copies}</Typography.Text>
          </div>
        </>
      )}
    </ModalWide>
  );
}
