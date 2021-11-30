import { DocsCreateStdForm, ListFormPage } from "@components";
import { useQuery } from "@hooks";
import React, { useCallback } from "react";
import { useHistory } from "react-router";

export function DocsStdHomePage(): JSX.Element {
  const history = useHistory();
  const query = useQuery("id");

  const handleStdDocCreateClick = useCallback(() => {
    history.push("/docs/normas/novo");
  }, [history]);

  /*
  const handleStdDocSelect = useCallback(
    (doc: { id: string }) => {
      history.push(`/docs/normas?id=${doc.id}`);
    },
    [history]
  );
  */

  return query.id ? (
    <>DETAILS</>
  ) : (
    <ListFormPage
      actions={[{ label: "Novo documento", onClick: handleStdDocCreateClick }]}
      form={<DocsCreateStdForm />}
      formTitle="Novo Documento"
      list={<>LIST</>}
      listTitle="Seus Documentos"
      title="Docs • Normas/Procedimentos"
    />
  );
}
