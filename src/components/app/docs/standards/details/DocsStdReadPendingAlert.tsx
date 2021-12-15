import { PageAlert } from "@components";
import React from "react";

export function DocsStdReadPendingAlert(): JSX.Element {
  return (
    <PageAlert marginBottom="small" title="Leitura pendente" type="info">
      <strong>Atenção!</strong> Ainda não identificamos sua leitura deste
      documento. Por favor, clique em &quot;Acessar documento&quot; e o leia até
      o final para registrá-la.
    </PageAlert>
  );
}
