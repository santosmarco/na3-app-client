import { CreateFormPage, MaintCreateProjectForm } from "@components";
import React from "react";

type PageProps = {
  isPredPrev: boolean;
};

export function MaintProjectsCreatePage({
  isPredPrev,
}: PageProps): JSX.Element {
  return (
    <CreateFormPage
      backUrl="/manutencao/projetos"
      description={`Defina ${isPredPrev ? "a Pred/Prev" : "o projeto"}.`}
      title={isPredPrev ? "Nova Pred/Prev" : "Novo Projeto"}
    >
      <MaintCreateProjectForm isPredPrev={isPredPrev} />
    </CreateFormPage>
  );
}
