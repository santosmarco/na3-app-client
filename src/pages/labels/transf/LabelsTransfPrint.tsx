import { LabelsTransfList, PageDescription, PageTitle } from "@components";
import { useQuery } from "@hooks";
import { useNa3TransfLabelTemplates } from "@modules/na3-react";
import type { Na3TransfLabelTemplate } from "@modules/na3-types";
import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";

import { LabelsTransfPrintTemplatePage } from "./LabelsTransfPrintTemplate";

export function LabelsTransfPrintPage(): JSX.Element {
  const history = useHistory();
  const query = useQuery("modelo");

  const {
    helpers: { getUserTemplates },
  } = useNa3TransfLabelTemplates();

  const listData = useMemo(() => getUserTemplates() || [], [getUserTemplates]);

  const handleSelectTemplate = useCallback(
    (template: Na3TransfLabelTemplate) => {
      history.push(`/etiquetas/imprimir/transferencia?modelo=${template.id}`);
    },
    [history]
  );

  return query.modelo ? (
    <LabelsTransfPrintTemplatePage templateId={query.modelo} />
  ) : (
    <>
      <PageTitle>Etiquetas • Transferência</PageTitle>
      <PageDescription>
        Selecione um modelo de etiqueta para imprimir.
      </PageDescription>

      <LabelsTransfList
        data={listData}
        onSelectTemplate={handleSelectTemplate}
      />
    </>
  );
}
