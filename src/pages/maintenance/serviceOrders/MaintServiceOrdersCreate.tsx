import {
  Divider,
  MaintCreateServiceOrderForm,
  Page,
  PageDescription,
  PageTitle,
} from "@components";
import React, { useCallback } from "react";
import { useHistory } from "react-router";

export function MaintServiceOrdersCreatePage(): JSX.Element {
  const history = useHistory();

  const handleNavigateBack = useCallback(() => {
    history.replace("/manutencao/os");
  }, [history]);

  return (
    <>
      <PageTitle>Abrir OS</PageTitle>
      <PageDescription>Defina a ordem de serviço.</PageDescription>

      <Divider marginTop={0} />

      <Page scrollTopOffset={24}>
        <MaintCreateServiceOrderForm onSubmit={handleNavigateBack} />
      </Page>
    </>
  );
}
