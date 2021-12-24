import {
  Divider,
  DocsCreateStdForm,
  DocsStdList,
  DocsStdTableList,
  ListFormPage,
  TablePage,
} from "@components";
import { useFileDownload, useQuery } from "@hooks";
import { useCurrentUser, useNa3StdDocs } from "@modules/na3-react";
import type { Na3StdDocument, Na3StdDocumentVersion } from "@modules/na3-types";
import { createErrorNotifier, numberToWords } from "@utils";
import { message, Modal, notification } from "antd";
import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router";

import { DocsStdDetailsPage } from "./DocsStdDetails";

export function DocsStdHomePage(): JSX.Element {
  const history = useHistory();

  const query = useQuery(["id", "view"]);

  const { download } = useFileDownload();

  const currentUser = useCurrentUser();
  const stdDocs = useNa3StdDocs();

  const readableDocs = useMemo(
    (): Na3StdDocument[] =>
      currentUser && stdDocs.data
        ? stdDocs.data.filter((doc) => {
            const docVersion = stdDocs.helpers.getDocumentLatestVersionForUser(
              doc,
              currentUser
            );

            return (
              docVersion &&
              stdDocs.helpers.userHasDocumentPermissions(
                currentUser,
                doc,
                docVersion,
                "read"
              )
            );
          })
        : [],
    [currentUser, stdDocs.data, stdDocs.helpers]
  );

  const pageTitle = useMemo(() => "Docs • Normas/Procedimentos", []);

  const handleStdDocCreateClick = useCallback(() => {
    history.push("/docs/normas/novo");
  }, [history]);

  const handleStdDocSelect = useCallback(
    (doc: Na3StdDocument) => {
      history.push(`/docs/normas?id=${doc.id}`);
    },
    [history]
  );

  const handleStdDocFileUrl = useCallback(
    async (
      doc: Na3StdDocument | undefined,
      docVersion?: Na3StdDocumentVersion
    ): Promise<string> => {
      const docNotFoundError = new Error(
        "Não foi possível obter o documento. Tente novamente mais tarde."
      );

      if (!doc) {
        throw docNotFoundError;
      }
      if (!currentUser) {
        throw new Error("Você precisa entrar com a sua conta primeiro.");
      }

      const { getDocumentVersionDownloadUrl, getDocumentLatestVersionForUser } =
        stdDocs.helpers;

      const docVersionToUse =
        docVersion || getDocumentLatestVersionForUser(doc, currentUser);

      if (!docVersionToUse) {
        throw docNotFoundError;
      }

      const downloadUrlRes = await getDocumentVersionDownloadUrl(
        doc,
        docVersionToUse
      );

      if (downloadUrlRes.error) {
        notification.error({
          description: downloadUrlRes.error.message,
          message: "Erro ao obter o documento",
        });

        throw new Error(downloadUrlRes.error.message);
      }

      return downloadUrlRes.data;
    },
    [currentUser, stdDocs.helpers]
  );

  const handleStdDocFileDownload = useCallback(
    (doc: Na3StdDocument | undefined) => {
      const notifyError = createErrorNotifier("Erro ao baixar o arquivo");

      if (!doc) {
        notifyError(
          "Não foi possível obter o documento. Tente novamente mais tarde."
        );
        return;
      }
      if (!currentUser) {
        notifyError("Você precisa entrar com a sua conta primeiro.");
        return;
      }

      const {
        getUserDownloads,
        registerDownload,
        getDocumentLatestVersionForUser,
      } = stdDocs.helpers;

      const docVersion = getDocumentLatestVersionForUser(doc, currentUser);

      const userDownloadCount = getUserDownloads(
        doc,
        currentUser,
        docVersion?.id
      ).length;

      const confirmModal = Modal.confirm({
        title: "Atenção!",
        content: (
          <>
            Por motivos de segurança, baixe este documento apenas quando
            realmente necessário.
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

            const docFileDownloadUrl = await handleStdDocFileUrl(doc);

            await download(
              docFileDownloadUrl,
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
    },
    [currentUser, stdDocs.helpers, download, handleStdDocFileUrl]
  );

  return query.id ? (
    <DocsStdDetailsPage
      docId={query.id}
      onDocFileDownload={handleStdDocFileDownload}
      onDocFileUrl={handleStdDocFileUrl}
      viewerIsOpen={!!query.view}
    />
  ) : currentUser?.hasPrivileges("docs_std_write_new") ? (
    <ListFormPage
      actions={[{ label: "Novo documento", onClick: handleStdDocCreateClick }]}
      form={<DocsCreateStdForm />}
      formTitle="Novo Documento"
      list={
        <DocsStdList
          data={readableDocs}
          errorMsg={stdDocs.error?.message}
          loading={stdDocs.loading}
          onSelectDoc={handleStdDocSelect}
        />
      }
      listTitle="Seus Documentos"
      title={pageTitle}
    />
  ) : (
    <TablePage title={pageTitle}>
      <DocsStdTableList
        data={readableDocs}
        onDocFileDownload={handleStdDocFileUrl}
      />
    </TablePage>
  );
}
