import { PageAlert } from "@components";
import React from "react";

export function DocsStdReadPendingAlert(): JSX.Element {
  return (
    <PageAlert marginBottom="small" title="Leitura pendente" type="info">
      <strong>Atenção!</strong> Você ainda não marcou esta versão do documento
      como lida — role até o final da página e comunique sua leitura.
    </PageAlert>
  );
}
