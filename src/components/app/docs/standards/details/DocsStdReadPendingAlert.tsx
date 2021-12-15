import { PageAlert } from "@components";
import { Typography } from "antd";
import React from "react";

type DocsStdReadPendingAlertProps = {
  onViewPdf: () => void;
};

export function DocsStdReadPendingAlert({
  onViewPdf,
}: DocsStdReadPendingAlertProps): JSX.Element {
  return (
    <PageAlert marginBottom="small" title="Leitura pendente" type="info">
      <strong>Atenção!</strong> Ainda não identificamos sua leitura desta
      versão. Por favor,{" "}
      <Typography.Link onClick={onViewPdf}>acesse o documento</Typography.Link>{" "}
      e o leia até o final para registrá-la.
    </PageAlert>
  );
}
