import { DataCard } from "@components";
import type { Na3StdDocument } from "@modules/na3-types";
import React from "react";

type DocsStdCardProps = {
  doc: Na3StdDocument;
  onClick: ((stdDocument: Na3StdDocument) => void) | null | undefined;
};

export function DocsStdCard({ doc, onClick }: DocsStdCardProps): JSX.Element {
  return (
    <DataCard data={doc} onClick={onClick} preTitle={`v.2`} title={doc.title}>
      {doc.description}
    </DataCard>
  );
}
