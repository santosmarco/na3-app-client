import {
  Divider,
  PageDescription,
  PageTitle,
  PdfViewer,
  PrintPrevent,
  Result,
  Result404,
} from "@components";
import { useBreadcrumb } from "@hooks";
import { useNa3Auth, useNa3StdDocs } from "@modules/na3-react";
import { Button, notification } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

type DocsStdDetailsPageProps = {
  docId: string;
};

export function DocsStdDetailsPage({
  docId,
}: DocsStdDetailsPageProps): JSX.Element {
  const history = useHistory();

  const [pdfDownloadUrl, setPdfDownloadUrl] = useState<string>();

  const { setExtra: setBreadcrumbExtra } = useBreadcrumb();

  const { loading: userLoading, currentUser } = useNa3Auth();
  const {
    loading: docLoading,
    helpers: {
      getDocumentById,
      getUserPermissionsForDocument,
      getDocumentDownloadUrl,
    },
  } = useNa3StdDocs();

  const doc = useMemo(() => getDocumentById(docId), [getDocumentById, docId]);

  const userPermissions = useMemo(
    () =>
      currentUser && doc
        ? getUserPermissionsForDocument(currentUser, doc)
        : undefined,
    [getUserPermissionsForDocument, currentUser, doc]
  );

  const handleNavigateBack = useCallback(() => {
    history.replace("/docs/normas");
  }, [history]);

  useEffect(() => {
    if (doc && currentUser && userPermissions?.read && !pdfDownloadUrl) {
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
  }, [
    doc,
    currentUser,
    userPermissions?.read,
    pdfDownloadUrl,
    getDocumentDownloadUrl,
  ]);

  useEffect(() => {
    setBreadcrumbExtra(doc?.title);
  }, [setBreadcrumbExtra, doc]);

  return doc && currentUser ? (
    userPermissions?.read ? (
      <PrintPrevent disabled={userPermissions?.print}>
        <PageTitle>{doc.title}</PageTitle>
        <PageDescription>{doc.description}</PageDescription>

        <Divider />

        {pdfDownloadUrl && <PdfViewer url={pdfDownloadUrl} />}
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
