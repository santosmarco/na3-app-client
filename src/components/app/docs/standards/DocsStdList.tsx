import { List } from "@components";
import type { Na3StdDocument } from "@modules/na3-types";
import React, { useCallback } from "react";

import { DocsStdCard } from "./card/DocsStdCard";

type DocsStdListProps = {
  data: Na3StdDocument[] | null;
  errorMsg: string | undefined;
  loading: boolean;
  onSelectDoc: ((stdDocument: Na3StdDocument) => void) | null | undefined;
};

export function DocsStdList({
  data,
  loading,
  errorMsg,
  onSelectDoc,
}: DocsStdListProps): JSX.Element {
  const handleRenderItem = useCallback(
    (stdDoc: Na3StdDocument) => {
      return <DocsStdCard doc={stdDoc} onClick={onSelectDoc} />;
    },
    [onSelectDoc]
  );

  const handleFilterItemOnSearch = useCallback(
    (query: string): Na3StdDocument[] =>
      data?.filter((doc) => {
        const formattedQuery = query.trim().toLowerCase();
        return (
          doc.title.toLowerCase().includes(formattedQuery) ||
          doc.description.toLowerCase().includes(formattedQuery) ||
          doc.code.toLowerCase().includes(formattedQuery)
        );
      }) || [],
    [data]
  );

  return (
    <List
      data={data}
      error={errorMsg}
      filterItem={handleFilterItemOnSearch}
      isLoading={loading}
      renderItem={handleRenderItem}
      verticalSpacing={8}
    />
  );
}
