import { DocsCreateStdForm, DocsStdList, ListFormPage } from "@components";
import { useQuery } from "@hooks";
import { useNa3StdDocs } from "@modules/na3-react";
import React, { useCallback } from "react";
import { useHistory } from "react-router";

export function DocsStdHomePage(): JSX.Element {
  const history = useHistory();
  const query = useQuery("id");

  const stdDocs = useNa3StdDocs();

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
    <>DETAILS</>
  ) : (
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
      title="Docs • Normas/Procedimentos"
    />
  );
}
