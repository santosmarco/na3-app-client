import {
  Divider,
  LabelsTransfPreview,
  LabelsTransfPrintForm,
  Page,
  PageDescription,
  PageTitle,
  Result404,
} from "@components";
import { useBreadcrumb, usePdf } from "@hooks";
import { useNa3TransfLabelTemplates } from "@modules/na3-react";
import type { Na3ApiLabel } from "@modules/na3-types";
import type {
  LabelsTransfPrintFormOnSubmitValues,
  PdfGeneratedDoc,
} from "@types";
import { createTransfLabelFromPrintForm } from "@utils";
import { message, notification } from "antd";
import React, { useCallback, useEffect, useMemo } from "react";

type PageProps = {
  templateId: string;
};

export function LabelsTransfPrintTemplatePage({
  templateId,
}: PageProps): JSX.Element {
  const { setExtra: setBreadcrumbExtra } = useBreadcrumb();

  const {
    loading,
    helpers: { getById: getTemplate },
  } = useNa3TransfLabelTemplates();

  const [labelConfig, setLabelConfig] = React.useState<
    Na3ApiLabel<"transf"> & { copies: number }
  >();

  const labelsPdf = usePdf({ format: [106, 152] });

  const template = useMemo(
    () => getTemplate(templateId),
    [templateId, getTemplate]
  );

  const handleOpenLabelPreview = useCallback(
    (labelConfig: LabelsTransfPrintFormOnSubmitValues) => {
      setLabelConfig({
        ...createTransfLabelFromPrintForm(labelConfig),
        copies: labelConfig.copies,
      });
    },
    []
  );

  const handleCloseLabelPreview = useCallback(() => {
    setLabelConfig(undefined);
  }, []);

  const makeLabels = useCallback(
    (
      {
        customerName,
        date,
        productCode,
        productName,
        productQuantity,
        productUnitAbbreviation,
        batchId,
        invoiceNumber,
      }: Na3ApiLabel<"transf">,
      {
        barcodeDataUrl,
        copies,
        qrDataUrl,
      }: {
        barcodeDataUrl: string;
        copies: number;
        qrDataUrl: string;
      }
    ): PdfGeneratedDoc => {
      const labelHeaderX = 13.512;
      const labelProductQtyX = 27.353;
      const labelDateQtyY = 24.432;
      const labelProductBatchIdY = 141.892;
      const labelQrBarcodeX = 50.385;
      const labelBatchIdInvoiceNumberX = 44.623;

      const pagesArr = Array(copies % 2 === 0 ? copies : copies + 1).fill(
        undefined
      );

      pagesArr.forEach((_, i, arr) => {
        const xOffSet = i === 0 ? 0 : i % 2 === 0 ? 0 : 53;

        labelsPdf.addText(customerName, labelHeaderX + xOffSet, 99.808, {
          maxLines: 1,
          maxWidth: 70,
          rotate: 90,
        });
        labelsPdf.addText(date, labelHeaderX + xOffSet, labelDateQtyY, {
          rotate: 90,
        });
        labelsPdf.addText(
          `${productCode} — ${productName}`,
          labelProductQtyX + xOffSet,
          labelProductBatchIdY,
          { maxLines: 2, maxWidth: 100, rotate: 90 }
        );
        labelsPdf.addText(
          `${productQuantity} ${productUnitAbbreviation}`,
          labelProductQtyX + xOffSet,
          labelDateQtyY,
          { rotate: 90 }
        );
        labelsPdf.addText(
          batchId,
          labelBatchIdInvoiceNumberX + xOffSet,
          labelProductBatchIdY,
          { rotate: 90 }
        );

        invoiceNumber &&
          labelsPdf.addText(
            invoiceNumber,
            labelBatchIdInvoiceNumberX + xOffSet,
            105.094,
            { rotate: 90 }
          );

        qrDataUrl &&
          labelsPdf.addImage(
            qrDataUrl,
            labelQrBarcodeX + xOffSet,
            56.616,
            12.5,
            12.5,
            { rotate: 90 }
          );

        barcodeDataUrl &&
          labelsPdf.addImage(
            barcodeDataUrl,
            labelQrBarcodeX + xOffSet,
            33.528,
            35,
            12.5,
            { rotate: 90 }
          );

        if (xOffSet > 0 && i < arr.length - 1) labelsPdf.addPage();
      });

      return labelsPdf.generate();
    },
    [labelsPdf]
  );

  const handlePrint = useCallback(() => {
    notification.error({
      description:
        "Por favor, opte por salvar como PDF para imprimir manualmente.",
      message: "Função indisponível",
    });
  }, []);

  const handleSave = useCallback(
    (
      label: Na3ApiLabel<"transf">,
      additionalConfig: {
        barcodeDataUrl: string;
        copies: number;
        qrDataUrl: string;
      }
    ) => {
      makeLabels(label, additionalConfig).save(
        `Etiquetas ${label.batchId.trim().toUpperCase()}.pdf`
      );
      void message.success("Download concluído");
      handleCloseLabelPreview();
    },
    [makeLabels, handleCloseLabelPreview]
  );

  useEffect(() => {
    setBreadcrumbExtra(template?.name.trim().toUpperCase());
  }, [template, setBreadcrumbExtra]);

  return template ? (
    <>
      <PageTitle>Imprimir etiqueta</PageTitle>
      <PageDescription>Configure a etiqueta.</PageDescription>

      <Divider marginTop={0} />

      <Page scrollTopOffset={24}>
        <LabelsTransfPrintForm
          onSubmit={handleOpenLabelPreview}
          template={template}
        />
      </Page>

      <LabelsTransfPreview
        copies={labelConfig?.copies}
        label={labelConfig}
        onCancel={handleCloseLabelPreview}
        onPrint={handlePrint}
        onSave={handleSave}
      />
    </>
  ) : (
    <Result404 backUrl="/etiquetas/imprimir" isLoading={loading}>
      O modelo de etiqueta requisitado não existe ou foi desabilitado.
    </Result404>
  );
}
