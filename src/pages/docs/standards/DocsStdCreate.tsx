import { CreateFormPage, DocsCreateStdForm } from "@components";
import React from "react";

export function DocsStdCreatePage(): JSX.Element {
  return (
    <CreateFormPage
      backUrl="/docs/normas"
      description="Defina o documento."
      title="Nova Norma/Procedimento"
    >
      <DocsCreateStdForm />
    </CreateFormPage>
  );
}
