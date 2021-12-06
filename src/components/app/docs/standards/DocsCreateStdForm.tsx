import type { UploadFile } from "@components";
import {
  Divider,
  Form,
  FormField,
  FormItem,
  Na3PositionSelect,
  SubmitButton,
} from "@components";
import { useForm } from "@hooks";
import { useNa3Departments, useNa3StdDocs } from "@modules/na3-react";
import type { Na3PositionId, Na3StdDocumentType } from "@modules/na3-types";
import { createErrorNotifier, getStdDocTypeSelectOptions } from "@utils";
import { Col, Modal, notification, Row } from "antd";
import dayjs from "dayjs";
import React, { useCallback, useState } from "react";

type DocsCreateStdFormProps = {
  onSubmit?: () => void;
};

type FormValues = {
  code: string;
  description: string;
  file: UploadFile[];
  nextRevisionAt: string;
  timeBetweenRevisionsDays: string;
  title: string;
  type: Na3StdDocumentType | "";
  versionNumber: string;
};

export function DocsCreateStdForm({
  onSubmit,
}: DocsCreateStdFormProps): JSX.Element {
  const [viewerPosIds, setViewerPosIds] = useState<Na3PositionId[]>([]);
  const [downloaderPosIds, setDownloaderPosIds] = useState<Na3PositionId[]>([]);
  const [approverPosIds, setApproverPosIds] = useState<Na3PositionId[]>([]);

  const [docTitle, setDocTitle] = useState("");
  const [docVersion, setDocVersion] = useState("");

  const {
    helpers: { getByPositionIds: getDepartmentsByPositionIds },
  } = useNa3Departments();
  const {
    helpers: { createDocument },
  } = useNa3StdDocs();

  const form = useForm<FormValues>({
    defaultValues: {
      code: "",
      description: "",
      timeBetweenRevisionsDays: "",
      title: "",
      type: "",
      nextRevisionAt: "",
      versionNumber: "",
      file: [],
    },
  });

  const handleTimeBetweenRevisionsChange = useCallback(
    (timeDays: string) => {
      form.setValue(
        "nextRevisionAt",
        dayjs()
          .add(+timeDays, "months")
          .format()
      );
    },
    [form]
  );

  const handleFileNameTransform = useCallback(
    (file: UploadFile): UploadFile => ({
      ...file,
      fileName: `${docTitle}_v${docVersion}`,
    }),
    [docTitle, docVersion]
  );

  const handleSubmit = useCallback(
    (formValues: FormValues) => {
      const notifyError = createErrorNotifier("Erro ao criar o documento");

      const confirmModal = Modal.confirm({
        content: (
          <>
            Confirma a criação do document <em>{formValues.title.trim()}</em>?
          </>
        ),
        okText: "Criar",
        onOk: async () => {
          if (formValues.type === "") {
            notifyError("Atribua um tipo ao documento.");
            return;
          }

          confirmModal.update({ okText: "Enviando..." });

          const operationRes = await createDocument({
            code: formValues.code,
            title: formValues.title,
            description: formValues.description,
            nextRevisionAt: formValues.nextRevisionAt,
            currentVersionNumber: +formValues.versionNumber,
            type: formValues.type,
            timeBetweenRevisionsMs:
              +formValues.timeBetweenRevisionsDays * 24 * 60 * 60 * 1000,
            permissions: {
              approve: viewerPosIds,
              download: downloaderPosIds,
              print: viewerPosIds,
              read: approverPosIds,
            },
          });

          if (operationRes.error) {
            notifyError(operationRes.error.message);
          } else {
            notification.success({
              description: (
                <>
                  Documento <em>({formValues.title.trim()})</em> criado com
                  sucesso!
                </>
              ),
              message: "Documento criado",
            });

            form.resetForm();
            onSubmit?.();
          }
        },
        title: "Criar documento?",
      });
    },
    [
      form,
      viewerPosIds,
      downloaderPosIds,
      approverPosIds,
      onSubmit,
      createDocument,
    ]
  );

  return (
    <Form
      form={form}
      onSubmit={handleSubmit}
      requiredPrivileges={["docs_std_write_new"]}
    >
      <Row gutter={16}>
        <Col lg={16} md={14} sm={12} xl={18} xs={24} xxl={20}>
          <FormField
            label="Tipo"
            name={form.fieldNames.type}
            options={getStdDocTypeSelectOptions()}
            rules={{ required: "Selecione o tipo do documento" }}
            type="select"
          />
        </Col>

        <Col lg={8} md={10} sm={12} xl={6} xs={24} xxl={4}>
          <FormField
            label="Código"
            name={form.fieldNames.code}
            rules={{ required: "Defina o código do documento" }}
            type="input"
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col lg={16} md={14} sm={12} xl={18} xs={24} xxl={20}>
          <FormField
            label="Título"
            name={form.fieldNames.title}
            onValueChange={setDocTitle}
            rules={{ required: "Atribua um título ao documento" }}
            type="input"
          />
        </Col>

        <Col lg={8} md={10} sm={12} xl={6} xs={24} xxl={4}>
          <FormField
            label="Versão vigente"
            name={form.fieldNames.versionNumber}
            noDecimal={true}
            onValueChange={setDocVersion}
            prefix="v."
            rules={{ required: "Defina a última versão vigente do documento" }}
            type="number"
          />
        </Col>
      </Row>

      <FormField
        label="Descrição"
        name={form.fieldNames.description}
        rules={{ required: "Descreva sucintamente o documento" }}
        type="textArea"
      />

      <Divider />

      <Row gutter={16}>
        <Col md={12} xs={24}>
          <FormField
            label="Período entre revisões"
            name={form.fieldNames.timeBetweenRevisionsDays}
            noDecimal={true}
            onValueChange={handleTimeBetweenRevisionsChange}
            rules={{
              required: "Defina o período mínimo entre revisões",
              min: { value: 0, message: "Deve ser maior que zero" },
            }}
            suffix="meses"
            type="number"
          />
        </Col>

        <Col md={12} xs={24}>
          <FormField
            disabled={true}
            label="Data da próxima revisão"
            name={form.fieldNames.nextRevisionAt}
            rules={{ required: "Defina o período mínimo entre revisões" }}
            type="date"
          />
        </Col>
      </Row>

      <Divider />

      <Row gutter={16}>
        <Col md={8} xs={24}>
          <FormItem
            description={
              <>
                Selecione as funções que poderão <strong>visualizar</strong> o
                documento.
              </>
            }
            label="Permissões de visualização"
          />
        </Col>

        <Col md={16} xs={24}>
          <Na3PositionSelect
            errorMessage="Defina as posições com permissão de visualização"
            onValueChange={setViewerPosIds}
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col md={8} xs={24}>
          <FormItem
            description={
              <>
                Selecione as posições que poderão <strong>baixar</strong> o
                documento.
              </>
            }
            label="Permissões de download"
          />
        </Col>

        <Col md={16} xs={24}>
          <Na3PositionSelect
            errorMessage="Defina as posições com permissão de download"
            onValueChange={setDownloaderPosIds}
            selectableDepartments={getDepartmentsByPositionIds(viewerPosIds)}
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col md={8} xs={24}>
          <FormItem
            description={
              <>
                Selecione as funções que poderão <strong>aprovar</strong> o
                documento.
              </>
            }
            label="Permissões de aprovação"
          />
        </Col>

        <Col md={16} xs={24}>
          <Na3PositionSelect
            errorMessage="Defina as posições com permissão de aprovação"
            onValueChange={setApproverPosIds}
            selectableDepartments={getDepartmentsByPositionIds([
              "diretoria.diretor-operacoes",
              "diretoria.diretor-financeiro",
            ])}
          />
        </Col>
      </Row>

      <Divider />

      <FormField
        disabled={!docTitle || !docVersion}
        fileTransform={handleFileNameTransform}
        helpWhenDisabled="Defina o título e a versão do documento primeiro"
        hint={
          <>
            Anexe a última versão vigente
            {docVersion ? (
              <>
                {" "}
                <em>({docVersion})</em>
              </>
            ) : (
              ""
            )}{" "}
            do documento{docTitle ? ` "${docTitle}"` : ""}
          </>
        }
        label="Arquivo"
        name={form.fieldNames.file}
        rules={{ required: "Anexe o arquivo do documento" }}
        type="file"
      />

      <Divider />

      <SubmitButton label="Criar documento" labelWhenLoading="Enviando..." />
    </Form>
  );
}
