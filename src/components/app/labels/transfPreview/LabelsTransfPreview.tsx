import labelLayout from "@assets/labelsTransfLayout.svg";
import { Divider, Grid, Modal, Typography } from "antd";
import barcode from "jsbarcode";
import QrCode from "qrcode";
import React, { useCallback, useMemo, useState } from "react";

import type { Na3ApiLabel } from "../../../../modules/na3-types";
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
    if (!(label && copies && qrDataUrl && barcodeDataUrl)) return;
    onPrint(label, { barcodeDataUrl, copies, qrDataUrl });
  }, [onPrint, label, copies, qrDataUrl, barcodeDataUrl]);

  const handleSave = useCallback(() => {
    if (!(label && copies && qrDataUrl && barcodeDataUrl)) return;
    onSave(label, { barcodeDataUrl, copies, qrDataUrl });
  }, [onSave, label, copies, qrDataUrl, barcodeDataUrl]);

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
    <Modal
      centered={true}
      destroyOnClose={true}
      footer={
        <PreviewFooter
          onCancel={onCancel}
          onPrint={handlePrint}
          onSave={handleSave}
        />
      }
      onCancel={onCancel}
      title="Pré-visualização"
      visible={!!label}
      width={breakpoint.lg ? "65%" : breakpoint.md ? "80%" : undefined}
    >
      {label && (
        <>
          <div className={classes.LabelPreview}>
            <img alt="Layout impresso da etiqueta" src={labelLayout} />

            <PreviewData x="32.6%" y="19%">
              {label.customerName.toUpperCase()}
            </PreviewData>

            <PreviewData x="82%" y="19%">
              {label.date.toUpperCase()}
            </PreviewData>

            <PreviewData w="70%" x="4.9%" y="45.5%">
              {label.productCode.toUpperCase()} —{" "}
              {label.productName.toUpperCase()}
            </PreviewData>

            <PreviewData x="82%" y="45.5%">
              {label.productQuantity}{" "}
              {label.productUnitAbbreviation.toUpperCase()}
            </PreviewData>

            <PreviewData x="4.9%" y="78%">
              {label.batchId.toUpperCase()}
            </PreviewData>

            {label.invoiceNumber && (
              <PreviewData x="29%" y="78%">
                {label.invoiceNumber.toUpperCase()}
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
    </Modal>
  );
}
