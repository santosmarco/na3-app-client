import { DataCard } from "@components";
import { useNa3StdDocs } from "@modules/na3-react";
import type { Na3StdDocument } from "@modules/na3-types";
import React, { useMemo } from "react";

import { DocsStdCardHeader } from "./DocsStdCardHeader";

type DocsStdCardProps = {
  doc: Na3StdDocument;
  onClick: ((stdDocument: Na3StdDocument) => void) | null | undefined;
};

export function DocsStdCard({ doc, onClick }: DocsStdCardProps): JSX.Element {
  const {
    helpers: { getDocumentStatus, getDocumentLatestVersion },
  } = useNa3StdDocs();

  const docVersion = useMemo(
    () => getDocumentLatestVersion(doc),
    [getDocumentLatestVersion, doc]
  );

  return (
    <DataCard
      data={doc}
      header={
        <DocsStdCardHeader
          docStatus={getDocumentStatus(doc)}
          docType={doc.type}
        />
      }
      onClick={onClick}
      preTitle={docVersion ? `v.${docVersion.number}` : undefined}
      title={doc.title}
    >
      {doc.description}
    </DataCard>
  );
}
