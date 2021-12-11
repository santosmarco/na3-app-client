import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import {
  Divider,
  PageActionButtons,
  PageAlert,
  PageDescription,
  PageTitle,
  PdfViewer,
  PrintPrevent,
  Result,
  Result404,
} from "@components";
import { useBreadcrumb, useFileDownload } from "@hooks";
import { useNa3Auth, useNa3StdDocs } from "@modules/na3-react";
import { createErrorNotifier, timestampToStr } from "@utils";
import {
  Button,
  Col,
  Grid,
  message,
  Modal,
  notification,
  Row,
  Tooltip,
} from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

type DocsStdDetailsPageProps = {
  docId: string;
};

export function DocsStdDetailsPage({
  docId,
}: DocsStdDetailsPageProps): JSX.Element {
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState<string>();
  const [userIsAcknowledging, setUserIsAcknowledging] = useState(false);

  const history = useHistory();
  const breakpoint = Grid.useBreakpoint();

  const { setExtra: setBreadcrumbExtra } = useBreadcrumb();
  const { download, error: fileDownloadError } = useFileDownload();

  const { loading: userLoading, currentUser } = useNa3Auth();
  const {
    loading: docLoading,
    helpers: {
      getDocumentById,
      getDocumentLatestVersion,
      getUserPermissionsForDocument,
      getUserAcknowledgment,
      getDocumentDownloadUrl,
      getDocumentStatus,
      registerAcknowledgment,
    },
  } = useNa3StdDocs();

  const doc = useMemo(() => getDocumentById(docId), [getDocumentById, docId]);

  const docStatus = useMemo(
    () => (doc ? getDocumentStatus(doc) : undefined),
    [getDocumentStatus, doc]
  );

  const userPermissions = useMemo(
    () =>
      doc && currentUser
        ? getUserPermissionsForDocument(doc, currentUser)
        : undefined,
    [getUserPermissionsForDocument, doc, currentUser]
  );

  const userAcknowledgment = useMemo(
    () =>
      doc && currentUser ? getUserAcknowledgment(doc, currentUser) : undefined,
    [getUserAcknowledgment, doc, currentUser]
  );

  const handleNavigateBack = useCallback(() => {
    history.replace("/docs/normas");
  }, [history]);

  const handleAcknowledgment = useCallback(async () => {
    if (doc && currentUser && !userAcknowledgment) {
      setUserIsAcknowledging(true);
      const ackRes = await registerAcknowledgment(doc.id);
      if (ackRes.error) {
        notification.error({
          message: "Erro ao registrar leitura",
          description: ackRes.error.message,
        });
      } else {
        notification.success({
          message: "Leitura registrada",
          description: (
            <>
              Sua leitura do documento <strong>{doc.title}</strong>{" "}
              <em>(v.{getDocumentLatestVersion(doc)?.number || "—"})</em> foi
              registrada com sucesso!
              <br />
              <small>
                <em>
                  (em{" "}
                  {timestampToStr(ackRes.data.timestamp, {
                    includeSeconds: true,
                  })}
                  )
                </em>
              </small>
            </>
          ),
        });
      }
      setUserIsAcknowledging(false);
    }
  }, [
    doc,
    currentUser,
    userAcknowledgment,
    registerAcknowledgment,
    getDocumentLatestVersion,
  ]);

  const handleDownloadPdf = useCallback(() => {
    const confirmModal = Modal.confirm({
      title: "Atenção!",
      content:
        "Por motivos de segurança, baixe este documento apenas quando realmente necessário.",
      okText: "Baixar documento",
      onOk: async () => {
        const notifyError = createErrorNotifier("Erro ao baixar o arquivo");

        confirmModal.update({ okText: "Baixando..." });

        if (!doc || !pdfDownloadUrl) {
          notifyError(
            "Não foi possivel obter o documento. Tente novamente mais tarde."
          );
          return;
        }

        try {
          await download(pdfDownloadUrl, `${doc.title}.pdf`);
          void message.success("Download concluído");
        } catch (err) {
          if (fileDownloadError) {
            notifyError(fileDownloadError.message);
          } else {
            notifyError(
              "Um erro desconhecido ocorreu. Por favor, entre em contato com o administrador do sistema."
            );
          }
        }
      },
    });
  }, [doc, pdfDownloadUrl, fileDownloadError, download]);

  const handleDocApprove = useCallback(() => {
    return;
  }, []);

  useEffect(() => {
    if (doc && userPermissions?.read && !pdfDownloadUrl) {
      void (async (): Promise<void> => {
        const downloadUrlRes = await getDocumentDownloadUrl(doc);
        if (downloadUrlRes.error) {
          notification.error({
            description: downloadUrlRes.error.message,
            message: "Erro ao obter o documento",
          });
          setPdfDownloadUrl(undefined);
          return;
        }
        setPdfDownloadUrl(downloadUrlRes.data);
      })();
    }
  }, [doc, userPermissions?.read, pdfDownloadUrl, getDocumentDownloadUrl]);

  useEffect(() => {
    setBreadcrumbExtra(doc?.title);
  }, [setBreadcrumbExtra, doc]);

  return doc && currentUser ? (
    userPermissions?.read ? (
      <PrintPrevent disabled={userPermissions?.print}>
        <PageTitle>{doc.title}</PageTitle>

        {!userAcknowledgment && (
          <PageAlert marginBottom="small" title="Leitura pendente" type="info">
            <strong>Atenção!</strong> Você ainda não marcou esta versão do
            documento como lida — role até o final da página e comunique sua
            leitura.
          </PageAlert>
        )}

        <PageDescription>{doc.description}</PageDescription>

        {userPermissions?.approve && docStatus === "pending" && (
          <PageActionButtons>
            <Button
              icon={<CheckOutlined />}
              onClick={handleDocApprove}
              type="primary"
            >
              Aprovar documento
            </Button>
            <Button danger={true} icon={<CloseOutlined />} type="text">
              Rejeitar{breakpoint.lg && " documento"}
            </Button>
          </PageActionButtons>
        )}

        <Divider marginBottom={0} />

        <PdfViewer
          url={pdfDownloadUrl}
          title={doc.title}
          actions={
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <Tooltip
                  title={
                    userAcknowledgment
                      ? `Lido em ${timestampToStr(
                          userAcknowledgment.timestamp,
                          { includeSeconds: true }
                        )}`
                      : undefined
                  }
                  visible={userAcknowledgment ? undefined : false}
                >
                  <Button
                    block={true}
                    disabled={!!userAcknowledgment}
                    icon={userAcknowledgment && <CheckOutlined />}
                    loading={userIsAcknowledging}
                    onClick={handleAcknowledgment}
                    type="primary"
                  >
                    {userIsAcknowledging
                      ? "Enviando registro de leitura..."
                      : userAcknowledgment
                      ? "Você já leu este documento!"
                      : "Marcar como lido"}
                  </Button>
                </Tooltip>
              </Col>

              {userPermissions?.download && (
                <Col span={24}>
                  <Button block={true} onClick={handleDownloadPdf}>
                    Baixar documento
                  </Button>
                </Col>
              )}
            </Row>
          }
        />
      </PrintPrevent>
    ) : (
      <Result
        description="Você não tem acesso a este documento."
        extra={
          <Button onClick={handleNavigateBack} type="primary">
            Voltar
          </Button>
        }
        status="error"
        title="Acesso restrito"
      />
    )
  ) : (
    <Result404 backUrl="/docs/normas" isLoading={userLoading || docLoading}>
      O documento requisitado não existe ou foi desabilitado.
    </Result404>
  );
}
