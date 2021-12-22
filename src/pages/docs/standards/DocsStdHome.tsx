import {
  DocsCreateStdForm,
  DocsStdList,
  DocsStdTableList,
  ListFormPage,
  TablePage,
} from "@components";
import { useQuery } from "@hooks";
import { useCurrentUser, useNa3StdDocs } from "@modules/na3-react";
import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router";

import { DocsStdDetailsPage } from "./DocsStdDetails";

export function DocsStdHomePage(): JSX.Element {
  const history = useHistory();
  const query = useQuery(["id", "view"]);

  const currentUser = useCurrentUser();
  const stdDocs = useNa3StdDocs();

  const pageTitle = useMemo(() => "Docs • Normas/Procedimentos", []);

  const handleStdDocCreateClick = useCallback(() => {
    history.push("/docs/normas/novo");
  }, [history]);

  const handleStdDocSelect = useCallback(
    (doc: { id: string }) => {
      history.push(`/docs/normas?id=${doc.id}`);
    },
    [history]
  );

  return query.id ? (
    <DocsStdDetailsPage docId={query.id} openViewer={!!query.view} />
  ) : currentUser?.hasPrivileges("docs_std_write_new") ? (
    <ListFormPage
      actions={[{ label: "Novo documento", onClick: handleStdDocCreateClick }]}
      form={<DocsCreateStdForm />}
      formTitle="Novo Documento"
      list={
        <DocsStdList
          data={stdDocs.data}
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
      <DocsStdTableList data={stdDocs.data} />
    </TablePage>
  );
}
