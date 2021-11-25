import {
  Divider,
  MaintCreateProjectForm,
  Page,
  PageDescription,
  PageTitle,
} from "@components";
import React, { useCallback } from "react";
import { useHistory } from "react-router";

type PageProps = {
  isPredPrev: boolean;
};

export function MaintProjectsCreatePage({
  isPredPrev,
}: PageProps): JSX.Element {
  const history = useHistory();

  const handleNavigateBack = useCallback(() => {
    history.replace("/manutencao/projetos");
  }, [history]);

  return (
    <>
      <PageTitle>{isPredPrev ? "Nova Pred/Prev" : "Novo Projeto"}</PageTitle>
      <PageDescription>
        Defina {isPredPrev ? "a Pred/Prev" : "o projeto"}.
      </PageDescription>

      <Divider marginTop={0} />

      <Page scrollTopOffset={24}>
        <MaintCreateProjectForm
          isPredPrev={isPredPrev}
          onSubmit={handleNavigateBack}
        />
      </Page>
    </>
  );
}
