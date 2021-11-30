import { CreateFormPage, LabelsTransfTemplateForm } from "@components";
import React from "react";

export function LabelsTransfCreateTemplatePage(): JSX.Element {
  return (
    <CreateFormPage
      backUrl="/etiquetas/gerenciar/transferencia"
      description="Preencha as informações do modelo."
      title="Novo modelo"
    >
      <LabelsTransfTemplateForm />
    </CreateFormPage>
  );
}
