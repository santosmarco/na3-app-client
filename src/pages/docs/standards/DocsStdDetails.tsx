import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  UpOutlined,
} from "@ant-design/icons";
import type { PdfViewerDocLoadEvent } from "@components";
import {
  Divider,
  DocsStdAccessDeniedResult,
  DocsStdInfo,
  DocsStdModifyButton,
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
import { useBreadcrumb } from "@hooks";
import { useNa3Auth, useNa3StdDocs } from "@modules/na3-react";
import type { Na3StdDocument } from "@modules/na3-types";
import { createErrorNotifier, timestampToStr } from "@utils";
import { Button, Grid, Modal, notification, Typography } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

type DocsStdDetailsPageProps = {
  docId: string;
  onDocFileDownload: (doc: Na3StdDocument | undefined) => void;
  onDocFileUrl: (doc: Na3StdDocument | undefined) => Promise<string>;
  viewerIsOpen: boolean;
};

export function DocsStdDetailsPage({
  docId,
  viewerIsOpen,
  onDocFileDownload,
  onDocFileUrl,
}: DocsStdDetailsPageProps): JSX.Element {
  const history = useHistory();
  const breakpoint = Grid.useBreakpoint();

  const [isViewingPdf, setIsViewingPdf] = useState(viewerIsOpen);

  const { setExtra: setBreadcrumbExtra } = useBreadcrumb();

  const { loading: userLoading, currentUser } = useNa3Auth();
  const {
    loading: docLoading,
    helpers: {
      getDocumentById,
      getDocumentLatestVersionForUser,
      getUserPermissionsForDocument,
      getUserAcknowledgment,
      getDocumentVersionStatus,
      getDocumentActions,
      getDocumentAcknowledgedUsers,
      getDocumentDownloads,
      checkDocumentRequiresAcknowledgement,
      checkDocumentIsOutdated,
      registerAcknowledgment,
      approveDocumentVersion,
      rejectDocumentVersion,
    },
  } = useNa3StdDocs();

  const doc = useMemo(() => getDocumentById(docId), [getDocumentById, docId]);

  const docVersion = useMemo(
    () =>
      doc && currentUser
        ? getDocumentLatestVersionForUser(doc, currentUser)
        : undefined,
    [getDocumentLatestVersionForUser, doc, currentUser]
  );

  const docStatus = useMemo(
    () => (docVersion ? getDocumentVersionStatus(docVersion) : undefined),
    [docVersion, getDocumentVersionStatus]
  );

  const docRequiresAck = useMemo(
    () =>
      doc && docVersion && currentUser
        ? checkDocumentRequiresAcknowledgement(doc, docVersion, currentUser)
        : undefined,
    [checkDocumentRequiresAcknowledgement, doc, docVersion, currentUser]
  );

  const docActions = useMemo(
    () =>
      doc && docVersion && currentUser
        ? getDocumentActions(doc, docVersion, currentUser)
        : undefined,
    [doc, currentUser, docVersion, getDocumentActions]
  );

  const userPermissions = useMemo(
    () =>
      doc && docVersion && currentUser
        ? getUserPermissionsForDocument(doc, docVersion, currentUser)
        : undefined,
    [getUserPermissionsForDocument, doc, docVersion, currentUser]
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

  const handleDocFileUrl = useCallback(
    async (): Promise<string> => onDocFileUrl(doc),
    [doc, onDocFileUrl]
  );

  const handleDocFileDownload = useCallback((): void => {
    onDocFileDownload(doc);
  }, [doc, onDocFileDownload]);

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
      if (
        docStatus === "approved" &&
        !userAcknowledgment &&
        doc.numPages === 1
      ) {
        const timeout = setTimeout(() => {
          void handleAcknowledgment();
          clearTimeout(timeout);
        }, 2000);
      }
    },
    [docStatus, userAcknowledgment, handleAcknowledgment]
  );

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
          "Não foi possivel vincular um documento à sua rejeição. Tente novamente mais tarde."
        );
        return;
      }

      const confirmModal = Modal.confirm({
        title: "Rejeitar documento?",
        content: `Confirma o rejeite desta versão (v.${docVersion.number}) do documento "${doc.title}"?`,
        okText: "Rejeitar",
        onOk: async () => {
          confirmModal.update({ okText: "Enviando rejeição..." });

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

  return doc && currentUser ? (
    userPermissions?.read ? (
      <PrintPrevent disabled={userPermissions.print}>
        {isViewingPdf ? (
          <PdfViewer
            actionHandlers={{ download: handleDocFileDownload }}
            disabledActions={[
              !userPermissions.download ? "download" : undefined,
              !userPermissions.print ? "print" : undefined,
            ]}
            fullPage={true}
            onDocumentLoad={handlePdfDocLoad}
            onNavigateBack={handlePdfViewerHide}
            readProgressOptions={{
              visible: docRequiresAck && docStatus === "approved",
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
            url={handleDocFileUrl}
            version={docVersion?.number}
            watermark="default"
          />
        ) : (
          <>
            <PageTitle>{doc.title}</PageTitle>

            {docStatus === "approved" &&
              docRequiresAck &&
              !userAcknowledgment && (
                <DocsStdReadPendingAlert onViewPdf={handlePdfViewerShow} />
              )}

            <PageDescription>{doc.description}</PageDescription>

            {docActions && (
              <PageActionButtons>
                {/* eslint-disable-next-line array-callback-return */}
                {docActions.map((action): React.ReactNode => {
                  switch (action) {
                    case "edit":
                      return (
                        <DocsStdModifyButton doc={doc} icon={<EditOutlined />}>
                          Editar documento
                        </DocsStdModifyButton>
                      );
                    case "upgrade":
                      return (
                        <DocsStdModifyButton
                          doc={doc}
                          icon={<UpOutlined />}
                          upgrade={true}
                        >
                          Atualizar documento
                        </DocsStdModifyButton>
                      );
                    case "approve":
                      return (
                        <Button
                          icon={<CheckOutlined />}
                          onClick={handleDocApprove}
                          type="primary"
                        >
                          Aprovar documento
                        </Button>
                      );
                    case "reject":
                      return (
                        <DocsStdRejectButton
                          icon={<CloseOutlined />}
                          modalTitle="Rejeitar documento"
                          onRejectSubmit={handleDocReject}
                        >
                          Rejeitar{breakpoint.lg && " documento"}
                        </DocsStdRejectButton>
                      );
                  }
                })}
              </PageActionButtons>
            )}

            <Divider marginBottom={12} />

            <Page scrollTopOffset={12}>
              <DocsStdInfo
                defaultOpen={breakpoint.lg}
                doc={doc}
                docAcks={getDocumentAcknowledgedUsers(doc, docVersion?.id)}
                docDownloads={getDocumentDownloads(doc, docVersion?.id)}
                docIsOutdated={checkDocumentIsOutdated(doc)}
                docStatus={docStatus}
                docVersion={docVersion}
                showPermissions={userPermissions.viewAdditionalInfo}
                showTimeline={userPermissions.viewAdditionalInfo}
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
