import {
  Divider,
  LabelsTransfTemplateForm,
  Page,
  PageDescription,
  PageTitle,
} from "@components";
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

export function LabelsTransfCreateTemplatePage(): JSX.Element {
  const history = useHistory();

  const handleNavigateOnSubmit = useCallback(() => {
    history.push("/etiquetas/gerenciar/transferencia");
  }, [history]);

  return (
    <>
      <PageTitle>Novo modelo</PageTitle>
      <PageDescription>Preencha as informações do modelo.</PageDescription>

      <Divider marginTop={0} />

      <Page scrollTopOffset={24}>
        <LabelsTransfTemplateForm onSubmit={handleNavigateOnSubmit} />
      </Page>
    </>
  );
}
