import React, { useCallback } from "react";

import { useNa3TransfLabelTemplates } from "../../../modules/na3-react";
import type { Na3TransfLabelTemplate } from "../../../modules/na3-types";
import { List } from "../../lists/List";
import { LabelsTransfCard } from "./transfCard/LabelsTransfCard";

type LabelsTransfListProps = {
  data: Na3TransfLabelTemplate[];
  onSelectTemplate: (template: Na3TransfLabelTemplate) => void;
};

export function LabelsTransfList({
  data,
  onSelectTemplate,
}: LabelsTransfListProps): JSX.Element {
  const { error, loading } = useNa3TransfLabelTemplates();

  const handleRenderItem = useCallback(
    (item: Na3TransfLabelTemplate) => (
      <LabelsTransfCard data={item} onSelect={onSelectTemplate} />
    ),
    [onSelectTemplate]
  );

  const handleFilterItem = useCallback(
    (query: string): Na3TransfLabelTemplate[] =>
      data.filter((template) => {
        const formattedQuery = query.trim().toLowerCase();
        return (
          template.name.toLowerCase().includes(formattedQuery) ||
          template.productName.toLowerCase().includes(formattedQuery) ||
          template.productCode.toLowerCase().includes(formattedQuery) ||
          template.customerName.toLowerCase().includes(formattedQuery)
        );
      }) || [],
    [data]
  );

  return (
    <List
      data={data}
      error={error?.message}
      filterItem={handleFilterItem}
      isLoading={loading}
      renderItem={handleRenderItem}
      verticalSpacing={8}
    />
  );
}
