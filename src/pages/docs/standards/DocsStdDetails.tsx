import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import type { PdfViewerDocLoadEvent } from "@components";
import {
  Divider,
  DocsStdAccessDeniedResult,
  DocsStdEditButton,
  DocsStdInfo,
  DocsStdReadPendingAlert,
  DocsStdRejectButton,
  DocsStdViewPdfButton,
  Page,
  PageActionButtons,
  PageDescription,
  PageTitle,
  PdfViewer,
  PrintPrevent,
  Result404,
} from "@components";
import { useBreadcrumb, useFileDownload } from "@hooks";
import { useNa3Auth, useNa3StdDocs } from "@modules/na3-react";
import { createErrorNotifier, numberToWords, timestampToStr } from "@utils";
import { Button, Grid, message, Modal, notification, Typography } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

type DocsStdDetailsPageProps = {
  docId: string;
};

export function DocsStdDetailsPage({
  docId,
}: DocsStdDetailsPageProps): JSX.Element {
  const history = useHistory();
  const breakpoint = Grid.useBreakpoint();

  const [isViewingPdf, setIsViewingPdf] = useState(false);

  const { setExtra: setBreadcrumbExtra } = useBreadcrumb();
  const { download } = useFileDownload();

  const { loading: userLoading, currentUser } = useNa3Auth();
  const {
    loading: docLoading,
    helpers: {
      getDocumentById,
      getDocumentLatestVersion,
      getUserPermissionsForDocument,
      getUserAcknowledgment,
      getUserDownloads,
      getDocumentDownloadUrl,
      getDocumentStatus,
      registerAcknowledgment,
      registerDownload,
      approveDocumentVersion,
      rejectDocumentVersion,
    },
  } = useNa3StdDocs();

  const doc = useMemo(() => getDocumentById(docId), [getDocumentById, docId]);

  const docVersion = useMemo(
    () => (doc ? getDocumentLatestVersion(doc) : undefined),
    [getDocumentLatestVersion, doc]
  );

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

  const handlePdfViewerShow = useCallback(() => {
    setIsViewingPdf(true);
  }, []);

  const handlePdfViewerHide = useCallback(() => {
    setIsViewingPdf(false);
  }, []);

  const handleGetPdfUrl = useCallback(async (): Promise<string> => {
    if (!doc) {
      throw new Error(
        "Não foi encontrado nenhum documento válido para o ID requisitado."
      );
    }
    const downloadUrlRes = await getDocumentDownloadUrl(doc);
    if (downloadUrlRes.error) {
      notification.error({
        description: downloadUrlRes.error.message,
        message: "Erro ao obter o documento",
      });
      throw new Error(downloadUrlRes.error.message);
    }
    return downloadUrlRes.data;
  }, [doc, getDocumentDownloadUrl]);

  const handleAcknowledgment = useCallback(async () => {
    if (!doc || !currentUser || userAcknowledgment) {
      return;
    }

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
            <em>(v.{ackRes.data.version.number})</em> foi registrada com
            sucesso!
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
  }, [doc, currentUser, userAcknowledgment, registerAcknowledgment]);

  const handlePdfDocLoad = useCallback(
    ({ doc }: PdfViewerDocLoadEvent) => {
      if (!userAcknowledgment && doc.numPages === 1) {
        setTimeout(() => {
          void handleAcknowledgment();
        }, 2000);
      }
    },
    [userAcknowledgment, handleAcknowledgment]
  );

  const handlePdfDownload = useCallback(() => {
    const notifyError = createErrorNotifier("Erro ao baixar o arquivo");

    if (!doc) {
      notifyError(
        "Não foi possivel obter o documento. Tente novamente mais tarde."
      );
      return;
    }
    if (!currentUser) {
      notifyError("Você precisa entrar com a sua conta primeiro.");
      return;
    }

    const userDownloadCount = getUserDownloads(doc, currentUser).length;

    const confirmModal = Modal.confirm({
      title: "Atenção!",
      content: (
        <>
          Por motivos de segurança, baixe este documento apenas quando realmente
          necessário.
          {userDownloadCount > 0 && (
            <>
              <Divider />
              Você já baixou este documento{" "}
              <strong>
                {numberToWords(userDownloadCount, { gender: "f" })}
              </strong>{" "}
              vez{userDownloadCount > 1 ? "es" : ""}.
            </>
          )}
        </>
      ),
      okText: "Baixar mesmo assim",
      onOk: async () => {
        confirmModal.update({ okText: "Baixando..." });

        try {
          const registerRes = await registerDownload(doc.id);

          if (registerRes.error) {
            notifyError(registerRes.error.message);
            return;
          }

          const pdfDownloadUrl = await handleGetPdfUrl();

          await download(
            pdfDownloadUrl,
            `${doc.title}${docVersion ? `_v${docVersion.number}` : ""}.pdf`
          );

          void message.success("Download concluído");
        } catch (err) {
          if (err instanceof Error) {
            notifyError(err.message);
          } else {
            notifyError(
              "Um erro desconhecido ocorreu. Por favor, entre em contato com o administrador do sistema."
            );
          }
        }
      },
    });
  }, [
    doc,
    docVersion,
    currentUser,
    getUserDownloads,
    handleGetPdfUrl,
    registerDownload,
    download,
  ]);

  const handleDocApprove = useCallback(() => {
    const confirmModal = Modal.confirm({
      title: "Aprovar documento?",
      content: (
        <>
          <Typography.Paragraph>
            <strong>Atenção!</strong> Uma vez aprovado, o documento ficará
            disponível imediatamente.
          </Typography.Paragraph>
          <Typography.Text>Tem certeza que deseja continuar?</Typography.Text>
        </>
      ),
      okText: "Continuar e aprovar",
      onOk: async () => {
        const notifyError = createErrorNotifier("Erro ao aprovar o documento");

        confirmModal.update({ okText: "Enviando aprovação..." });

        if (!doc) {
          notifyError(
            "Não foi possivel vincular um documento à aprovação. Tente novamente mais tarde."
          );
          return;
        }

        const approvalRes = await approveDocumentVersion(doc.id);

        if (approvalRes.error) {
          notifyError(approvalRes.error.message);
        } else {
          notification.success({
            message: "Documento aprovado",
            description: (
              <>
                Versão {approvalRes.data.version.number} do documento{" "}
                <strong>{doc.title}</strong> aprovada com sucesso!
              </>
            ),
          });
        }
      },
    });
  }, [doc, approveDocumentVersion]);

  const handleDocReject = useCallback(
    ({ reason }: { reason: string }) => {
      const notifyError = createErrorNotifier("Erro ao rejeitar o documento");

      if (!doc || !docVersion) {
        notifyError(
          "Não foi possivel vincular um documento à solicitação de recusa. Tente novamente mais tarde."
        );
        return;
      }

      const confirmModal = Modal.confirm({
        title: "Rejeitar documento?",
        content: `Confirma o rejeite desta versão (v.${docVersion.number}) do documento "${doc.title}"?`,
        okText: "Rejeitar",
        onOk: async () => {
          confirmModal.update({ okText: "Enviando recusa..." });

          const rejectionRes = await rejectDocumentVersion(doc.id, {
            comment: reason,
          });

          if (rejectionRes.error) {
            notifyError(rejectionRes.error.message);
          } else {
            notification.info({
              message: "Documento rejeitado",
              description: (
                <>
                  Versão {rejectionRes.data.version.number} do documento{" "}
                  <strong>{doc.title}</strong> rejeitada.
                </>
              ),
            });

            history.push("/docs/normas");
          }
        },
      });
    },
    [doc, docVersion, history, rejectDocumentVersion]
  );

  const handleNavigateBack = useCallback(() => {
    history.replace("/docs/normas");
  }, [history]);

  useEffect(() => {
    setBreadcrumbExtra(
      doc?.title &&
        `${doc.title}${docVersion ? ` (v.${docVersion.number})` : ""}`
    );
  }, [setBreadcrumbExtra, doc, docVersion]);

  console.log(userPermissions);

  return doc && currentUser ? (
    userPermissions?.read ? (
      <PrintPrevent disabled={userPermissions.print}>
        {isViewingPdf ? (
          <PdfViewer
            actionHandlers={{ download: handlePdfDownload }}
            disabledActions={[
              !userPermissions.download ? "download" : undefined,
              !userPermissions.print ? "print" : undefined,
            ]}
            fullPage={true}
            onDocumentLoad={handlePdfDocLoad}
            onNavigateBack={handlePdfViewerHide}
            readProgressOptions={{
              active: docStatus === "approved",
              onComplete: handleAcknowledgment,
              forceComplete: !!userAcknowledgment,
              tooltip: "Progresso da leitura",
              tooltipWhenComplete: (
                <>
                  <div>
                    <strong>Você já leu este documento!</strong>
                  </div>
                  {userAcknowledgment && (
                    <em>em {timestampToStr(userAcknowledgment.timestamp)}</em>
                  )}
                </>
              ),
            }}
            title={doc.title}
            url={handleGetPdfUrl}
            version={docVersion?.number}
            watermark="default"
          />
        ) : (
          <>
            <PageTitle>{doc.title}</PageTitle>

            {docStatus === "approved" && !userAcknowledgment && (
              <DocsStdReadPendingAlert onViewPdf={handlePdfViewerShow} />
            )}

            <PageDescription>{doc.description}</PageDescription>

            <PageActionButtons>
              {userPermissions.approve && docStatus === "pending" && (
                <>
                  <Button
                    icon={<CheckOutlined />}
                    onClick={handleDocApprove}
                    type="primary"
                  >
                    Aprovar documento
                  </Button>

                  <DocsStdRejectButton
                    icon={<CloseOutlined />}
                    modalTitle="Rejeitar documento"
                    onRejectSubmit={handleDocReject}
                  >
                    Rejeitar{breakpoint.lg && " documento"}
                  </DocsStdRejectButton>
                </>
              )}

              {userPermissions.write && docStatus === "pending" && (
                <DocsStdEditButton doc={doc} />
              )}
            </PageActionButtons>

            <Divider marginBottom={12} />

            <Page scrollTopOffset={12}>
              <DocsStdInfo
                defaultOpen={breakpoint.lg}
                doc={doc}
                showPermissions={userPermissions.viewAdditionalInfo}
              />

              <Divider marginTop={12} />

              <DocsStdViewPdfButton
                disabled={!userPermissions.view}
                onClick={handlePdfViewerShow}
                tooltip={
                  !userPermissions.view &&
                  "Esse documento ainda não foi aprovado"
                }
              />
            </Page>
          </>
        )}
      </PrintPrevent>
    ) : (
      <DocsStdAccessDeniedResult onNavigateBack={handleNavigateBack} />
    )
  ) : (
    <Result404 backUrl="/docs/normas" isLoading={userLoading || docLoading}>
      O documento requisitado não existe ou foi desabilitado.
    </Result404>
  );
}
