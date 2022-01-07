import {
  Divider,
  Form,
  FormCollapse,
  FormField,
  SubmitButton,
} from "@components";
import { useForm } from "@hooks";
import { na3 } from "@modules/na3";
import { useNa3Departments } from "@modules/na3-react";
import type { Na3TransfLabelTemplate } from "@modules/na3-types";
import type { LabelsTransfPrintFormOnSubmitValues } from "@types";
import { formatProductUnit, timestamp } from "@utils";
import { Col, Row } from "antd";
import dayjs from "dayjs";
import React, { useCallback, useMemo, useState } from "react";

type LabelsTransfPrintFormProps = {
  onSubmit: (labelConfig: LabelsTransfPrintFormOnSubmitValues) => void;
  template: Na3TransfLabelTemplate;
};

type FormValues = {
  batchId: string;
  copies: string;
  customerName: string;
  date: string;
  invoiceNumber: string;
  productCode: string;
  productName: string;
  productQuantity: string;
  productUnitDisplay: string;
};

export function LabelsTransfPrintForm({
  template,
  onSubmit,
}: LabelsTransfPrintFormProps): JSX.Element {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const departments = useNa3Departments();

  const form = useForm<FormValues>({
    defaultValues: {
      batchId: "",
      copies: "",
      customerName: template.customerName.trim().toUpperCase(),
      date: timestamp(),
      invoiceNumber: "",
      productCode: template.productCode.trim().toUpperCase(),
      productName: template.productName.trim().toUpperCase(),
      productQuantity: "",
      productUnitDisplay: formatProductUnit(
        template.productUnitName,
        template.productUnitAbbreviation
      ),
    },
  });

  const handleBatchIdValidate = useCallback((value: string) => {
    if (!na3.batchId(value).isValid) {
      return "Número de lote inválido";
    }
  }, []);

  const handleDateChange = useCallback(
    (dateValue: string) => {
      const date = dayjs(dateValue);
      if (!date.isSame(selectedDate)) {
        setSelectedDate(date);
      }
    },
    [selectedDate]
  );

  const handleSubmit = useCallback(
    ({
      batchId,
      copies,
      customerName,
      date,
      invoiceNumber,
      productCode,
      productName,
      productQuantity,
    }: FormValues): void => {
      onSubmit({
        ...template,
        batchId: na3.batchId(batchId).value,
        copies: parseInt(copies),
        customerName,
        date: dayjs(date).format("DD/MM/YYYY"),
        invoiceNumber,
        productCode,
        productName,
        productQuantity: productQuantity,
        templateId: template.id,
      });
    },
    [onSubmit, template]
  );

  const dptTwoLetterId = useMemo(() => {
    return (
      (template.departmentId &&
        departments.helpers.getById(template.departmentId)?.twoLetterId) ||
      null
    );
  }, [template.departmentId, departments.helpers]);

  const batchIdDateChunks = useMemo(
    () => [
      ...selectedDate.format("YY").split(""),
      ...selectedDate.clone().dayOfYear().toString().padStart(3, "0").split(""),
    ],
    [selectedDate]
  );

  return (
    <Form form={form} onSubmit={handleSubmit}>
      <Row gutter={16}>
        <Col md={18} sm={16} xs={24}>
          <FormField
            disabled={true}
            label="Cliente"
            name="customerName"
            rules={null}
            type="input"
          />
        </Col>
        <Col md={6} sm={8} xs={24}>
          <FormField
            label="Data"
            name="date"
            onValueChange={handleDateChange}
            rules={{ required: "Defina a data" }}
            type="date"
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col lg={4} md={6} xs={24}>
          <FormField
            disabled={true}
            label="Código do produto"
            name="productCode"
            rules={null}
            type="input"
          />
        </Col>
        <Col lg={14} md={12} sm={16} xs={24}>
          <FormField
            disabled={true}
            label="Produto"
            name="productName"
            rules={null}
            type="input"
          />
        </Col>
        <Col md={6} sm={8} xs={24}>
          <FormField
            disabled={true}
            label="Unidade"
            name="productUnitDisplay"
            rules={null}
            type="input"
          />
        </Col>
      </Row>

      <Divider />

      <Row gutter={16}>
        <Col lg={12} md={11} sm={8} xs={24}>
          <FormField
            autoUpperCase={true}
            label="Lote"
            mask={
              template.batchIdFormat === "mexico"
                ? [
                    /k/i,
                    /a/i,
                    "-",
                    /[cnr]/i,
                    /[itn]/i,
                    "-",
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    " ",
                    /[a-g]/i,
                  ]
                : template.batchIdFormat === "brazil"
                ? [
                    dptTwoLetterId
                      ? new RegExp(String.raw`${dptTwoLetterId[0]}`, "i")
                      : /[c-fikr]/i,
                    dptTwoLetterId
                      ? new RegExp(String.raw`${dptTwoLetterId[1]}`, "i")
                      : /[a-dfgk-mx]/i,
                    /[0-3]/,
                    /\d/,
                    "-",
                    /\d/,
                    /\d/,
                    /\d/,
                    "-",
                    ...batchIdDateChunks.map(
                      (chunk) => new RegExp(String.raw`${chunk}`)
                    ),
                    " ",
                    /[a-g]/i,
                  ]
                : [
                    dptTwoLetterId
                      ? new RegExp(String.raw`${dptTwoLetterId[0]}`, "i")
                      : /[c-fikr]/i,
                    dptTwoLetterId
                      ? new RegExp(String.raw`${dptTwoLetterId[1]}`, "i")
                      : /[a-dfgk-mx]/i,
                    "-",
                    /\d/,
                    /\d/,
                    /\d/,
                    "-",
                    new RegExp(String.raw`${batchIdDateChunks[0]}`),
                    new RegExp(String.raw`${batchIdDateChunks[1]}`),
                    " ",
                    /[a-g]/i,
                  ]
            }
            maskPlaceholder={
              template.batchIdFormat === "mexico"
                ? "KA-__-____ _"
                : template.batchIdFormat === "brazil"
                ? `${dptTwoLetterId || "__"}__-___-${batchIdDateChunks.join(
                    ""
                  )} _`
                : `${dptTwoLetterId || "__"}-___-${batchIdDateChunks
                    .slice(0, 2)
                    .join("")} _`
            }
            name="batchId"
            rules={{
              required: "Informe o número do lote",
              validate: handleBatchIdValidate,
            }}
            tooltip={{
              content: (
                <>
                  Formato:{" "}
                  <strong>
                    {template.batchIdFormat === "commercial"
                      ? "COMERCIAL"
                      : template.batchIdFormat === "mexico"
                      ? "MÉXICO"
                      : "BRASIL"}
                  </strong>
                </>
              ),
            }}
            type="mask"
          />
        </Col>

        <Col lg={6} md={7} sm={8} xs={24}>
          <FormField
            defaultHelp={
              template.productSnapshot &&
              `Máx./caixa: ${template.productSnapshot.perCarton
                .toString()
                .replace(".", ",")} ${template.productUnitName.toLowerCase()}`
            }
            label="Valor de quantidade"
            max={/* template.productSnapshot?.perCarton */ undefined}
            maxLength={8}
            name="productQuantity"
            rules={{
              min: { message: "Deve ser maior que zero", value: 0 },
              required: "Defina a quantidade na caixa",
              /* TEMPORARILY DISABLED:

              ...(template.productSnapshot?.perCarton && {
                max: {
                  message: "Deve ser menor que o máx./caixa",
                  value: template.productSnapshot.perCarton,
                },
              }),
              */
            }}
            suffix={template.productUnitName.toLowerCase()}
            tooltip={{
              content: (
                <>
                  Unidade:{" "}
                  <strong>{template.productUnitName.toUpperCase()}</strong>
                  {template.productSnapshot && (
                    <>
                      <br />
                      Máx./caixa:{" "}
                      <strong>
                        {template.productSnapshot.perCarton
                          .toString()
                          .replace(".", ",")}
                      </strong>
                    </>
                  )}
                </>
              ),
            }}
            type="number"
          />
        </Col>

        <Col md={6} sm={8} xs={24}>
          <FormField
            label="Qtd. de cópias"
            name="copies"
            noDecimal={true}
            rules={{
              min: { message: "Deve ser maior que zero", value: 0 },
              required: "Defina a quantidade na caixa",
            }}
            suffix="etiquetas"
            type="number"
          />
        </Col>
      </Row>

      <FormCollapse title="Mais...">
        <FormField
          label="Nº da NF"
          maxLength={8}
          name="invoiceNumber"
          noDecimal={true}
          required={false}
          rules={null}
          type="number"
        />
      </FormCollapse>

      <SubmitButton label="Pré-visualizar" labelWhenLoading="Aguardando..." />
    </Form>
  );
}
