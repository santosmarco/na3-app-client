import {
  CheckOutlined,
  CloseOutlined,
  DownloadOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import {
  DataItem,
  Divider,
  DocsStdRejectButton,
  DocsStdStatusBadge,
  DocsStdTypeTag,
  PageActionButtons,
  PageAlert,
  PageDescription,
  PageTitle,
  PdfViewer,
  PrintPrevent,
  Result,
  Result404,
  Tag,
  UserAvatarGroup,
} from "@components";
import { useBreadcrumb, useFileDownload } from "@hooks";
import { useDevice, useNa3Auth, useNa3StdDocs } from "@modules/na3-react";
import { createErrorNotifier, numberToWords, timestampToStr } from "@utils";
import {
  Button,
  Col,
  Grid,
  message,
  Modal,
  notification,
  Row,
  Tooltip,
  Typography,
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

  const device = useDevice();
  const { loading: userLoading, currentUser } = useNa3Auth();
  const {
    loading: docLoading,
    helpers: {
      getDocumentById,
      getDocumentTypeFromTypeId,
      getDocumentLatestVersion,
      getUserPermissionsForDocument,
      getUserAcknowledgment,
      getDocumentAcknowledgedUsers,
      getDocumentDownloads,
      getUserDownloads,
      getDocumentDownloadUrl,
      getDocumentStatus,
      registerAcknowledgment,
      registerDownload,
      approveDocumentVersion,
      rejectDocumentVersion,
    },
  } = useNa3StdDocs();

  const viewerDisabledReason = useMemo(
    (): "breakpoint" | "browser" | undefined =>
      !breakpoint.md
        ? "breakpoint"
        : !/(chrome)|(edge)/g.test(device.model)
        ? "browser"
        : undefined,
    [breakpoint.md, device.model]
  );

  const doc = useMemo(() => getDocumentById(docId), [getDocumentById, docId]);

  const docType = useMemo(
    () => (doc ? getDocumentTypeFromTypeId(doc.type) : undefined),
    [getDocumentTypeFromTypeId, doc]
  );

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
      setUserIsAcknowledging(false);
    }
  }, [doc, currentUser, userAcknowledgment, registerAcknowledgment]);

  const handleDownloadPdf = useCallback(() => {
    if (!doc || !currentUser) return;

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
        const notifyError = createErrorNotifier("Erro ao baixar o arquivo");

        confirmModal.update({ okText: "Baixando..." });

        if (!doc || !pdfDownloadUrl) {
          notifyError(
            "Não foi possivel obter o documento. Tente novamente mais tarde."
          );
          return;
        }

        try {
          const registerRes = await registerDownload(doc.id);
          if (registerRes.error) {
            notifyError(registerRes.error.message);
            return;
          }
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
  }, [
    doc,
    currentUser,
    pdfDownloadUrl,
    fileDownloadError,
    getUserDownloads,
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
      if (!doc || !docVersion) return;

      const confirmModal = Modal.confirm({
        title: "Rejeitar documento?",
        content: `Confirma o rejeite desta versão (v.${docVersion.number}) do documento "${doc.title}"?`,
        okText: "Rejeitar",
        onOk: async () => {
          const notifyError = createErrorNotifier(
            "Erro ao rejeitar o documento"
          );

          confirmModal.update({ okText: "Enviando recusa..." });

          if (!doc) {
            notifyError(
              "Não foi possivel vincular um documento à solicitação de recusa. Tente novamente mais tarde."
            );
            return;
          }

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
    setBreadcrumbExtra(
      doc?.title &&
        `${doc.title}${docVersion ? ` (v.${docVersion.number})` : ""}`
    );
  }, [setBreadcrumbExtra, doc, docVersion]);

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

            <DocsStdRejectButton
              icon={<CloseOutlined />}
              modalTitle="Rejeitar documento"
              onRejectSubmit={handleDocReject}
            >
              Rejeitar{breakpoint.lg && " documento"}
            </DocsStdRejectButton>
          </PageActionButtons>
        )}

        <Divider marginBottom={12} />

        <Row>
          <Col xs={8} lg={4}>
            <DataItem
              label="Tipo"
              marginBottom={!breakpoint.lg}
              labelMarginBottom={breakpoint.lg ? 3 : undefined}
            >
              {docType ? (
                <DocsStdTypeTag type={docType} />
              ) : (
                <em>Indeterminado</em>
              )}
            </DataItem>
          </Col>

          <Col xs={8} lg={4}>
            <DataItem
              label="Versão"
              labelMarginBottom={breakpoint.lg ? 3 : undefined}
            >
              {docVersion ? (
                <Tag color="blue">v.{docVersion.number}</Tag>
              ) : (
                <em>Indeterminada</em>
              )}
            </DataItem>
          </Col>

          <Col xs={8} lg={4}>
            <DataItem
              label="Status"
              labelMarginBottom={breakpoint.lg ? 3 : undefined}
            >
              {docStatus ? (
                <DocsStdStatusBadge status={docStatus} variant="tag" />
              ) : (
                <em>Indeterminado</em>
              )}
            </DataItem>
          </Col>

          <Col xs={12} lg={6}>
            <DataItem label="Lido por" icon={<ReadOutlined />}>
              <UserAvatarGroup
                data={getDocumentAcknowledgedUsers(doc)}
                type="initials"
                onTooltipProps={(data) => ({
                  content: (
                    <>
                      <div>
                        <Typography.Text strong={true}>
                          {data.user.compactDisplayName}
                        </Typography.Text>
                      </div>
                      <Typography.Text italic={true}>
                        em {timestampToStr(data.event.timestamp)}
                      </Typography.Text>
                    </>
                  ),
                  placement: "topLeft",
                  arrowPointAtCenter: true,
                })}
                maxCount={5}
              />
            </DataItem>
          </Col>

          <Col xs={12} lg={6}>
            <DataItem label="Downloads" icon={<DownloadOutlined />}>
              <UserAvatarGroup
                data={getDocumentDownloads(doc)}
                type="initials"
                onTooltipProps={(data) => ({
                  content: (
                    <>
                      <div>
                        <Typography.Text strong={true}>
                          {data.user.compactDisplayName}
                        </Typography.Text>
                      </div>
                      <Typography.Text italic={true}>
                        em {timestampToStr(data.event.timestamp)}
                      </Typography.Text>
                    </>
                  ),
                  placement: "topLeft",
                  arrowPointAtCenter: true,
                })}
                maxCount={5}
              />
            </DataItem>
          </Col>
        </Row>

        <Divider marginTop={12} marginBottom={0} />

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
          disabled={
            viewerDisabledReason && (
              <Result
                status="warning"
                title={`${
                  viewerDisabledReason === "breakpoint"
                    ? "Aparelho"
                    : "Navegador"
                } não suportado`}
                description={
                  viewerDisabledReason === "breakpoint"
                    ? "Acesse em um computador para visualizar o documento"
                    : "Por favor, utilize o Google Chrome ou o Microsoft Edge para visualizar o documento"
                }
                paddingTop={0}
              />
            )
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
