import { CreateFormPage, MaintCreateServiceOrderForm } from "@components";
import React from "react";

export function MaintServiceOrdersCreatePage(): JSX.Element {
  return (
    <CreateFormPage
      backUrl="/manutencao/os"
      description="Defina a ordem de serviço."
      title="Abrir OS"
    >
      <MaintCreateServiceOrderForm />
    </CreateFormPage>
  );
}
