import { ListFormPage } from "@components";
import { useQuery } from "@hooks";
import React, { useCallback } from "react";
import { useHistory } from "react-router";

export function DocsTransfHomePage(): JSX.Element {
  const history = useHistory();
  const query = useQuery("id");

  const handleTransfDocCreateClick = useCallback(() => {
    history.push("/docs/transferencia/nova");
  }, [history]);

  /*
  const handleTransfDocSelect = useCallback(
    (doc: { id: string }) => {
      history.push(`/docs/transferencia?id=${doc.id}`);
    },
    [history]
  );
  */

  return query.id ? (
    <>DETAILS</>
  ) : (
    <ListFormPage
      actions={[
        { label: "Nova transferência", onClick: handleTransfDocCreateClick },
      ]}
      form={<>FORM</>}
      formTitle="Nova Transferência"
      list={<>LIST</>}
      listTitle="Suas Transferências"
      title="Docs • Transferência"
    />
  );
}
