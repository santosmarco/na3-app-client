import type { UploadFile } from "@components";
import { Divider, Form, FormField, PageAlert, SubmitButton } from "@components";
import { DEFAULT_APPROVER_POS_IDS } from "@config";
import { useForm } from "@hooks";
import { useNa3StdDocs } from "@modules/na3-react";
import type {
  Na3PositionId,
  Na3StdDocument,
  Na3StdDocumentTypeId,
  Na3StdDocumentVersion,
} from "@modules/na3-types";
import { createErrorNotifier, getStdDocTypeSelectOptions } from "@utils";
import { Col, Modal, notification, Row } from "antd";
import dayjs from "dayjs";
import React, { useCallback, useState } from "react";

import { DocsStdPermissionsSelect } from "./DocsStdPermissionsSelect";

type DocsCreateStdFormProps = {
  onSubmit?: () => void;
  editingDoc?: Na3StdDocument;
  version?: Na3StdDocumentVersion;
  upgrade?: boolean;
};

type FormValues = {
  code: string;
  description: string;
  fileList: UploadFile[];
  nextRevisionAt: string;
  timeBetweenRevisionsDays: string;
  title: string;
  type: Na3StdDocumentTypeId | "";
  versionNumber: string;
  comment: string;
};

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

export function DocsCreateStdForm({
  onSubmit,
  editingDoc,
  version,
  upgrade,
}: DocsCreateStdFormProps): JSX.Element {
  const [viewerPosIds, setViewerPosIds] = useState<Na3PositionId[]>(
    editingDoc?.permissions.read || []
  );
  const [printerPosIds, setPrinterPosIds] = useState<Na3PositionId[]>(
    editingDoc?.permissions.print || []
  );
  const [downloaderPosIds, setDownloaderPosIds] = useState<Na3PositionId[]>(
    editingDoc?.permissions.download || []
  );
  const [approverPosIds, setApproverPosIds] = useState<Na3PositionId[]>(
    editingDoc?.permissions.approve || DEFAULT_APPROVER_POS_IDS
  );

  const {
    helpers: { createDocument, editDocumentVersion, upgradeDocument },
  } = useNa3StdDocs();

  const form = useForm<FormValues>({
    defaultValues: {
      code: editingDoc?.code || "",
      description: editingDoc?.description || "",
      timeBetweenRevisionsDays: (
        (editingDoc?.timeBetweenRevisionsMs || 0) / MILLISECONDS_IN_A_DAY || ""
      ).toString(),
      title: editingDoc?.title || "",
      type: editingDoc?.type || "",
      nextRevisionAt: editingDoc?.nextRevisionAt || "",
      versionNumber: version?.number
        ? (upgrade ? version.number + 1 : version.number).toString()
        : "",
      fileList: [],
      comment: "",
    },
  });

  const handleTimeBetweenRevisionsChange = useCallback(
    (timeDays: string) => {
      form.setValue(
        "nextRevisionAt",
        dayjs()
          .add(+timeDays, "months")
          .startOf("month")
          .format()
      );
    },
    [form]
  );

  const handleSubmit = useCallback(
    (formValues: FormValues) => {
      const notifyError = createErrorNotifier(
        `Erro ao ${
          editingDoc ? "editar" : upgrade ? "atualizar" : "criar"
        } o documento`
      );

      const confirmModal = Modal.confirm({
        content: (
          <>
            Confirma a{" "}
            {editingDoc ? "edição" : upgrade ? "atualização" : "criação"} do
            documento {`"${formValues.title.trim()}"`}{" "}
            <em>(v.{formValues.versionNumber})</em>?
          </>
        ),
        okText: editingDoc ? "Editar" : upgrade ? "Atualizar" : "Criar",
        onOk: async () => {
          if (formValues.type === "") {
            notifyError("Atribua um tipo ao documento.");
            return;
          }

          if (!formValues.fileList[0]?.originFileObj) {
            notifyError(
              "Anexe o arquivo referente à última versão vigente do documento."
            );
            return;
          }

          confirmModal.update({ okText: "Enviando..." });

          const titleTrimmed = formValues.title.trim();

          const docData = {
            code: formValues.code,
            title: titleTrimmed,
            description: formValues.description.trim(),
            nextRevisionAt: formValues.nextRevisionAt,
            currentVersionNumber: +formValues.versionNumber,
            type: formValues.type,
            timeBetweenRevisionsMs:
              +formValues.timeBetweenRevisionsDays * MILLISECONDS_IN_A_DAY,
            permissions: {
              read: viewerPosIds,
              print: printerPosIds,
              download: downloaderPosIds,
              approve: approverPosIds,
            },
            file: formValues.fileList[0].originFileObj,
            comment: formValues.comment.trim(),
          };

          const operationRes = await (editingDoc
            ? upgrade
              ? upgradeDocument(editingDoc.id, docData)
              : editDocumentVersion(editingDoc.id, docData)
            : createDocument(docData));

          if (operationRes.error) {
            notifyError(operationRes.error.message);
          } else {
            notification.success({
              description: (
                <>
                  Documento {`"${formValues.title.trim()}"`}{" "}
                  <em>(v.{formValues.versionNumber})</em>{" "}
                  {editingDoc ? "editado" : upgrade ? "atualizado" : "criado"}{" "}
                  com sucesso!
                </>
              ),
              message: `Documento ${
                editingDoc ? "editado" : upgrade ? "atualizado" : "criado"
              }`,
            });

            form.resetForm();
            onSubmit?.();
          }
        },
        title: `${
          editingDoc ? "Editar" : upgrade ? "Atualizar" : "Criar"
        } documento?`,
      });
    },
    [
      form,
      viewerPosIds,
      printerPosIds,
      downloaderPosIds,
      approverPosIds,
      editingDoc,
      upgrade,
      onSubmit,
      createDocument,
      editDocumentVersion,
      upgradeDocument,
    ]
  );

  return (
    <Form
      form={form}
      onSubmit={handleSubmit}
      requiredPrivileges={["docs_std_write_new"]}
    >
      {editingDoc && (
        <PageAlert>
          {upgrade ? (
            <>
              <strong>Atenção!</strong> Ao salvar suas alterações, uma nova
              versão para esse documento será criada. A versão atual continuará
              sendo mostrada aos usuários até que esta seja aprovada.
            </>
          ) : (
            <>
              <div>
                Esta versão ainda não foi aprovada. Suas edições serão salvas
                sobre o documento atual.
              </div>
              <div>
                Se você deseja atualizar esse documento, por favor, aguarde sua
                aprovação.
              </div>
            </>
          )}
        </PageAlert>
      )}

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
            autoUpperCase={true}
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
            rules={{ required: "Atribua um título ao documento" }}
            type="input"
          />
        </Col>

        <Col lg={8} md={10} sm={12} xl={6} xs={24} xxl={4}>
          <FormField
            disabled={!!editingDoc}
            label="Versão vigente"
            name={form.fieldNames.versionNumber}
            noDecimal={true}
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

      <DocsStdPermissionsSelect
        defaultValue={editingDoc?.permissions.read}
        errorMessage="Defina as posições com permissão de visualização"
        name="visualização"
        onValueChange={setViewerPosIds}
        required={true}
        verb="visualizar"
      />

      <DocsStdPermissionsSelect
        defaultValue={editingDoc?.permissions.print}
        name="impressão"
        onValueChange={setPrinterPosIds}
        selectablePositions={viewerPosIds}
        verb="imprimir"
      />

      <DocsStdPermissionsSelect
        defaultValue={editingDoc?.permissions.download}
        name="download"
        onValueChange={setDownloaderPosIds}
        selectablePositions={printerPosIds}
        verb="baixar"
      />

      <DocsStdPermissionsSelect
        defaultValue={
          editingDoc?.permissions.approve || DEFAULT_APPROVER_POS_IDS
        }
        disabled={true}
        name="aprovação"
        onValueChange={setApproverPosIds}
        required={true}
        verb="aprovar"
      />

      <Divider />

      <FormField
        acceptOnly="application/pdf"
        hint={
          editingDoc
            ? "Anexe a versão atualizada do documento"
            : "Anexe a última versão vigente do documento"
        }
        label="Arquivo"
        name={form.fieldNames.fileList}
        rules={{ required: "Anexe o arquivo do documento" }}
        type="file"
      />

      <Divider />

      <FormField
        hidden={!editingDoc}
        label="Comentário"
        name={form.fieldNames.comment}
        required={!!editingDoc}
        rules={{
          required: editingDoc && "Comente as alterações propostas",
        }}
        type="textArea"
      />

      {editingDoc && <Divider />}

      <SubmitButton
        label={
          editingDoc
            ? "Salvar alterações"
            : upgrade
            ? "Enviar atualização"
            : "Criar documento"
        }
        labelWhenLoading="Enviando..."
      />
    </Form>
  );
}
